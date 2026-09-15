# Dashboard de Inicio: fase "En mostrador"

_15 sep 2026 · pendiente · depende del spec de self check-in (`claude/spec-self-check-in.md` en el proyecto)_

El dashboard de Inicio ya tiene el rediseño sin "En mostrador": resumen del día, agenda agrupada por acción, ingresos y "Por cobrar". Este documento dice qué falta para agregar la cola de la tablet y el panel de Arribos. Los mockups están en el canvas "Dashboard de Inicio CasaPek", en las pantallas "día con movimiento", "hora pico en mostrador" y "panel de Arribos".

## 1. Backend (`ad-paws-backend`)

Todo sale de las fases K1–K5 del spec de self check-in. Esto es lo mínimo que el dashboard necesita de ellas:

| # | Cambio | Fase | Por qué lo necesita el dashboard |
|---|---|---|---|
| B1 | `ReservationStatus.ARRIVED`, en su propia migración y con las constantes centralizadas en `src/domain/reservation/status.ts` | K1 | Es el estado que identifica a quien espera en mostrador |
| B2 | `checkInReservation` acepta `PENDING` o `ARRIVED` | K1 | El botón "Recibir" es esta mutación |
| B3 | `reservationsOn(date)` incluye `ARRIVED`. Hoy filtra por fecha o `CHECKED_IN`; hay que agregar `{ status: "ARRIVED" }` al `OR`, porque un walk-in de ayer que siga `ARRIVED` también debe aparecer | K1 | La agenda y la cola salen de una sola consulta |
| B4 | `GuestStats.arrivedNow: Int!` = reservas `ARRIVED` (sin filtro de fecha) | K1 | Contador del sidebar sin cargar la lista completa |
| B5 | Evento `ARRIVAL_REGISTERED` en `ReservationEventType`, con mecanismo `QR_CODE` o `PHONE_LOOKUP` en `notes` o en un campo propio | K4 | "Llegó 8:03 · por QR", y la cola se ordena por la hora de este evento |
| B6 | **Nuevo, no está en el spec:** `Reservation.arrivedAt: DateTime` (la hora del evento B5, resuelta en el servidor) | — | Evita pedir `events { … }` por fila, que es una lista sin paginar y el límite de costo la tasa ×50 |
| B7 | "Descartar": `cancelReservation` para walk-ins creados por la tablet, y regresar a `PENDING` si la reserva ya existía. Para lo segundo falta una mutación, p. ej. `revertArrival(id)` | K5 | Acción del menú ⋯ |
| B8 | `DogQrToken`, `KioskDevice`, `@kiosk`, `kioskCheckIn` | K2–K4 | Sin la tablet no hay llegadas que mostrar |

Ajustes opcionales que mejoran lo que ya está publicado (no bloquean esta fase):

- **`DogBalance.oldestUnpaidAt`**: permitiría mostrar "Desde el 10 sept" en "Por cobrar".
- **`Reservation.amountDue` / `amountPaid`**: hoy `PARTIALLY_PAID` se muestra como "Pago parcial" sin monto, y `pendingPayments` / `revenueStats.previousUnpaid` suman el `total` completo.
- **Zona horaria de la empresa**: `startOfDay` (rules.ts) usa la zona del servidor. El front manda el mediodía local para no cambiar de día, pero los cortes del día siguen siendo los del servidor.
- **`reservations(filter)` con `orderBy`**: hoy siempre ordena descendente.
- **Campos escalares en `Reservation` para listas: `mainServiceType: ServiceType` y `coveredByPackage: Boolean!`.** Hoy la agenda tiene que pedir `items { kind service { type } }` solo para saber el tipo, y cada campo bajo `items` cuesta 2 000 nodos (50 filas × `@cost(assumedSize: 40)`). La consulta está en ~8 850 de 10 000: no cabe ni un campo más, y agregar `arrivedAt` (B6) la dejaría en ~8 900. Con estos dos campos la agenda baja a ~1 000 nodos, se puede quitar `items`, y el badge "Cubierto por paquete" vuelve a ser posible.
- **Recibir en lote** (`checkInReservations(ids)`): hoy "Recibir a los 3" serían 3 llamadas.

## 2. Frontend (`ad-paws-web-app`)

Después de copiar `schema.graphql` del backend y correr `pnpm codegen`:

1. **Consulta**: agregar `arrivedAt` a `DASHBOARD_AGENDA_QUERY` (cuesta 50 nodos; la consulta queda en ~8 900 de 10 000 — **nada nuevo bajo `items`**, ver el comentario en el archivo) (`src/graphql/operations/dashboard.ts`), y `arrivedNow` a `GUEST_STATS_QUERY`.
2. **Agenda** (`src/components/Dashboard/utils/agenda.ts`):
   - Agregar `atCounter: AgendaReservation[]` al tipo `Agenda`: reservas `ARRIVED` ordenadas por `arrivedAt` ascendente (primero la que más espera).
   - Agrupar por dueño las que llegaron juntas (mismo `primaryOwner.id` y `arrivedAt` con menos de 2 min de diferencia) para "Recibir a los N".
   - En `buildAgenda`, `ARRIVED` ya no cuenta en "Por llegar".
3. **Resumen** (`DaySummary.tsx`): cuarto contador, "En mostrador". Usa el estilo ámbar solo cuando es mayor que 0. El texto dice "El que más espera lleva N min" y cambia a color de alerta a partir de 5 min.
4. **Tarjeta "En mostrador"** (componente nuevo en la columna derecha, arriba de Ingresos, visible para OWNER, ADMIN y STAFF):
   - Muestra las 3 que más esperan. Cada fila lleva "Recibir" (o "Recibir a los N"), "Cobrar" (apagado si no hay saldo; una reserva cubierta por paquete ya nace `PAID`) y un menú ⋯ con "Descartar".
   - Abajo, "Ver los N en Arribos".
   - Estado vacío: "Sin llegadas pendientes", y **solo** cuando la consulta respondió bien (spec §5).
5. **Ruta `/arribos`** (`src/routes.tsx` + `src/pages/arrivals/Arrivals.tsx`):
   - Tabla con las columnas Espera, Perros, Dueño, Servicio, Por cobrar y Acciones.
   - Polling cada 10 s (spec §5).
6. **Sidebar** (`src/components/Sidebar.tsx`): ítem "Arribos" con el ícono `TabletIcon` y un contador ámbar con `guestStats.arrivedNow`. El contador vive en el ícono de Arribos, no en el de Inicio.
7. **Acciones** (`hooks/useGuestActions.ts`):
   - Agregar `handleDiscardArrival`.
   - `evictReservationCache` ya invalida `reservationsOn` y `guestStats`, así que no hay que tocarlo.
8. **Textos**: `ARRIVED` → "En sucursal" en los badges de estado, en ambos frontends.

## 3. Pruebas mínimas

- Una reserva `ARRIVED` aparece en "En mostrador" y no en "Por llegar".
- "Recibir" la mueve a "Salen hoy" o "Se quedan", y el contador del sidebar baja.
- "Cobrar" está apagado cuando la reserva está `PAID` (incluye las cubiertas por paquete).
- Si la consulta de la agenda falla, la tarjeta muestra error y reintento, nunca "Sin llegadas pendientes".
- STAFF ve la cola y la tarjeta de mostrador, aunque no vea Ingresos.
