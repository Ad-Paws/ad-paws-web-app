import type {
  DashboardAgendaQuery,
  OverdueArrivalsQuery,
} from "@/gql/graphql";
import { moneyToNumber } from "@/utils/adapters";

/**
 * Lógica pura del tablero de Inicio: agrupa las reservaciones del día por lo
 * que el mostrador tiene que HACER con ellas, no por su estado técnico.
 *
 *   Por llegar  → PENDING (las de hoy y las de días anteriores sin recibir)
 *   Salen hoy   → CHECKED_IN cuya salida es hoy o ya pasó. La guardería no
 *                 trae `scheduledCheckOut`: se va el mismo día que entra.
 *   Se quedan   → el resto de CHECKED_IN (estancias que no salen hoy)
 *
 * "Adentro ahora" (el contador) son TODOS los CHECKED_IN, salgan o no hoy.
 *
 * Cuando exista el estado ARRIVED (self check-in, fase K1), aquí se agrega el
 * grupo "En mostrador" — ver DASHBOARD_EN_MOSTRADOR.md en la raíz del repo.
 */

export type AgendaReservation =
  | DashboardAgendaQuery["reservationsOn"][number]
  | OverdueArrivalsQuery["reservations"][number];

export type ServiceFilter = "all" | "stays" | "daycare";

export interface Agenda {
  arriving: AgendaReservation[];
  departing: AgendaReservation[];
  staying: AgendaReservation[];
  insideCount: number;
  insideStays: number;
  insideDaycare: number;
  overdueArrivals: number;
  unpaidDepartures: number;
}

const HIDDEN_STATUSES = new Set(["CANCELLED", "NO_SHOW"]);

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  HOTEL: "Estancia",
  DAYCARE: "Guardería",
  TRAINING: "Entrenamiento",
  GROOMING: "Grooming",
};

export function mainServiceType(r: AgendaReservation): string | null {
  return r.items.find((i) => i.kind === "MAIN")?.service?.type ?? null;
}

export function matchesServiceFilter(
  r: AgendaReservation,
  filter: ServiceFilter,
): boolean {
  if (filter === "all") return true;
  const type = mainServiceType(r);
  return filter === "stays" ? type === "HOTEL" : type === "DAYCARE";
}

export function hasBalance(r: {
  paymentStatus: string;
  total: string;
}): boolean {
  return (
    (r.paymentStatus === "UNPAID" || r.paymentStatus === "PARTIALLY_PAID") &&
    moneyToNumber(r.total) > 0
  );
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(date: Date): Date {
  const end = startOfDay(date);
  end.setDate(end.getDate() + 1);
  return end;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Fecha para `reservationsOn` / `guestStats`. El backend corta el día con la
 * zona del servidor; mandar el mediodía local conserva el día calendario.
 */
export function dayParam(date: Date): string {
  const noon = startOfDay(date);
  noon.setHours(12);
  return noon.toISOString();
}

function isDeparting(r: AgendaReservation, end: Date): boolean {
  if (!r.scheduledCheckOut) return true;
  return new Date(r.scheduledCheckOut).getTime() < end.getTime();
}

const byTime = (pick: (r: AgendaReservation) => string | null) =>
  (a: AgendaReservation, b: AgendaReservation) =>
    new Date(pick(a) ?? 0).getTime() - new Date(pick(b) ?? 0).getTime();

export function buildAgenda(
  today: readonly AgendaReservation[],
  overdue: readonly AgendaReservation[],
  now: Date,
): Agenda {
  const end = endOfDay(now);
  const seen = new Set<string>();
  const all: AgendaReservation[] = [];
  for (const r of [...overdue, ...today]) {
    if (seen.has(r.id) || HIDDEN_STATUSES.has(r.status)) continue;
    seen.add(r.id);
    all.push(r);
  }

  const arriving = all
    .filter(
      (r) =>
        r.status === "PENDING" &&
        new Date(r.scheduledCheckIn).getTime() < end.getTime(),
    )
    .sort(byTime((r) => r.scheduledCheckIn));

  const inside = all.filter((r) => r.status === "CHECKED_IN");
  const departing = inside
    .filter((r) => isDeparting(r, end))
    .sort(byTime((r) => r.scheduledCheckOut ?? r.scheduledCheckIn));
  const staying = inside
    .filter((r) => !isDeparting(r, end))
    .sort(byTime((r) => r.scheduledCheckOut));

  return {
    arriving,
    departing,
    staying,
    insideCount: inside.length,
    insideStays: inside.filter((r) => mainServiceType(r) === "HOTEL").length,
    insideDaycare: inside.filter((r) => mainServiceType(r) === "DAYCARE")
      .length,
    overdueArrivals: arriving.filter(
      (r) => new Date(r.scheduledCheckIn).getTime() < now.getTime(),
    ).length,
    unpaidDepartures: departing.filter(hasBalance).length,
  };
}

export function filterAgenda(agenda: Agenda, filter: ServiceFilter) {
  const keep = (r: AgendaReservation) => matchesServiceFilter(r, filter);
  return {
    arriving: agenda.arriving.filter(keep),
    departing: agenda.departing.filter(keep),
    staying: agenda.staying.filter(keep),
  };
}

export function countByService(agenda: Agenda) {
  const all = [...agenda.arriving, ...agenda.departing, ...agenda.staying];
  return {
    all: all.length,
    stays: all.filter((r) => matchesServiceFilter(r, "stays")).length,
    daycare: all.filter((r) => matchesServiceFilter(r, "daycare")).length,
  };
}

/**
 * "Retraso de 25 min", "Retraso de 4 h", o "Atrasada" si era de otro día (la
 * celda de hora ya muestra la fecha).
 */
export function delayLabel(iso: string, now: Date): string | null {
  const at = new Date(iso);
  const diffMin = Math.floor((now.getTime() - at.getTime()) / 60_000);
  if (diffMin <= 0) return null;
  if (at.getTime() < startOfDay(now).getTime()) {
    return "Atrasada";
  }
  if (diffMin < 60) return `Retraso de ${diffMin} min`;
  return `Retraso de ${Math.floor(diffMin / 60)} h`;
}
