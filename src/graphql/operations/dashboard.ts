import { graphql } from "@/gql";

/**
 * Operaciones del tablero de Inicio.
 *
 * `reservationsOn` es la consulta pensada para la operación del día: trae lo
 * que llega y lo que sale en la fecha, más todo lo que sigue `CHECKED_IN`
 * aunque haya entrado antes. No tiene `first`, así que el límite de costo le
 * asume 50 filas; por eso la selección bajo `items` es mínima.
 *
 * Presupuesto de costo (MAX_NODES = 10 000 en backend/src/graphql/validation/
 * cost.ts): `reservationsOn` cuenta 50 filas y `items` 40 por fila
 * (@cost(assumedSize: 40)), así que CADA campo bajo `items` suma 2 000 nodos.
 * Con `kind` y `service { type }` la consulta queda en ~8 850. Agregar un solo
 * campo más bajo `items` (p. ej. `name` o `sourceType`) la saca del límite.
 * Si hace falta más detalle, pídelo al backend como campo escalar de
 * Reservation (ver DASHBOARD_EN_MOSTRADOR.md), no como otro campo de `items`.
 *
 * Ojo con la fecha: el backend corta el día con la zona horaria del SERVIDOR
 * (`startOfDay` en rules.ts). Se manda el mediodía local (ver
 * `dayParam`) para que al menos el día calendario sea el correcto.
 */
export const DASHBOARD_AGENDA_QUERY = graphql(`
  query DashboardAgenda($date: DateTime!) {
    reservationsOn(date: $date) {
      id
      scheduledCheckIn
      scheduledCheckOut
      actualCheckInAt
      status
      paymentStatus
      total
      dog {
        id
        name
        breed
        imageUrl
        primaryOwner {
          id
          name
          lastname
        }
      }
      items {
        kind
        service {
          type
        }
      }
    }
  }
`);

/**
 * Llegadas de días anteriores que siguen PENDING. `reservationsOn` solo ve el
 * día pedido, y sin esta consulta una estancia que no se recibió a tiempo
 * desaparecía del tablero. `first` es literal a propósito (límite de costo).
 */
export const OVERDUE_ARRIVALS_QUERY = graphql(`
  query OverdueArrivals($before: DateTime!) {
    reservations(filter: { status: PENDING, to: $before }, first: 30) {
      id
      scheduledCheckIn
      scheduledCheckOut
      actualCheckInAt
      status
      paymentStatus
      total
      dog {
        id
        name
        breed
        imageUrl
        primaryOwner {
          id
          name
          lastname
        }
      }
      items {
        kind
        service {
          type
        }
      }
    }
  }
`);

/** Saldo por perro, mayor primero. OWNER/ADMIN/STAFF en el backend. */
export const PENDING_PAYMENTS_QUERY = graphql(`
  query PendingPayments {
    pendingPayments {
      amount
      reservations
      dog {
        id
        name
        imageUrl
      }
    }
  }
`);

/**
 * Reservaciones de un perro para cobrar su saldo una por una.
 * `pendingPayments` agrupa por perro y no devuelve ids; esta consulta los
 * trae. El backend ordena descendente y `first` topa en 30: una deuda más
 * vieja que las últimas 30 reservaciones no aparecería aquí.
 */
export const DOG_UNPAID_RESERVATIONS_QUERY = graphql(`
  query DogUnpaidReservations($dogId: ID!) {
    reservations(filter: { dogId: $dogId }, first: 30) {
      id
      scheduledCheckIn
      scheduledCheckOut
      status
      paymentStatus
      total
      items {
        kind
        name
      }
    }
  }
`);
