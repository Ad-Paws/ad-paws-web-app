import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn, getClockTime, getFormattedDate, getTimeOfDay } from "@/lib/utils";
import DaySummary, { type AgendaSection } from "@/components/Dashboard/DaySummary";
import TodayAgenda from "@/components/Dashboard/TodayAgenda";
import TodaysRevenue from "@/components/Dashboard/TodaysRevenue";
import { useDashboardAgenda } from "@/components/Dashboard/hooks/useDashboardAgenda";

/** Reloj del tablero: se actualiza cada 30 s (retrasos, saludo, hora). */
function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function Dashboard() {
  const { user, company, role } = useAuth();
  // revenueStats está restringido a OWNER/ADMIN en el backend.
  const canSeeRevenue = role === "OWNER" || role === "ADMIN";
  const now = useNow();
  const { agenda, loading, error, refetch, tomorrowArrivals } =
    useDashboardAgenda(now);
  const [focus, setFocus] = useState<{
    section: AgendaSection;
    nonce: number;
  } | null>(null);

  return (
    <div className="h-[calc(100dvh-80px)] px-6 py-4 overflow-hidden flex flex-col gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <p className="text-2xl font-bold">
            ¡{getTimeOfDay(now.getHours())}, {user?.name}!
          </p>
          <p className="text-[#6B7280] mt-1 ml-1">
            Esto es lo que toca hoy en {company?.name}.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{getClockTime(now)}</p>
          <p>{getFormattedDate(now)}</p>
        </div>
      </div>

      <DaySummary
        agenda={agenda}
        loading={loading}
        now={now}
        onSelect={(section) =>
          setFocus((f) => ({ section, nonce: (f?.nonce ?? 0) + 1 }))
        }
      />

      <div
        className={cn(
          "grid grid-cols-1 gap-6 flex-1 min-h-0",
          canSeeRevenue && "lg:grid-cols-[1fr_320px]",
        )}
      >
        <TodayAgenda
          agenda={agenda}
          loading={loading}
          error={error}
          onRetry={refetch}
          now={now}
          tomorrowArrivals={tomorrowArrivals}
          focus={focus}
        />
        {canSeeRevenue && (
          <div className="flex flex-col gap-6 min-h-0 overflow-y-auto">
            <TodaysRevenue />
          </div>
        )}
      </div>
    </div>
  );
}
