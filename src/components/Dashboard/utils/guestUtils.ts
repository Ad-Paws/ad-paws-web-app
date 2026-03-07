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
  const canCheckout = reservation.status === RESERVATION_STATUS.CHECKED_IN;
  const canCollectPayment =
    reservation.paymentStatus === PAYMENT_STATUS.UNPAID ||
    reservation.paymentStatus === "";

  return {
    canCheckout,
    canCollectPayment,
    canCheckoutAndCollect: canCheckout && canCollectPayment,
    hasAnyAction: canCheckout || canCollectPayment,
  };
}
