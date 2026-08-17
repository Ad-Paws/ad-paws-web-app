import { graphql } from "@/gql";

/**
 * Clientes de la compañía activa (reemplaza a companyDogOwners, que recibía
 * companyId del cliente y no verificaba nada).
 *
 * Los perros NO se anidan aquí a propósito: `User.dogs` no está paginado y el
 * límite de costo del backend rechaza lista × lista. Se piden por separado
 * (DOGS_QUERY) y se agrupan por primaryOwner en el cliente.
 */
export const COMPANY_CLIENTS_QUERY = graphql(`
  query CompanyClients($search: String, $first: Int) {
    companyClients(search: $search, first: $first) {
      id
      profilePicture
      email
      phone
      status
      name
      lastname
    }
  }
`);
