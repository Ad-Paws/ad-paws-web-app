import { graphql } from "@/gql";

/**
 * Paquetes contra el schema nuevo.
 *
 * Tres cosas cambiaron de fondo respecto a `lib/api/dogPackages.api.ts` (legado):
 *
 *   1. `activeDogPackages(dogId: Int!)` → `dogPackages(dogId: ID!, activeOnly)`.
 *   2. Las cantidades son **por item**, no por paquete: `quantity: null` es
 *      ilimitado. Un mismo paquete puede vender "guardería L–V con cupo +
 *      noches ilimitadas L–J + 1 grooming", así que la UI nunca debe deducir
 *      el tipo de entitlement de `Package.type` — ese campo es solo una
 *      etiqueta comercial. Léelo siempre del balance.
 *   3. La cobertura se decide **por fecha** y el servidor la aplica solo al
 *      reservar. El cliente no tiene que buscar el balance ni descontarlo;
 *      para previsualizar usa `quoteReservation`, que ya trae `amountDue` y
 *      `coveredDates`.
 */

/**
 * Saldos de un perro. `daysMask` es la copia tomada en la compra, así que
 * editar la plantilla no cambia lo ya vendido: para mostrar "L–V" hay que leer
 * el mask del balance, no el del servicio.
 */
export const DOG_PACKAGES_QUERY = graphql(`
  query DogPackages($dogId: ID!, $activeOnly: Boolean) {
    dogPackages(dogId: $dogId, activeOnly: $activeOnly) {
      id
      purchaseDate
      expiryDate
      renewalDate
      billingCycle
      status
      package {
        id
        name
        type
        validityDays
        billingCycle
      }
      # Un paquete se puede renovar a lo más una vez (la cadena es una lista).
      # Si ya tiene sucesor, la UI oculta el botón en vez de dejar que el
      # servidor rechace la segunda renovación.
      renewedTo {
        id
      }
      balances {
        id
        initialQuantity
        usedQuantity
        remainingQuantity
        daysMask
        service {
          id
          name
          type
        }
      }
    }
  }
`);

/**
 * Si un paquete cubriría este servicio en esta fecha.
 *
 * Sustituye a `checkDogServiceAvailability(dogId, serviceId)`: la cobertura
 * depende del día de la semana y de la vigencia, así que sin fecha la pregunta
 * no tiene respuesta. Es informativa — el gasto real ocurre dentro de la
 * transacción de la reservación.
 */
export const COVERING_BALANCE_QUERY = graphql(`
  query CoveringBalance($dogId: ID!, $serviceId: ID!, $date: DateTime!) {
    coveringBalance(dogId: $dogId, serviceId: $serviceId, date: $date) {
      id
      initialQuantity
      usedQuantity
      remainingQuantity
      daysMask
      service {
        id
        name
      }
    }
  }
`);

/** Paquetes que la empresa vende, para el selector de compra. */
export const PACKAGES_QUERY = graphql(`
  query Packages($activeOnly: Boolean) {
    packages(activeOnly: $activeOnly) {
      id
      name
      description
      price
      type
      validityDays
      billingCycle
      active
      items {
        id
        quantity
        daysMask
        service {
          id
          name
          type
        }
      }
    }
  }
`);

/**
 * Crea una plantilla. Reglas que el servidor rechaza y la UI debe anticipar:
 *   - `billingCycle` es obligatorio en SUBSCRIPTION y prohibido en el resto.
 *   - Si algún item es ilimitado (`quantity` omitido) hace falta `validityDays`,
 *     salvo en SUBSCRIPTION, que está acotada por su ciclo.
 *   - Un servicio no puede repetirse dentro del paquete.
 */
export const CREATE_PACKAGE_MUTATION = graphql(`
  mutation CreatePackage($input: CreatePackageInput!) {
    createPackage(input: $input) {
      id
      name
      type
      price
      validityDays
      billingCycle
      active
    }
  }
`);

/** Baja lógica: deja de venderse, pero los ya vendidos siguen vigentes. */
export const DEACTIVATE_PACKAGE_MUTATION = graphql(`
  mutation DeactivatePackage($id: ID!) {
    deactivatePackage(id: $id) {
      id
      active
    }
  }
`);

export const PURCHASE_PACKAGE_MUTATION = graphql(`
  mutation PurchasePackage($input: PurchasePackageInput!) {
    purchasePackage(input: $input) {
      id
      status
      expiryDate
      renewalDate
    }
  }
`);

/**
 * Renovar crea un DogPackage NUEVO ligado al anterior — nunca resetea los
 * saldos del actual. Por eso la UI debe tratar el resultado como otro paquete
 * (y refrescar la lista), no como una actualización del que se renovó.
 */
export const RENEW_DOG_PACKAGE_MUTATION = graphql(`
  mutation RenewDogPackage(
    $id: ID!
    $startDate: DateTime
    $paymentMethod: PaymentMethod
    $markPaid: Boolean
  ) {
    renewDogPackage(
      id: $id
      startDate: $startDate
      paymentMethod: $paymentMethod
      markPaid: $markPaid
    ) {
      id
      status
      purchaseDate
      expiryDate
      renewalDate
      renewedFrom {
        id
      }
    }
  }
`);

export const CANCEL_DOG_PACKAGE_MUTATION = graphql(`
  mutation CancelDogPackage($id: ID!, $reason: String) {
    cancelDogPackage(id: $id, reason: $reason) {
      id
      status
      cancelledAt
    }
  }
`);
