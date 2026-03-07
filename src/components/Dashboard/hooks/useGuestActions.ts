import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  UPDATE_RESERVATION,
  RESERVATIONS_BY_COMPANY_OPERATION,
  RESERVATIONS_BY_SERVICE_TYPE_OPERATION,
  type ReservationFull,
} from "@/lib/api/reservations.api";
import { showToast } from "@/lib/toast";
import {
  RESERVATION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
} from "../constants/guestConstants";

export function useGuestActions() {
  const [updatingReservationId, setUpdatingReservationId] = useState<
    number | null
  >(null);
  const [error, setError] = useState<Error | null>(null);

  const [updateReservation] = useMutation(UPDATE_RESERVATION, {
    refetchQueries: [
      RESERVATIONS_BY_COMPANY_OPERATION,
      RESERVATIONS_BY_SERVICE_TYPE_OPERATION,
    ],
  });

  const executeAction = async (
    reservationId: number,
    updateData: Record<string, unknown>,
    successMessage: { title: string; description: string },
  ) => {
    setError(null);
    setUpdatingReservationId(reservationId);
    try {
      await updateReservation({
        variables: { id: reservationId, data: updateData },
      });
      showToast.success(successMessage.title, successMessage.description);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      showToast.error("Error", error.message);
      throw error;
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const handleCheckout = async (reservation: ReservationFull) => {
    await executeAction(
      reservation.id,
      {
        status: RESERVATION_STATUS.CHECKED_OUT,
        checkOut: new Date().toISOString(),
      },
      {
        title: "Check-out exitoso",
        description: `${reservation.dog?.name ?? "Huésped"} ha sido retirado.`,
      },
    );
  };

  const handleCollectPayment = async (reservation: ReservationFull) => {
    await executeAction(
      reservation.id,
      {
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: PAYMENT_METHOD.EFECTIVO,
      },
      {
        title: "Pago registrado",
        description: `Pago de ${reservation.dog?.name ?? "huésped"} completado.`,
      },
    );
  };

  const handleCheckoutAndCollect = async (reservation: ReservationFull) => {
    await executeAction(
      reservation.id,
      {
        status: RESERVATION_STATUS.CHECKED_OUT,
        checkOut: new Date().toISOString(),
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: PAYMENT_METHOD.EFECTIVO,
      },
      {
        title: "Check-out y pago exitoso",
        description: `${reservation.dog?.name ?? "Huésped"} ha sido retirado y el pago registrado.`,
      },
    );
  };

  return {
    handleCheckout,
    handleCollectPayment,
    handleCheckoutAndCollect,
    updatingReservationId,
    error,
  };
}
