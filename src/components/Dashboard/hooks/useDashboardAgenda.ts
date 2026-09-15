import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  DASHBOARD_AGENDA_QUERY,
  OVERDUE_ARRIVALS_QUERY,
} from "@/graphql/operations/dashboard";
import { GUEST_STATS_QUERY } from "@/graphql/operations/stats";
import { addDays, buildAgenda, dayParam, startOfDay } from "../utils/agenda";

/** Cada minuto: varias personas atienden el mostrador a la vez. */
const POLL_MS = 60_000;

/**
 * Datos del tablero de Inicio: la agenda de hoy (más llegadas atrasadas de
 * días anteriores) y cuántos llegan mañana, para el estado vacío.
 */
export function useDashboardAgenda(now: Date) {
  const todayKey = now.toDateString();
  // Las variables dependen del DÍA, no del minuto, para no disparar consultas
  // nuevas en cada render.
  const vars = useMemo(() => {
    const today = startOfDay(now);
    return {
      today: dayParam(today),
      tomorrow: dayParam(addDays(today, 1)),
      startOfToday: new Date(startOfDay(today).getTime() - 1).toISOString(),
    };
    // Solo cambia al cambiar el día; `now` avanza cada 30 s.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const todayQuery = useQuery(DASHBOARD_AGENDA_QUERY, {
    variables: { date: vars.today },
    pollInterval: POLL_MS,
    notifyOnNetworkStatusChange: false,
  });
  const overdueQuery = useQuery(OVERDUE_ARRIVALS_QUERY, {
    variables: { before: vars.startOfToday },
    pollInterval: POLL_MS,
  });
  const tomorrowStats = useQuery(GUEST_STATS_QUERY, {
    variables: { date: vars.tomorrow },
  });

  const agenda = useMemo(() => {
    if (!todayQuery.data) return null;
    return buildAgenda(
      todayQuery.data.reservationsOn,
      overdueQuery.data?.reservations ?? [],
      now,
    );
  }, [todayQuery.data, overdueQuery.data, now]);

  return {
    agenda,
    loading: todayQuery.loading,
    error: Boolean(todayQuery.error),
    refetch: () => {
      todayQuery.refetch();
      overdueQuery.refetch();
    },
    tomorrowArrivals: tomorrowStats.data?.guestStats.arrivingToday,
  };
}
