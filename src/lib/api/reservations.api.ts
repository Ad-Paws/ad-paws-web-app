// Las operaciones de reservaciones viven ahora en
// src/graphql/operations/reservations.ts, tipadas por codegen contra el
// schema nuevo (reservations, createReservation(input), checkInReservation,
// checkOutReservation, cancelReservation). El cliente ya no manda items ni
// precios: el servidor los calcula.
//
// Quedan aquí solo los tipos legados que la UI de listas sigue consumiendo;
// mapReservationToLegacy (src/utils/adapters.ts) produce esta forma.

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
