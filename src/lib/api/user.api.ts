import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation SignInUser($input: SignInUserInput) {
    signUser(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const USER_QUERY = gql`
  query User {
    user {
      id
      email
      name
      company {
        id
        name
        uuid
        logoUrl
        ownerId
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
    }
  }
`;
