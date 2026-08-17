# Análisis: Frontend vs cambios actuales del Backend

**Fecha:** 2026-08-17
**Alcance:** `ad-paws-web-app` (frontend) contra el estado actual (no commiteado) de `backend`.

## Resumen ejecutivo

El backend fue reescrito casi por completo: nuevo schema GraphQL (multi-tenant con directivas `@auth`/`@public`, `ID!` en vez de `Int`, scalars `Money`/`DateTime`), Prisma con cliente *scoped* por compañía, refresh tokens con rotación, rate limiting y CSRF. **Prácticamente ninguna operación del frontend actual es compatible con el nuevo schema.** El frontend hoy compilaría, pero toda query/mutation fallaría en runtime contra el backend nuevo.

---

## 1. Breaking changes que rompen la funcionalidad actual

### 1.1 Autenticación y usuario (`user.api.ts`, `AuthContext.tsx`)

| Frontend usa | Backend nuevo | Impacto |
|---|---|---|
| `user` query con `user.company { ... }` | `me` query; la compañía vive en `memberships: [CompanyMembership!]!` y `myCompany` / `myCompanies` | `AuthContext` completo debe reescribirse; ya no existe `user.company` ni `company.ownerId` |
| `signUser(input: SignInUserInput)` (input opcional) | `signUser(input: SignInUserInput!)` → `AuthResponse { accessToken, refreshToken }` | Firma casi igual, pero ahora hay **rotación de refresh tokens** (`refreshSession`) que el frontend no implementa |
| `role` global en `User` (`ADMIN/USER/CLIENT/OWNER`) | `MembershipRole` **por compañía** (`OWNER/ADMIN/STAFF/CLIENT`) en `CompanyMembership` | `types/Dog.ts` y toda lógica de roles debe leer del membership activo |
| — | Header **`x-company-id`** para elegir compañía activa (o la única del usuario) | Apollo debe enviar este header cuando haya múltiples empresas |
| — | `verifyEmail`, `requestPasswordReset`, `confirmPasswordReset`, `changePassword`, `logoutAllSessions` | Flujos nuevos sin pantalla en el frontend |

### 1.2 Compañía y empleados

- `createCompanyWithOwner` **eliminado** → `createCompany(input)`: ahora primero se crea el usuario (`createUser`), se autentica, y luego registra su empresa. `CompanySignup.tsx` debe partirse en dos pasos.
- `companyEmployees(companyId)` → `companyStaff` / `companyMembers(role)` (sin argumento `companyId`).
- `addEmployee` / `removeEmployee` → `inviteMember(input)`, `revokeMembership(role, userId)`, `changeMemberRole(from, to, userId)`.
- `companyDogOwners(companyId)` → `companyClients(search, first, after)` con paginación y sin `companyId`.

### 1.3 Perros (`dogs.api.ts`)

- `companyDogs(companyId)` → `dogs(search, first)`; `dogById(id)` → `dog(id: ID!)`.
- `createDogs` (plural) → `createDog(input)` (singular); `updateDog(input)` → `updateDog(id: ID!, input)`.
- Subida de imagen ahora es mutation separada: `uploadDogImage(id, file)`.
- Nuevos: `archiveDog`, `updateDogCompanyNotes` (notas por empresa), `addDogContact`/`removeDogContact`, `myDogs`.

### 1.4 Servicios (`services.api.ts`, `CreateServiceModal.tsx`)

| Campo viejo (frontend) | Campo nuevo |
|---|---|
| `price: number` | `price: Money!` (scalar) + `currency` |
| `duration` | `durationMinutes: Int!` |
| `startTime` / `endTime` ("HH:mm") | `opensAtMinute` / `closesAtMinute` (minutos desde medianoche) |
| `daysAvailable: string[]` | `daysMask: Int!` (bitmask, bit 0 = domingo) + `daysOfWeek` derivado |
| `active: boolean` | `status: ServiceStatus` (`ACTIVE/INACTIVE/ARCHIVED`) |
| `companyId` en input | Eliminado — la compañía sale del contexto |
| — | Nuevos: `capacity`, `checkoutCutoffMinute`, `lateCheckoutService`, `description` |

Queries: `servicesByCompany` y `servicesByCompanyAndType` → `services(type, status)`. Mutations: `updateService(id, input)`, `archiveService(id)`. El formulario de servicios necesita conversores HH:mm ↔ minutos y días ↔ bitmask, más campos de capacidad y late checkout.

### 1.5 Reservaciones (`reservations.api.ts`, CheckInDialog)

El cambio más profundo:

