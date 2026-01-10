import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation(
    $dogId: Int!
    $companyId: Int!
    $items: [ReservationItemCreateInput!]!
    $checkIn: DateTime
    $checkOut: DateTime
  ) {
    createReservation(
      dogId: $dogId
      companyId: $companyId
      items: $items
      checkIn: $checkIn
      checkOut: $checkOut
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
}

export interface CreateReservationResponse {
  createReservation: Reservation;
}
