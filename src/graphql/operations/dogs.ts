import { graphql } from "@/gql";

/**
 * Perros de la compañía activa (reemplaza a companyDogs). Staff ve todos;
 * un cliente solo los suyos — el backend decide con la sesión.
 */
export const DOGS_QUERY = graphql(`
  query Dogs($search: String, $first: Int) {
    dogs(search: $search, first: $first) {
      id
      name
      breed
      color
      birthDate
      gender
      imageUrl
      size
      weightKg
      companyProfile {
        firstVisitAt
        lastVisitAt
      }
      primaryOwner {
        id
        name
        lastname
        email
        phone
        profilePicture
      }
    }
  }
`);

/** Perfil completo de un perro (reemplaza a dogById). */
export const DOG_QUERY = graphql(`
  query Dog($id: ID!) {
    dog(id: $id) {
      id
      name
      breed
      color
      birthDate
      gender
      imageUrl
      size
      weightKg
      notes
      primaryOwner {
        id
        name
        lastname
        email
        phone
        profilePicture
        birthDate
        gender
        status
      }
    }
  }
`);

/**
 * Mutations de perros contra el schema nuevo.
 * `createDog` es singular (reemplaza a createDogs); un CLIENT siempre queda
 * como dueño de su propio perro sin importar `ownerUserId`. La foto se sube
 * en una mutation aparte (`uploadDogImage`).
 */
export const CREATE_DOG_MUTATION = graphql(`
  mutation CreateDog($input: CreateDogInput!) {
    createDog(input: $input) {
      id
      name
      breed
      color
      size
      gender
      birthDate
      imageUrl
    }
  }
`);

export const UPLOAD_DOG_IMAGE_MUTATION = graphql(`
  mutation UploadDogImage($id: ID!, $file: Upload!) {
    uploadDogImage(id: $id, file: $file) {
      id
      imageUrl
    }
  }
`);
