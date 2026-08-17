import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { RESERVATIONS_QUERY } from "@/graphql/operations/reservations";
import { mapReservationToLegacy } from "@/utils/adapters";
import type { ReservationStatus } from "@/gql/graphql";
import type { ServiceFilter } from "../constants/guestConstants";
import { getMainServiceType } from "../utils/guestUtils";

interface FilterConfig {
  serviceType: string | null;
  statusFilter: string;
  dateFilter?: { to: string };
}

/**
 * Una sola query contra `reservations(filter)` del schema nuevo.
 * El filtro por tipo de servicio se aplica en cliente: ReservationFilter
 * filtra por serviceId/estado/fechas, no por tipo, y una segunda query por
 * pestaña costaba más que filtrar 30 filas en memoria.
 */
export function useGuestData(
  _companyId: number | undefined,
  serviceFilter: ServiceFilter,
  filterConfig: FilterConfig,
) {
  const { data, loading, error, refetch } = useQuery(RESERVATIONS_QUERY, {
    variables: {
      filter: {
        status: filterConfig.statusFilter as ReservationStatus,
        to: filterConfig.dateFilter?.to,
      },
    },
  });

  const allReservations = useMemo(
    () => (data?.reservations ?? []).map(mapReservationToLegacy),
    [data?.reservations],
  );

  const reservations = useMemo(() => {
    if (serviceFilter === "all") return allReservations;
    return allReservations.filter(
      (reservation) =>
        getMainServiceType(reservation) === filterConfig.serviceType,
    );
  }, [allReservations, serviceFilter, filterConfig.serviceType]);

  const counts = useMemo(
    () =>
      allReservations.reduce(
        (acc, reservation) => {
          acc.all++;
          const serviceType = getMainServiceType(reservation);
          if (serviceType === "HOTEL") acc.stays++;
          else if (serviceType === "DAYCARE") acc.daycare++;
          return acc;
        },
        { all: 0, stays: 0, daycare: 0 },
      ),
    [allReservations],
  );

  return { reservations, loading, error, counts, refetch };
}
