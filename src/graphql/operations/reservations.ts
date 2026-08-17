import { graphql } from "@/gql";

/**
 * Reservaciones contra el schema nuevo.
 *
 * La selección de la lista es deliberadamente magra: `items` no está paginado
 * y el límite de costo del backend le asume 50 filas, así que cada campo extra
 * bajo `items` cuesta first × 50 nodos. Solo se pide lo que la lista usa
 * (tipo del servicio principal); los montos salen de `total`, que el servidor
 * calcula. `first` es literal: una variable se tasa como 100 y revienta el
 * presupuesto.
 *
 * El servidor calcula precios, excepciones y cobertura de paquetes — el
 * cliente ya no manda items ni importes (eso permitía manipular precios).
 */
export const RESERVATIONS_QUERY = graphql(`
  query Reservations($filter: ReservationFilter) {
    reservations(filter: $filter, first: 30) {
      id
      scheduledCheckIn
      scheduledCheckOut
      actualCheckInAt
      actualCheckOutAt
      status
      paymentStatus
      total
      createdAt
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
        name
        service {
          type
        }
      }
    }
  }
`);

/**
 * Cotiza antes de reservar con las mismas validaciones y precios del create:
 * el total real (excepciones de precio incluidas) lo decide el servidor, no
 * la UI.
 *
 * `total` y `amountDue` NO son lo mismo y la diferencia importa:
 *   - `total` es todo, valuado como si el perro no tuviera paquete.
 *   - `amountDue` es lo que se cobra hoy, ya descontada la cobertura.
 *
 * La cobertura se decide por fecha, así que una estancia puede estar cubierta
 * a medias: con "noches ilimitadas L–J", un miércoles→domingo son dos noches
 * del paquete y dos en efectivo, en una sola reservación. `coveredDates` dice
 * cuáles. Cobrar `total` en ese caso sería cobrar dos veces lo mismo.
 */
export const QUOTE_RESERVATION_QUERY = graphql(`
  query QuoteReservation($input: CreateReservationInput!) {
    quoteReservation(input: $input) {
      subtotal
      total
      amountDue
      coveredDates
      warnings
      service {
        id
        name
      }
      addOns {
        price
        coveredByPackage
        service {
          id
          name
        }
      }
      dates {
        date
        price
      }
    }
  }
`);

/**
 * Marca el cobro hecho FUERA de la plataforma (terminal externa o efectivo)
 * para hacer match con el corte de la terminal. No procesa dinero.
 */
export const MARK_RESERVATION_PAID_MUTATION = graphql(`
  mutation MarkReservationPaid($id: ID!, $method: String, $reference: String) {
    markReservationPaid(id: $id, method: $method, reference: $reference) {
      id
      paymentStatus
    }
  }
`);

export const CREATE_RESERVATION_MUTATION = graphql(`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      status
      paymentStatus
      scheduledCheckIn
      scheduledCheckOut
      total
    }
  }
`);

export const CHECK_IN_RESERVATION_MUTATION = graphql(`
  mutation CheckInReservation($id: ID!) {
    checkInReservation(id: $id) {
      id
      status
      actualCheckInAt
    }
  }
`);

/** Al hacer check-out el backend evalúa y cobra el late checkout si aplica. */
export const CHECK_OUT_RESERVATION_MUTATION = graphql(`
  mutation CheckOutReservation($id: ID!, $at: DateTime) {
    checkOutReservation(id: $id, at: $at) {
      id
      status
      actualCheckOutAt
      total
      paymentStatus
    }
  }
`);

export const CANCEL_RESERVATION_MUTATION = graphql(`
  mutation CancelReservation($id: ID!, $reason: String) {
    cancelReservation(id: $id, reason: $reason) {
      id
      status
    }
  }
`);
