import type { LucideIcon } from "lucide-react";
import { HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agenda } from "./utils/agenda";
import { formatTime, plural } from "./utils/format";

export type AgendaSection = "arriving" | "departing" | "staying";

interface SummaryTileProps {
  label: string;
  value: number;
  hint: string;
  hintTone?: "muted" | "warning";
  icon: LucideIcon;
  onClick?: () => void;
}

function SummaryTile({
  label,
  value,
  hint,
  hintTone = "muted",
  icon: Icon,
  onClick,
}: SummaryTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white dark:bg-gray-700 border border-[#E4F0E4] rounded-md p-4 shadow-sm text-left flex items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
        <p
          className={cn(
            "text-xs truncate",
            hintTone === "warning"
              ? "text-badge-warning-foreground"
              : "text-muted-foreground",
          )}
        >
          {hint}
        </p>
      </div>
      <div className="rounded-full w-9 h-9 flex items-center justify-center shrink-0 bg-muted text-brand-strong">
        <Icon className="w-4 h-4" />
      </div>
    </button>
  );
}

interface DaySummaryProps {
  agenda: Agenda | null;
  loading: boolean;
  now: Date;
  onSelect: (section: AgendaSection) => void;
}

/**
 * Resumen del día. Los números salen de la misma agenda que se muestra
 * abajo (no de `guestStats`) para que el contador y la lista nunca
 * discrepen: `guestStats.departingToday`, por ejemplo, no cuenta la
 * guardería, que no trae hora de salida.
 */
export default function DaySummary({
  agenda,
  loading,
  now,
  onSelect,
}: DaySummaryProps) {
  if (loading && !agenda) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-md" />
        ))}
      </div>
    );
  }
  if (!agenda) return null;

  const nextArrival = agenda.arriving.find(
    (r) => new Date(r.scheduledCheckIn).getTime() >= now.getTime(),
  );

  const arrivingHint =
    agenda.overdueArrivals > 0
      ? `${plural(agenda.overdueArrivals, "llegada", "llegadas")} con retraso`
      : nextArrival
        ? `La próxima es a las ${formatTime(nextArrival.scheduledCheckIn)}`
        : "Nada pendiente hoy";

  const insideParts = [
    agenda.insideStays && plural(agenda.insideStays, "estancia", "estancias"),
    agenda.insideDaycare && `${agenda.insideDaycare} en guardería`,
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
      <SummaryTile
        label="Por llegar"
        value={agenda.arriving.length}
        hint={arrivingHint}
        hintTone={agenda.overdueArrivals > 0 ? "warning" : "muted"}
        icon={LogInIcon}
        onClick={() => onSelect("arriving")}
      />
      <SummaryTile
        label="Adentro ahora"
        value={agenda.insideCount}
        hint={insideParts.length ? insideParts.join(" · ") : "Sin huéspedes"}
        icon={HomeIcon}
        onClick={() => onSelect("staying")}
      />
      <SummaryTile
        label="Salen hoy"
        value={agenda.departing.length}
        hint={
          agenda.departing.length === 0
            ? "Sin salidas"
            : agenda.unpaidDepartures > 0
              ? `${agenda.unpaidDepartures} con saldo pendiente`
              : "Todo pagado"
        }
        hintTone={agenda.unpaidDepartures > 0 ? "warning" : "muted"}
        icon={LogOutIcon}
        onClick={() => onSelect("departing")}
      />
    </div>
  );
}
