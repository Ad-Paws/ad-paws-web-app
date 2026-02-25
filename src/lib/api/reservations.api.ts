import type { ReservationStatus } from "@/types/Dog";
import { gql } from "@apollo/client";

export const RESERVATIONS_BY_COMPANY = gql`
  query ReservationsByCompany(
    $companyId: Int
    $filters: ReservationFilterInput
  ) {
    reservationsByCompany(companyId: $companyId, filters: $filters) {
      id
      checkIn
      checkOut
      status
      paymentStatus
      dogId
      companyId
      dog {
        id
        name
        breed
        imageUrl
        owner {
          id
          name
          lastname
        }
      }
      items {
        id
        name
        kind
        quantity
        unitPrice
        totalPrice
        service {
          id
          name
          type
          category
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export interface ReservationsByCompanyVariables {
  companyId: number;
  filters?: {
    from?: string;
    to?: string;
    status?: string;
  };
}

export interface ReservationDog {
  id: string;
  name: string;
  breed: string;
  imageUrl: string | null;
  owner: {
    id: string;
    name: string;
    lastname: string;
  } | null;
}

export interface ReservationItemService {
  id: number;
  name: string;
  type: string;
  category: string;
}

export interface ReservationItemFull {
  id: number;
  name: string;
  kind: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  service: ReservationItemService | null;
}

export interface ReservationFull {
  id: number;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  paymentStatus: string;
  dogId: number;
  companyId: number;
  dog: ReservationDog | null;
  items: ReservationItemFull[];
  createdAt: string;
  updatedAt: string;
}

export interface ReservationsByCompanyResponse {
  reservationsByCompany: ReservationFull[];
}

export const CREATE_RESERVATION = gql`
  mutation CreateReservation(
    $dogId: Int!
    $companyId: Int!
    $items: [ReservationItemCreateInput!]!
    $checkIn: DateTime
    $checkOut: DateTime
    $paymentStatus: PaymentStatus
    $paymentSource: PaymentSource
    $paymentMethod: String
    $status: ReservationStatus
  ) {
    createReservation(
      dogId: $dogId
      companyId: $companyId
      items: $items
      checkIn: $checkIn
      checkOut: $checkOut
      paymentStatus: $paymentStatus
      paymentSource: $paymentSource
      paymentMethod: $paymentMethod
      status: $status
    ) {
      id
      dogId
      items {
        id
        name
        quantity
        reservationId
        totalPrice
        unitPrice
        kind
      }
      status
      updatedAt
      createdAt
      companyId
      checkIn
      checkOut
    }
  }
`;

export interface ReservationItem {
  id: number;
  name: string;
  quantity: number;
  reservationId: number;
  totalPrice: number;
  unitPrice: number;
  kind: string;
}

export interface Reservation {
  id: number;
  dogId: number;
  items: ReservationItem[];
  status: string;
  updatedAt: string;
  createdAt: string;
  companyId: number;
  checkIn: string | null;
  checkOut: string | null;
}

export type ReservationItemKind = "MAIN" | "ADDON" | "DISCOUNT" | "FEE";

export interface ReservationItemCreateInput {
  serviceId?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  kind: ReservationItemKind;
}

export interface CreateReservationVariables {
  dogId: number;
  companyId: number;
  items: ReservationItemCreateInput[];
  checkIn?: string;
  checkOut?: string;
  paymentStatus?: "PAID" | "UNPAID";
  paymentSource?: "WEB" | "APP" | "BUSINESS";
  paymentMethod?: string;
  status?: ReservationStatus;
}

export interface CreateReservationResponse {
  createReservation: Reservation;
}