- **El cliente ya no manda precios ni items.** `createReservation` ahora recibe un solo `input { dogId, serviceId, addOnServiceIds, scheduledCheckIn, scheduledCheckOut, notes, overrideBusinessHours }`; el servidor calcula items, precios, excepciones y cobertura de paquetes. Todo el cálculo de precios de `HotelForm`/`DaycareForm` debe eliminarse y reemplazarse por **`quoteReservation(input)`** para previsualizar el total.
- `checkIn`/`checkOut` → `scheduledCheckIn`/`scheduledCheckOut` + `actualCheckInAt`/`actualCheckOutAt`.
- `updateReservation(id, data)` desaparece → mutations específicas: `checkInReservation(id)`, `checkOutReservation(id, at)` (aquí se evalúa y cobra el late checkout), `cancelReservation(id, reason)`.
- `reservationsByCompany`, `todaysReservationsByServiceType`, `reservationsByServiceType` → `reservations(filter, first)` y `reservationsOn(date)`.
- `Reservation` ahora expone `total: Money!`, `items(includeVoided)`, `occupancy`, `events`, `checkedInBy/checkedOutBy`; nuevo estado `NO_SHOW`.
- Nuevas queries de disponibilidad: `occupancy(serviceId, from, to)`, `serviceAvailability(serviceId, date)`, `effectivePrice(Range)` — el frontend hoy no valida capacidad ni días disponibles; ahora el backend rechaza (capacidad llena, día fuera de `daysMask`), así que la UI debe anticiparlo.

### 1.6 Stats y dashboard (`stats.api.ts`)

- `guestsStats` → `guestStats(date)`; campos renombrados: `todayCheckedInDogs` → `checkedInNow`, `newDogsDuringMonth` → `newDogsThisMonth`; **`pastDueVaccines` eliminado** (estaba hardcodeado en 0; quitar la métrica de la UI hasta que exista modelo de vacunas).
- `todaysRevenue(companyId)` → `revenueStats(date)` sin `companyId`, con `previousUnpaid` nuevo y montos como `Money`. Restringido a `OWNER, ADMIN` — la UI debe ocultar la tarjeta de ingresos para STAFF.
- Nuevo `pendingPayments: [DogBalance!]!` (saldos por perro) aprovechable en dashboard.

### 1.7 Paquetes (`dogPackages.api.ts`)

- `activeDogPackages(dogId)` → `dogPackages(dogId, activeOnly)`.
- `checkDogServiceAvailability(dogId, serviceId)` → `coveringBalance(dogId, serviceId, date)` (ahora por fecha, y ya no es necesario aplicarlo manualmente: la cobertura se aplica sola al crear la reservación).
- Nuevos: `purchasePackage`, `cancelDogPackage`, `adjustBalance`, `packages`, `createPackage`, `deactivatePackage`.

### 1.8 Transversal

- **Todos los IDs pasan de `Int` a `ID!`** — variables `$companyId: Int!`, `$dogId: Int!`, etc. fallan la validación del schema.
- Scalars `Money` y `DateTime`: definir parseo/formato en el cliente (no asumir `number`).
- Argumento `companyId` eliminado de casi todas las operaciones (viene del contexto + `x-company-id`).

---

## 2. Cambios de seguridad necesarios

