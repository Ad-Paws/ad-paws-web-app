import { gql } from "@apollo/client";

export const COMPANY_DOGS = gql`
  query CompanyDogs($companyId: Int) {
    companyDogs(companyId: $companyId) {
      ageMonths
      ageYears
      id
      ownerId
      breed
      color
      imageUrl
      name
      owner {
        id
        email
        phone
        name
        lastname
        profilePicture
      }
      size
      weight
      gender
    }
  }
`;

export const CREATE_USER_DOGS = gql`
  mutation Mutation($input: CreateDogsInput!) {
    createDogs(input: $input) {
      breed
      color
      id
      gender
      name
      size
      weight
      ageYears
      ageMonths
      imageUrl
    }
  }
`;
