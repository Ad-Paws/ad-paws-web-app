import { graphql } from "@/gql";

/**
 * Registro de cuentas contra el schema nuevo.
 *
 * `createUser` crea la cookie de sesión en el servidor (igual que signUser),
 * así que tras registrarse NO hace falta iniciar sesión aparte.
 * `createCompany` requiere caller autenticado y lo convierte en OWNER —
 * reemplaza a createCompanyWithOwner.
 */
export const CREATE_USER_MUTATION = graphql(`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        email
        name
      }
    }
  }
`);

export const CREATE_COMPANY_MUTATION = graphql(`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      uuid
      name
      logoUrl
      currency
      timezone
    }
  }
`);
