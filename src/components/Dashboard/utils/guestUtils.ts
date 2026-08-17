import type { ReservationFull } from "@/lib/api/reservations.api";
import {
  ITEM_KIND,
  SERVICE_TYPE_LABELS,
  RESERVATION_STATUS,
  PAYMENT_STATUS,
} from "../constants/guestConstants";

export function getMainServiceType(
  reservation: ReservationFull,
): string | null {
  const mainItem = reservation.items.find((i) => i.kind === ITEM_KIND.MAIN);
  return mainItem?.service?.type ?? null;
}

export function getServiceLabel(reservation: ReservationFull): string {
  const mainItem = reservation.items.find((i) => i.kind === ITEM_KIND.MAIN);
  const type = mainItem?.service?.type;
  if (!type) return mainItem?.name ?? "Servicio";
  return SERVICE_TYPE_LABELS[type] ?? type;
}

export function formatCheckIn(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getOwnerName(reservation: ReservationFull): string {
  const owner = reservation.dog?.owner;
  if (!owner) return "";
  return [owner.name, owner.lastname].filter(Boolean).join(" ");
}

export function getStartOfToday(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

/** Fin del día de hoy, para pedir "lo que debía llegar hasta hoy". */
export function getEndOfToday(): string {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toISOString();
}

/** Una llegada pendiente cuya hora programada ya pasó. */
export function isOverdueArrival(reservation: ReservationFull): boolean {
  if (reservation.status !== RESERVATION_STATUS.PENDING) return false;
  if (!reservation.checkIn) return false;
  return new Date(reservation.checkIn).getTime() < Date.now();
}

export function getCompanyId(companyId: string | number | undefined): number {
  if (!companyId) {
    throw new Error("Company ID is required");
  }
  const id = Number(companyId);
  if (Number.isNaN(id)) {
    throw new Error("Invalid company ID");
  }
  return id;
}

export function getAvailableActions(reservation: ReservationFull) {
  // Recibir una reserva existente es una acción distinta de crear un walk-in,
  // y era la que faltaba: la mutación existía pero nadie la llamaba salvo los
  // formularios de guardería y extras, que hacen check-in al vuelo.
  const canCheckIn = reservation.status === RESERVATION_STATUS.PENDING;
  const canCheckout = reservation.status === RESERVATION_STATUS.CHECKED_IN;
  const canCollectPayment =
    reservation.paymentStatus === PAYMENT_STATUS.UNPAID ||
    reservation.paymentStatus === "";

  return {
    canCheckIn,
    canCheckout,
    canCollectPayment,
    canCheckoutAndCollect: canCheckout && canCollectPayment,
    /**
     * Lo que vive DENTRO del menú de "...". El check-in queda fuera a
     * propósito: es un botón visible. Si se contara aquí, una reserva
     * pendiente y ya pagada por paquete abriría un menú sin opciones.
     */
    hasMenuAction: canCheckout || canCollectPayment,
  };
}
