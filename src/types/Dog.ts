/** Scalar mappings */
export type ID = string;
export type DateTime = string; // ISO-8601 string
export type Upload = unknown; // adjust as needed (e.g., File)

/** Enums */

export type Gender = "Male" | "Female" | "Other";

export type ReservationStatus =
  | "PENDING"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "COMPLETED";

export type Role = "ADMIN" | "USER" | "CLIENT" | "OWNER";

export type ServiceType = "DAYCARE" | "HOTEL" | "TRAINING" | "GROOMING";

export type Size = "SMALL" | "MEDIUM" | "LARGE" | "TOY" | "GIGANTIC";

export type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "BLOCKED"
  | "INCOMPLETE"
  | "DELETED";

/** Object types */

export interface Address {
  /** Primary street address */
  streetOne?: string | null;

  /** Secondary street address */
  streetTwo?: string | null;

  /** Town or locality */
  neighborhood?: string | null;

  /** City of the address */
  city?: string | null;

  /** State of the address */
  state?: string | null;

  /** Postal code of the address */
  zip?: string | null;

  companyId?: number | null;
  company?: Company | null;
}

export interface AuthResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string | null;
}

export interface Company {
  id?: ID | null;
  name: string;
  phone: string;
  uuid: string;
  ownerId: number;
  email: string;
  logoUrl?: string | null;
  addressId?: number | null;
  status?: Status | null;
  address?: Address | null;
  owner?: User | null;
  employees?: User | null; // as defined in the schema
  clients?: (User | null)[] | null;
  services?: (Service | null)[] | null;
  reservations?: (Reservation | null)[] | null;
}

export interface CreatedUser {
  user?: User | null;
  tokens?: AuthResponse | null;
}

export interface Dog {
  id?: ID | null;
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weight?: number | null;
  color?: string | null;
  gender?: Gender | null;
  size?: Size | null;
  ownerId: number;
  imageUrl?: string | null;
  notes?: string | null;
  owner?: User | null;
  reservations?: (Reservation | null)[] | null;
}

export interface LogoutResponse {
  success: boolean;
  message?: string | null;
}

export interface PreUser {
  id?: ID | null;
  email: string;
  phone?: string | null;
  howManyDogs?: number | null;
}

export interface Reservation {
  id?: number | null;
  dog?: Dog | null;
  dogId?: number | null;
  company?: Company | null;
  companyId?: number | null;
  service?: Service | null;
  serviceId?: number | null;
  checkIn?: DateTime | null;
  checkOut?: DateTime | null;
  status?: ReservationStatus | null;
  createdAt?: DateTime | null;
  updatedAt?: DateTime | null;
}

export interface Service {
  id?: number | null;
  name?: string | null;
  type?: ServiceType | null;
  price?: number | null;
  duration?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  daysAvailable?: (string | null)[] | null;
  active?: boolean | null;
  company?: Company | null;
  companyId?: number | null;
  reservations?: (Reservation | null)[] | null;
  createdAt?: DateTime | null;
  updatedAt?: DateTime | null;
}

export interface User {
  id?: ID | null;
  email: string;
  name?: string | null;
  lastname?: string | null;
  role?: Role | null;
  gender?: Gender | null;
  status?: UserStatus | null;
  phone?: string | null;
  howManyDogs?: number | null;
  password: string;
  profilePicture?: string | null;
  dogs?: Dog | null; // as defined in the schema (not a list)
  companyId?: number | null;
  clientOfId?: number | null;
  company?: Company | null;
  ownedCompany?: Company | null;
  clientOf?: Company | null;
}

/** Root Query type (no inputs, just return shapes) */

export interface Query {
  availableBusiness?: (Company | null)[] | null;
  allCompanies?: (Company | null)[] | null;
  checkServiceAvailability?: AvailabilityResult | null;
  companyDogs?: (Dog | null)[] | null;
  company?: Company | null;
  dogById?: Dog | null;
  dogs?: (Dog | null)[] | null;
  dogsByOwner?: (Dog | null)[] | null;
  reservationsByCompany?: (Reservation | null)[] | null;
  reservationsByDog?: (Reservation | null)[] | null;
  reservationsByServiceType?: (Reservation | null)[] | null;
  servicesByCompany?: (Service | null)[] | null;
  todaysReservationsByServiceType?: (Reservation | null)[] | null;
  user?: User | null;
  userDogs?: (Dog | null)[] | null;
  users?: (User | null)[] | null;
}
