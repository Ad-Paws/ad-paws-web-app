import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CHECK_IN_RESERVATION_MUTATION,
  CHECK_OUT_RESERVATION_MUTATION,
  MARK_RESERVATION_PAID_MUTATION,
  RESERVATIONS_QUERY,
} from "@/graphql/operations/reservations";
import { REVENUE_STATS_QUERY } from "@/graphql/operations/stats";
import type { ReservationFull } from "@/lib/api/reservations.api";
import { evictReservationCache } from "@/graphql/cache";
import { showToast } from "@/lib/toast";

/**
 * Acciones sobre reservaciones con las mutations nuevas.
 *
 * checkOutReservation registra la salida y, si pasó el corte del servicio,
 * cobra el late checkout automáticamente (por eso se refresca revenue).
 *
 * markReservationPaid NO procesa dinero: registra que se cobró en la terminal
 * externa del negocio (o efectivo) para hacer match con el corte.
 *
 * checkInReservation recibe una reserva que ya existía. Guardería y extras la
 * llaman al vuelo porque son walk-ins, pero una estancia reservada con
 * anticipación nace PENDING y necesita que alguien la reciba: sin esta acción
 * se quedaba así para siempre.
 */
export function useGuestActions() {
  const [updatingReservationId, setUpdatingReservationId] = useState<
    number | null
  >(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * `update` invalida TODAS las variantes en caché (ver evictReservationCache);
   * `refetchQueries` + `awaitRefetchQueries` fuerzan a la lista visible a
   * traer datos frescos ANTES de que salga el toast, para que el éxito no se
   * anuncie sobre una pantalla que todavía muestra el estado anterior.
   */
  const mutationOptions = {
    refetchQueries: [RESERVATIONS_QUERY, REVENUE_STATS_QUERY],
    awaitRefetchQueries: true,
    update: evictReservationCache,
  };

  const [checkInReservation] = useMutation(
    CHECK_IN_RESERVATION_MUTATION,
    mutationOptions,
  );
  const [checkOutReservation] = useMutation(
    CHECK_OUT_RESERVATION_MUTATION,
    mutationOptions,
  );
  const [markReservationPaid] = useMutation(
    MARK_RESERVATION_PAID_MUTATION,
    mutationOptions,
  );

  const runAction = async (
    reservationId: number,
    action: () => Promise<unknown>,
    success: { title: string; description: string },
  ) => {
    setError(null);
    setUpdatingReservationId(reservationId);
    try {
      await action();
      showToast.success(success.title, success.description);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      showToast.error("Error", error.message);
      throw error;
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const handleCheckIn = (reservation: ReservationFull) =>
    runAction(
      reservation.id,
      () => checkInReservation({ variables: { id: String(reservation.id) } }),
      {
        title: "Check-in exitoso",
        description: `${reservation.dog?.name ?? "Huésped"} ya está en la casa.`,
      },
    );

  const handleCheckout = (reservation: ReservationFull) =>
    runAction(
      reservation.id,
      () => checkOutReservation({ variables: { id: String(reservation.id) } }),
      {
        title: "Check-out exitoso",
        description: `${reservation.dog?.name ?? "Huésped"} ha sido retirado.`,
      },
    );

  const handleCollectPayment = (reservation: ReservationFull) =>
    runAction(
      reservation.id,
      () =>
        markReservationPaid({
          variables: { id: String(reservation.id), method: "TERMINAL" },
        }),
      {
        title: "Cobro registrado",
        description: "Marcado como pagado para el match con la terminal.",
      },
    );

  const handleCheckoutAndCollect = async (reservation: ReservationFull) => {
    await handleCheckout(reservation);
    await handleCollectPayment(reservation);
  };

  return {
    handleCheckIn,
    handleCheckout,
    handleCollectPayment,
    handleCheckoutAndCollect,
    updatingReservationId,
    error,
  };
}
