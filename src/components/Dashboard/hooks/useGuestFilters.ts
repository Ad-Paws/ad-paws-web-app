import { useState, useMemo } from "react";
import {
  type ServiceFilter,
  type TimeFilter,
  SERVICE_TYPE_MAP,
  RESERVATION_STATUS,
} from "../constants/guestConstants";
import { getStartOfToday } from "../utils/guestUtils";

export function useGuestFilters() {
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");

  const serviceType = SERVICE_TYPE_MAP[serviceFilter];
  const statusFilter =
    timeFilter === "today"
      ? RESERVATION_STATUS.CHECKED_IN
      : RESERVATION_STATUS.CHECKED_OUT;

  const filterConfig = useMemo(
    () => ({
      serviceType,
      statusFilter,
      dateFilter: timeFilter === "past" ? { to: getStartOfToday() } : undefined,
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
