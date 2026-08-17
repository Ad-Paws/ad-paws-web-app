import { gql } from "@apollo/client";

// companyDogs y dogById fueron reemplazados por dogs y dog en
// src/graphql/operations/dogs.ts, tipados por codegen.
// createDogs (plural) fue reemplazado por createDog + uploadDogImage en
// src/graphql/operations/dogs.ts, tipados por codegen.

export const UPDATE_DOG = gql`
  mutation UpdateDog($input: UpdateDogInput!) {
    updateDog(input: $input) {
      id
      name
      breed
      birthDate
      gender
      color
      weight
      size
      imageUrl
      owner {
        id
        email
        name
        lastname
        phone
        profilePicture
        status
      }
    }
  }
`;
