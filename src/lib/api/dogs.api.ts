import { gql } from "@apollo/client";

export const COMPANY_DOGS = gql`
  query CompanyDogs($companyId: Int) {
    companyDogs(companyId: $companyId) {
      age
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
