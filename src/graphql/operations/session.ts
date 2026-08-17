import { graphql } from "@/gql";

/**
 * Operaciones de sesión contra el schema nuevo (reemplazan a `user`,
 * `signUser` y `logoutUser` de src/lib/api/user.api.ts).
 *
 * La autenticación funciona por cookie de sesión: `signUser` la crea en el
 * servidor. Los tokens que devuelve NO se guardan (ver src/lib/auth.ts).
 */
export const ME_QUERY = graphql(`
  query Me {
    me {
      id
      email
      name
      lastname
      profilePicture
      status
      memberships {
        id
        role
        status
        company {
          id
          uuid
          name
          logoUrl
          currency
          timezone
        }
      }
    }
  }
`);

export const SIGN_IN_MUTATION = graphql(`
  mutation SignInUser($input: SignInUserInput!) {
    signUser(input: $input) {
      accessToken
    }
  }
`);

export const LOGOUT_MUTATION = graphql(`
  mutation LogoutUser {
    logoutUser {
      success
    }
  }
`);
