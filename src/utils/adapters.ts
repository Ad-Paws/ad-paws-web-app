/**
 * Adaptadores del schema nuevo → tipos legados de la UI.
 *
 * El backend cambió unidades y nombres (weightKg string, minutos desde
 * medianoche, daysMask, Money como string decimal, primaryOwner en vez de
 * owner). Estos helpers concentran la conversión en un solo lugar para que
 * los componentes visuales existentes no tengan que cambiar todavía. Cuando
 * un módulo se migre por completo a los tipos generados, su adaptador sobra.
 */
import type {
  DogsQuery,
  DogQuery,
  ReservationsQuery,
  ServicesQuery,
} from "@/gql/graphql";
import type { Dog as LegacyDog, Gender as LegacyGender, User as LegacyUser } from "@/types/Dog";
import type { Service as LegacyService } from "@/lib/api/services.api";
import type { ReservationFull } from "@/lib/api/reservations.api";

type ApiDog = DogsQuery["dogs"][number];
type ApiDogDetail = NonNullable<DogQuery["dog"]>;
type ApiService = ServicesQuery["services"][number];

// ---------------------------------------------------------------------------
// Escalares y unidades
// ---------------------------------------------------------------------------

/** Money viaja como string decimal ("650.00"). */
export const moneyToNumber = (money: string | null | undefined): number => {
  const parsed = Number.parseFloat(money ?? "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

/** 660 → "11:00" */
export const minuteToHHMM = (minute: number): string => {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/** "11:00" → 660 */
export const hhmmToMinute = (time: string): number => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/** Orden de despliegue (lunes primero); el bit es el de Date.getDay(). */
const DAY_VALUES: { value: string; bit: number }[] = [
  { value: "Monday", bit: 1 },
  { value: "Tuesday", bit: 2 },
  { value: "Wednesday", bit: 3 },
  { value: "Thursday", bit: 4 },
  { value: "Friday", bit: 5 },
  { value: "Saturday", bit: 6 },
  { value: "Sunday", bit: 0 },
];

/** daysMask (bit 0 = domingo) → ["Monday", ...] como usa la UI. */
export const daysMaskToDayValues = (mask: number): string[] =>
  DAY_VALUES.filter((day) => (mask & (1 << day.bit)) !== 0).map(
    (day) => day.value,
  );

/** ["Monday", ...] → daysMask. */
export const dayValuesToDaysMask = (days: string[]): number =>
  DAY_VALUES.filter((day) => days.includes(day.value)).reduce(
    (mask, day) => mask | (1 << day.bit),
    0,
  );

/** Iniciales en español, en el orden de despliegue (lunes primero). */
const DAY_INITIALS: Record<number, string> = {
  1: "L",
  2: "M",
  3: "X",
  4: "J",
  5: "V",
  6: "S",
  0: "D",
};

/**
 * daysMask → etiqueta corta para saldos de paquete: 127 → "Todos los días",
 * 62 → "L–V", 30 → "L–J", 65 → "D, S".
 *
 * Los rangos contiguos se colapsan porque los paquetes reales casi siempre lo
 * son ("guardería L–V", "noches L–J") y "L, M, X, J, V" ocupa el doble sin
 * decir más. Contiguo se evalúa en el orden de despliegue, no por número de
 * bit: domingo va al final, así que L–D es un rango y no dos.
 */
export const daysMaskToShortLabel = (mask: number): string => {
  const active = DAY_VALUES.filter((day) => (mask & (1 << day.bit)) !== 0);
  if (active.length === 0) return "Sin días";
  if (active.length === 7) return "Todos los días";

  const initials = active.map((day) => DAY_INITIALS[day.bit]);
  const positions = active.map((day) => DAY_VALUES.indexOf(day));
  const isContiguous = positions.every(
    (position, i) => i === 0 || position === positions[i - 1] + 1,
  );

  if (isContiguous && active.length > 2) {
    return `${initials[0]}–${initials[initials.length - 1]}`;
  }
  return initials.join(", ");
};

const GENDER_TO_LEGACY: Record<string, LegacyGender> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

// ---------------------------------------------------------------------------
// Dogs
// ---------------------------------------------------------------------------

const mapOwnerToLegacy = (
  owner: NonNullable<ApiDogDetail["primaryOwner"]> | NonNullable<ApiDog["primaryOwner"]>,
): LegacyUser => ({
  id: owner.id,
  email: owner.email,
  name: owner.name ?? null,
  lastname: owner.lastname ?? null,
  phone: owner.phone ?? null,
  profilePicture: owner.profilePicture ?? null,
  gender: "gender" in owner && owner.gender ? GENDER_TO_LEGACY[owner.gender] : null,
  status: "status" in owner ? owner.status : null,
  // El tipo legado exige password; nunca viaja por la API nueva.
  password: "",
});

export const mapDogToLegacy = (dog: ApiDog | ApiDogDetail): LegacyDog => ({
  id: dog.id,
  name: dog.name,
  breed: dog.breed ?? "",
  color: dog.color ?? null,
  birthDate: dog.birthDate ?? "",
  gender: dog.gender ? GENDER_TO_LEGACY[dog.gender] : null,
  size: dog.size,
  imageUrl: dog.imageUrl ?? null,
  weight: dog.weightKg ? Number.parseFloat(dog.weightKg) || null : null,
  ownerId: dog.primaryOwner ? Number(dog.primaryOwner.id) : 0,
  owner: dog.primaryOwner ? mapOwnerToLegacy(dog.primaryOwner) : null,
  notes: "notes" in dog ? (dog.notes ?? null) : null,
  // Dog ya no expone reservations; el historial vive en la query de
  // reservaciones (se migra en la fase de reservaciones).
  reservations: [],
});

// ---------------------------------------------------------------------------
// Reservations
// ---------------------------------------------------------------------------

type ApiReservation = ReservationsQuery["reservations"][number];

/**
 * Reservación nueva → forma legada que consume la UI de listas.
 * checkIn/checkOut legados eran una sola fecha; hoy el schema separa lo
 * agendado de lo real — se prefiere lo real cuando existe. Los importes por
 * item ya no viajan en listas (límite de costo); el total viene del servidor.
 */
export const mapReservationToLegacy = (
  reservation: ApiReservation,
): ReservationFull => ({
  id: Number(reservation.id),
  checkIn: reservation.actualCheckInAt ?? reservation.scheduledCheckIn,
  checkOut:
    reservation.actualCheckOutAt ?? reservation.scheduledCheckOut ?? null,
  status: reservation.status,
  paymentStatus: reservation.paymentStatus,
  dogId: Number(reservation.dog.id),
  companyId: 0,
  dog: {
    id: reservation.dog.id,
    name: reservation.dog.name,
    breed: reservation.dog.breed ?? "",
    imageUrl: reservation.dog.imageUrl ?? null,
    owner: reservation.dog.primaryOwner
      ? {
          id: reservation.dog.primaryOwner.id,
          name: reservation.dog.primaryOwner.name ?? "",
          lastname: reservation.dog.primaryOwner.lastname ?? "",
        }
      : null,
  },
  items: reservation.items.map((item, index) => ({
    id: index,
    name: item.name,
    kind: item.kind,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    service: item.service
      ? { id: 0, name: item.name, type: item.service.type, category: "" }
      : null,
  })),
  createdAt: reservation.createdAt,
  updatedAt: reservation.createdAt,
});

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const mapServiceToLegacy = (service: ApiService): LegacyService => ({
  id: service.id,
  name: service.name,
  type: service.type,
  category: service.category,
  price: moneyToNumber(service.price),
  pricingUnit: service.pricingUnit,
  duration: service.durationMinutes,
  startTime: minuteToHHMM(service.opensAtMinute),
  endTime: minuteToHHMM(service.closesAtMinute),
  daysAvailable: daysMaskToDayValues(service.daysMask),
  active: service.status === "ACTIVE",
  status: service.status,
  // La compañía sale del contexto (header x-company-id); el tipo legado aún
  // lo exige. Nadie debe leerlo del servicio.
  companyId: 0,
  createdAt: "",
  updatedAt: undefined,
});
