import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import {
  RESERVATIONS_BY_COMPANY,
  RESERVATIONS_BY_SERVICE_TYPE,
  type ReservationsByCompanyResponse,
  type ReservationsByCompanyVariables,
  type ReservationsByServiceTypeResponse,
  type ReservationsByServiceTypeVariables,
} from "@/lib/api/reservations.api";
import type { ServiceFilter } from "../constants/guestConstants";
import { getMainServiceType } from "../utils/guestUtils";

interface FilterConfig {
  serviceType: string | null;
  statusFilter: string;
  dateFilter?: { to: string };
}

export function useGuestData(
  companyId: number | undefined,
  serviceFilter: ServiceFilter,
  filterConfig: FilterConfig,
) {
  const {
    data: allData,
    loading: allLoading,
    error: allError,
    refetch: refetchAll,
  } = useQuery<ReservationsByCompanyResponse, ReservationsByCompanyVariables>(
    RESERVATIONS_BY_COMPANY,
    {
      variables: {
        companyId: Number(companyId),
        filters: {
          status: filterConfig.statusFilter,
          ...filterConfig.dateFilter,
        },
      },
      skip: !companyId || serviceFilter !== "all",
    },
  );

  const {
    data: serviceData,
    loading: serviceLoading,
    error: serviceError,
    refetch: refetchService,
  } = useQuery<
    ReservationsByServiceTypeResponse,
    ReservationsByServiceTypeVariables
  >(RESERVATIONS_BY_SERVICE_TYPE, {
    variables: {
      companyId: Number(companyId),
      serviceType: filterConfig.serviceType ?? "",
      filters: {
        status: filterConfig.statusFilter,
        ...filterConfig.dateFilter,
      },
    },
    skip: !companyId || serviceFilter === "all",
  });

  const {
    data: countsData,
    error: countsError,
    refetch: refetchCounts,
  } = useQuery<ReservationsByCompanyResponse, ReservationsByCompanyVariables>(
    RESERVATIONS_BY_COMPANY,
    {
      variables: {
        companyId: Number(companyId),
        filters: { status: filterConfig.statusFilter },
      },
      skip: !companyId,
    },
  );

  const loading = serviceFilter === "all" ? allLoading : serviceLoading;
  const error =
    serviceFilter === "all" ? allError : serviceError || countsError;

  const reservations = useMemo(() => {
    if (serviceFilter === "all") {
      return allData?.reservationsByCompany ?? [];
    }
    return serviceData?.reservationsByServiceType ?? [];
  }, [serviceFilter, allData, serviceData]);

  const counts = useMemo(() => {
    const allReservations = countsData?.reservationsByCompany ?? [];
    return allReservations.reduce(
      (acc, r) => {
        acc.all++;
        const serviceType = getMainServiceType(r);
        if (serviceType === "HOTEL") acc.stays++;
        else if (serviceType === "DAYCARE") acc.daycare++;
        return acc;
      },
      { all: 0, stays: 0, daycare: 0 },
    );
  }, [countsData]);

  const refetch = () => {
    refetchCounts();
    if (serviceFilter === "all") {
      refetchAll();
    } else {
      refetchService();
    }
  };

  return { reservations, loading, error, counts, refetch };
}
