import type { DogFormValues } from "@/components/Form/Forms/ClientSignupStep2Form";
import type { CreateDogInput, DogSize, Gender } from "@/gql/graphql";

const normalizeDogSize = (size: string): DogSize => {
  const upper = size.toUpperCase();
  // El formulario histórico usaba "xlarge" para el tamaño más grande.
  if (upper === "XLARGE") return "GIGANTIC";
  return upper as DogSize;
};

const normalizeGender = (gender: string): Gender | undefined =>
  gender ? (gender.toUpperCase() as Gender) : undefined;

/**
 * Formulario de perro → CreateDogInput del schema nuevo.
 * La foto NO viaja aquí: se sube después con uploadDogImage. Un CLIENT no
 * necesita ownerUserId (siempre queda como dueño); el staff puede pasarlo.
 */
export const translateDogFormToCreateDogInput = (
  dog: DogFormValues,
  ownerUserId?: string,
): CreateDogInput => ({
  name: dog.name,
  breed: dog.breed || undefined,
  color: dog.color || undefined,
  size: normalizeDogSize(dog.size),
  gender: normalizeGender(dog.gender),
  // El backend espera el peso como string decimal (kg).
  weightKg: dog.weight || undefined,
  birthDate: dog.birthDate || undefined,
  ownerUserId,
});