1. **Eliminar tokens de `localStorage`** (`lib/auth.ts` define `ACCESS_TOKEN_KEY`/`REFRESH_TOKEN_KEY`). Los tokens en localStorage son robables vía XSS. Hoy nada los setea y la sesión funciona por cookie (`credentials: "include"`) — decidir un solo mecanismo: (a) solo cookie de sesión (recomendado, ya funciona), o (b) JWT con access token **en memoria** y `refreshSession` para renovar. Nunca el refresh token en localStorage: el backend los rota y revoca, y un token filtrado invalida la sesión legítima.
2. **No confiar en `userData` de localStorage para autorización de UI.** El backend ahora valida roles con `@auth(requires: [...])`, pero el frontend decide qué mostrar leyendo localStorage manipulable. Derivar el rol siempre de `me.memberships` en memoria; localStorage a lo sumo como caché de arranque no autoritativa.
3. **Implementar manejo de sesión expirada.** No existe `onError`/errorLink en Apollo. Agregar un link que ante `UNAUTHENTICATED` intente `refreshSession` (si se usa JWT) o redirija a login, y que limpie el estado local. Sin esto, la rotación de tokens del backend dejará usuarios en estados colgados.
4. **Eliminar el envío de precios desde el cliente.** El flujo actual (`ReservationItemCreateInput` con `unitPrice`/`totalPrice`) permitía manipular precios desde DevTools. El backend nuevo ya lo corrige; el frontend debe dejar de calcular importes y usar `quoteReservation`.
5. **Eliminar `companyId` como argumento controlado por el cliente.** El patrón viejo (`companyDogOwners(companyId)`, `todaysRevenue(companyId)`) era un IDOR: cualquier usuario autenticado podía pedir datos de otra empresa. Migrar a las queries de contexto y enviar `x-company-id` solo como selector de empresa propia.
6. **Respetar los permisos por rol en la UI**: `revenueStats` solo OWNER/ADMIN; acciones de miembros (`inviteMember`, `changeMemberRole`) restringidas. Ocultar/deshabilitar según membership para evitar errores 403 confusos.
7. **CSRF/CORS**: el backend mantiene `csrfPrevention` y CORS con credenciales; el frontend ya envía `Apollo-Require-Preflight` — conservarlo. Verificar que `VITE_BACKEND_API_URL` de producción esté en `corsOrigins` del backend.
8. **Nuevos flujos de cuenta a implementar**: verificación de email (`verifyEmail`), reset de contraseña, `logoutAllSessions` ("cerrar sesión en todos los dispositivos"). Sin la pantalla de `confirmPasswordReset`, el email de recuperación no lleva a ningún lado.
9. **Higiene**: limpiar `console.log` con datos de usuario/tokens antes de producción; el backend limita el body a 1 MB — validar tamaño de imágenes antes de subir.

---

## 3. Mejores prácticas a implementar (frontend)

1. **GraphQL Code Generator** — el backend ya exporta `schema.graphql` y tiene `codegen.ts`. Generar hooks tipados elimina las ~15 interfaces manuales duplicadas en `lib/api/*.ts` y habría detectado todos estos breaking changes en compilación. Es el cambio de mayor retorno.
2. **Fragments compartidos** — el set de campos de reservación está copiado 3 veces (`RESERVATIONS_BY_COMPANY`, `TODAYS_...`, `RESERVATIONS_BY_SERVICE_TYPE`). Definir `ReservationFields` una vez.
3. **Migrar a estructura `features/`** (ya es la aspiración del CLAUDE.md): `features/reservations`, `features/services`, `features/team`, `features/packages`, cada una con `queries/`, `hooks/`, `schemas/`. La reescritura forzada es el momento natural.
4. **Utils puros con tests** para las conversiones nuevas: `daysMask ↔ DayOfWeek[]`, `minutos ↔ "HH:mm"`, formateo de `Money`. Son fuente clásica de bugs off-by-one (bit 0 = domingo, igual que `Date.getDay()`).
5. **Errores y estados centralizados**: errorLink global + toasts consistentes; hoy cada componente maneja `onError` a su manera y varias queries ignoran `error`.
6. **Paginación**: `dogs`, `companyClients` y `reservations` ahora aceptan `first`/`after`/`search`. Implementar búsqueda servidor en Guests/Owners en lugar de filtrar todo en cliente.
7. **Estado de compañía activa**: si un usuario puede tener varias empresas (`myCompanies`), la selección es estado global mutable → store de Zustand (`useCompanyStore`) que alimente el header `x-company-id` vía Apollo link, en lugar de sobrecargar `AuthContext`.
8. **Zod en los formularios nuevos** (servicio con capacidad/cutoff, invitación de miembros, compra de paquetes), infiriendo tipos del schema como marca el CLAUDE.md.
9. **UX de disponibilidad**: usar `serviceAvailability`/`occupancy` para deshabilitar fechas llenas o fuera de `daysMask` en los formularios de check-in, y `quoteReservation` para mostrar el desglose (incluida cobertura de paquete) antes de confirmar.

---

## 4. Orden de actualización sugerido

1. **Base**: codegen + scalars (`Money`, `DateTime`) + errorLink + header `x-company-id` (Fase que desbloquea todo lo demás).
2. **Auth**: `me`/`memberships`, AuthContext nuevo, decidir cookie vs JWT+refresh, logout, signup de compañía en dos pasos.
3. **Lecturas**: dogs, services, clients, stats (renombres de campos y quitar `companyId`).
4. **Escrituras**: servicios (minutos/bitmask), reservaciones (`quoteReservation` + `createReservation` nuevo + check-in/out/cancel), equipo (invite/revoke/changeRole).
5. **Nuevo valor**: paquetes (compra/saldos), pendingPayments, disponibilidad/ocupación, flujos de email y reset.

---

*Nota: los cambios del backend analizados están sin commitear (working tree de `backend`); si algo se revierte antes del commit, revalidar este documento.*
