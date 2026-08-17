import { useState, useMemo } from "react";
import {
  type ServiceFilter,
  type TimeFilter,
  SERVICE_TYPE_MAP,
  RESERVATION_STATUS,
} from "../constants/guestConstants";
import { getEndOfToday, getStartOfToday } from "../utils/guestUtils";

export function useGuestFilters() {
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");

  const serviceType = SERVICE_TYPE_MAP[serviceFilter];

  const statusFilter =
    timeFilter === "today"
      ? RESERVATION_STATUS.CHECKED_IN
      : timeFilter === "arriving"
        ? RESERVATION_STATUS.PENDING
        : RESERVATION_STATUS.CHECKED_OUT;

  const filterConfig = useMemo(
    () => ({
      serviceType,
      statusFilter,
      // "Por llegar" corta en el FIN de hoy, no en el inicio: la lista
      // operativa son las llegadas de hoy más las que ya se pasaron de fecha
      // y siguen pendientes. Las de mañana no son accionables todavía.
      dateFilter:
        timeFilter === "past"
          ? { to: getStartOfToday() }
          : timeFilter === "arriving"
            ? { to: getEndOfToday() }
            : undefined,
    }),
    [serviceType, statusFilter, timeFilter],
  );

  return {
    serviceFilter,
    setServiceFilter,
    timeFilter,
    setTimeFilter,
    filterConfig,
  };
}
