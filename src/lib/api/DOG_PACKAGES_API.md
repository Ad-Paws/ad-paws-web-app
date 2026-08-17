# Paquetes — guía de uso en el frontend

> **Este archivo reemplaza la documentación de `lib/api/dogPackages.api.ts`, que
> fue eliminado.** Sus queries (`activeDogPackages`, `checkDogServiceAvailability`)
> ya no existen en el schema y fallaban en runtime. Las operaciones vigentes
> están en `src/graphql/operations/packages.ts`, tipadas por codegen.

## Lo que cambió de fondo

### 1. Las cantidades son por servicio, no por paquete

`PackageItem.quantity` / `DogPackageBalance.initialQuantity`: `null` significa
ilimitado, un número es un cupo fijo. **Por item.** Un mismo paquete puede
vender "guardería L–V con cupo de 20 + noches ilimitadas L–J + 1 grooming".

Por eso `Package.type` (`QUANTITY` / `UNLIMITED` / `SUBSCRIPTION`) es solo una
etiqueta comercial: **nunca deduzcas de él si hay cupo**. Lee siempre el balance:

```ts
balance.remainingQuantity !== null
  ? `${balance.remainingQuantity} disponibles`
  : "Ilimitado";
```

### 2. La cobertura se decide por fecha

Cada saldo trae su propio `daysMask` (7 bits, bit 0 = domingo), **copiado en el
momento de la compra** — editar la plantilla no cambia lo ya vendido, así que
para mostrar los días hay que leer el mask del balance, no el del servicio. Usa
`daysMaskToShortLabel` de `@/utils/adapters` (62 → "L–V", 30 → "L–J").

La consecuencia práctica: una estancia puede quedar **cubierta a medias**. Con
"noches ilimitadas L–J", un miércoles→domingo son dos noches del paquete y dos
en efectivo, en una sola reservación.

### 3. El servidor aplica la cobertura solo

El cliente no busca el balance ni lo descuenta. Al crear la reservación el
backend resuelve la cobertura fecha por fecha y consume los saldos dentro de la
misma transacción. Para previsualizar, `quoteReservation` devuelve:

| Campo | Significado |
|---|---|
| `total` | Valuación completa, como si no hubiera paquete |
| `amountDue` | **Lo que se cobra**, ya descontada la cobertura |
| `coveredDates` | Qué fechas cubre el paquete |
| `addOns[].coveredByPackage` | Si un extra viene incluido |

**Cobrar `total` cuando hay cobertura es cobrar dos veces lo mismo.** El hook
`useQuoteBreakdown` (en `CheckInDialog/hooks`) concentra ese desglose.

## Operaciones

| Operación | Uso |
|---|---|
| `DOG_PACKAGES_QUERY` | Saldos de un perro. Reemplaza `activeDogPackages` |
| `COVERING_BALANCE_QUERY` | Si un paquete cubriría un servicio **en una fecha**. Reemplaza `checkDogServiceAvailability`, que no pedía fecha y por eso no podía responder bien |
| `PACKAGES_QUERY` | Catálogo que vende la empresa |
| `PURCHASE_PACKAGE_MUTATION` | Venta |
| `RENEW_DOG_PACKAGE_MUTATION` | Renovación |
| `CANCEL_DOG_PACKAGE_MUTATION` | Cancelación |

### Renovar crea un paquete nuevo

`renewDogPackage` **no resetea** los saldos del paquete actual: crea otro
`DogPackage` ligado por `renewedFrom`. Cada ciclo conserva sus propios saldos y
su ledger, y un cliente que no renueva simplemente no tiene sucesor.

En la UI eso significa tratar el resultado como **otro** paquete y refrescar la
lista — no como una actualización del que se renovó.

## Pendiente

No hay pantalla de administración de paquetes (crear plantillas con
entitlements mixtos, vender, renovar, ver ledger). Las operaciones ya están
listas para cuando se construya.
