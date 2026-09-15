import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import AdPawsCard from "../AdPawsCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DASHBOARD_AGENDA_QUERY } from "@/graphql/operations/dashboard";
import AgendaRow from "./AgendaRow";
import type { AgendaSection } from "./DaySummary";
import { useGuestActions } from "./hooks/useGuestActions";
import {
  type Agenda,
  type AgendaReservation,
  type ServiceFilter,
  addDays,
  countByService,
  dayParam,
  filterAgenda,
  hasBalance,
  matchesServiceFilter,
} from "./utils/agenda";
import { formatTime, plural } from "./utils/format";

const COLLAPSED_ROWS = 3;

function GroupHeader({ title, count, note, noteTone = "muted" }: {
  title: string;
  count: number;
  note?: string;
  noteTone?: "muted" | "warning";
}) {
  return (
    <div className="sticky top-0 z-[1] px-6 py-2 bg-[#f7faf7] border-y border-border flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title} · {count}
      </p>
      {note && (
        <p
          className={
            noteTone === "warning"
              ? "text-xs text-badge-warning-foreground"
              : "text-xs text-muted-foreground"
          }
        >
          {note}
        </p>
      )}
    </div>
  );
}

function ShowMore({ open, hidden, onToggle, label }: {
  open: boolean;
  hidden: number;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-6 py-2.5 flex items-center gap-1.5 text-[13px] font-medium text-brand-strong hover:underline"
    >
      {open ? "Ver menos" : (label ?? `Ver ${hidden} más`)}
      <ChevronDown className={open ? "w-3.5 h-3.5 rotate-180" : "w-3.5 h-3.5"} />
    </button>
  );
}

function RowsSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function MiniAvatars({ items }: { items: AgendaReservation[] }) {
  return (
    <div className="flex shrink-0">
      {items.slice(0, 4).map((r, i) =>
        r.dog.imageUrl ? (
          <img
            key={r.id}
            src={r.dog.imageUrl}
            alt=""
            className={`w-8 h-8 rounded-full object-cover border-2 border-white ${i ? "-ml-2" : ""}`}
          />
        ) : (
          <div
            key={r.id}
            className={`w-8 h-8 rounded-full bg-muted text-brand-strong border-2 border-white text-[13px] font-semibold flex items-center justify-center ${i ? "-ml-2" : ""}`}
          >
            {r.dog.name.charAt(0).toUpperCase()}
          </div>
        ),
      )}
    </div>
  );
}

/** Lista de solo lectura con las llegadas de mañana (desde el estado vacío). */
function TomorrowPreview({ serviceFilter, onBack }: {
  serviceFilter: ServiceFilter;
  onBack: () => void;
}) {
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);
  const { data, loading, error, refetch } = useQuery(DASHBOARD_AGENDA_QUERY, {
    variables: { date: dayParam(tomorrow) },
  });
  const arrivals = useMemo(
    () =>
      (data?.reservationsOn ?? [])
        .filter(
          (r) =>
            r.status === "PENDING" &&
            new Date(r.scheduledCheckIn).toDateString() === tomorrow.toDateString() &&
            matchesServiceFilter(r, serviceFilter),
        )
        .sort(
          (a, b) =>
            new Date(a.scheduledCheckIn).getTime() -
            new Date(b.scheduledCheckIn).getTime(),
        ),
    [data?.reservationsOn, serviceFilter, tomorrow],
  );

  return (
    <>
      <div className="px-6 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-strong hover:underline"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Volver a hoy
        </button>
      </div>
      <GroupHeader
        title={`Llegan mañana, ${tomorrow.toLocaleDateString("es-MX", { weekday: "long", day: "numeric" })}`}
        count={arrivals.length}
      />
      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : loading && !data ? (
        <RowsSkeleton />
      ) : arrivals.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-muted-foreground">
          Mañana tampoco hay llegadas.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {arrivals.map((r) => (
            <AgendaRow key={r.id} reservation={r} kind="preview" now={tomorrow} />
          ))}
        </div>
      )}
    </>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="text-sm text-destructive mb-2">No se pudo cargar la agenda</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-sm font-medium text-brand-strong hover:underline"
      >
        Reintentar
      </button>
    </div>
  );
}

interface TodayAgendaProps {
  agenda: Agenda | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  now: Date;
  /** Llegadas de mañana (guestStats); `undefined` mientras carga. */
  tomorrowArrivals?: number;
  /** Cambia cuando el usuario toca un contador del resumen. */
  focus: { section: AgendaSection; nonce: number } | null;
}

export default function TodayAgenda({
  agenda,
  loading,
  error,
  onRetry,
  now,
  tomorrowArrivals,
  focus,
}: TodayAgendaProps) {
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [showTomorrow, setShowTomorrow] = useState(false);
  const [expanded, setExpanded] = useState<Record<AgendaSection, boolean>>({
    arriving: false,
    departing: false,
    staying: false,
  });
  const sectionRefs = {
    arriving: useRef<HTMLDivElement>(null),
    departing: useRef<HTMLDivElement>(null),
    staying: useRef<HTMLDivElement>(null),
  };

  const {
    handleCheckIn,
    handleCheckout,
    handleCollectPayment,
    handleCheckoutAndCollect,
    updatingReservationId,
  } = useGuestActions();
  // Los errores ya se notifican con toast dentro del hook; aquí solo se evita
  // un rechazo sin manejar.
  const safe =
    <T,>(fn: (r: T) => Promise<unknown>) =>
    (r: T) => {
      fn(r).catch(() => undefined);
    };
  const actions = {
    onCheckIn: safe(handleCheckIn),
    onCheckout: safe(handleCheckout),
    onCollectPayment: safe(handleCollectPayment),
    onCheckoutAndCollect: safe(handleCheckoutAndCollect),
  };

  useEffect(() => {
    if (!focus) return;
    setShowTomorrow(false);
    if (focus.section === "staying") {
      setExpanded((e) => ({ ...e, staying: true }));
    }
    // Espera al render con el grupo visible antes de desplazar.
    requestAnimationFrame(() =>
      sectionRefs[focus.section].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
    // sectionRefs es estable (useRef); solo importa el nuevo foco.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const counts = agenda ? countByService(agenda) : { all: 0, stays: 0, daycare: 0 };
  const groups = agenda ? filterAgenda(agenda, serviceFilter) : null;
  const isEmpty =
    groups &&
    groups.arriving.length + groups.departing.length + groups.staying.length === 0;

  const toggle = (section: AgendaSection) =>
    setExpanded((e) => ({ ...e, [section]: !e[section] }));

  const renderRows = (
    section: "arriving" | "departing",
    rows: AgendaReservation[],
  ) => {
    const visible = expanded[section] ? rows : rows.slice(0, COLLAPSED_ROWS);
    return (
      <>
        <div className="divide-y divide-border border-b border-border">
          {visible.map((r) => (
            <AgendaRow
              key={r.id}
              reservation={r}
              kind={section}
              now={now}
              actions={actions}
              busy={updatingReservationId === r.id}
            />
          ))}
        </div>
        {rows.length > COLLAPSED_ROWS && (
          <ShowMore
            open={expanded[section]}
            hidden={rows.length - COLLAPSED_ROWS}
            onToggle={() => toggle(section)}
          />
        )}
      </>
    );
  };

  const nextToday = groups?.arriving.find(
    (r) => new Date(r.scheduledCheckIn).getTime() >= now.getTime(),
  );

  return (
    <AdPawsCard className="!p-0 flex flex-col min-h-0 overflow-hidden gap-0">
      <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
        <h2 className="text-lg font-bold">
          {showTomorrow ? "Agenda de mañana" : "Agenda de hoy"}
        </h2>
        <Tabs
          value={serviceFilter}
          onValueChange={(v) => setServiceFilter(v as ServiceFilter)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-3">
              Todos{showTomorrow ? "" : ` (${counts.all})`}
            </TabsTrigger>
            <TabsTrigger value="stays" className="text-xs px-3">
              Estancias{showTomorrow ? "" : ` (${counts.stays})`}
            </TabsTrigger>
            <TabsTrigger value="daycare" className="text-xs px-3">
              Guardería{showTomorrow ? "" : ` (${counts.daycare})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {showTomorrow ? (
          <TomorrowPreview
            serviceFilter={serviceFilter}
            onBack={() => setShowTomorrow(false)}
          />
        ) : error && !agenda ? (
          <ErrorState onRetry={onRetry} />
        ) : loading && !agenda ? (
          <RowsSkeleton />
        ) : isEmpty || !groups ? (
          <div className="px-6 py-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {serviceFilter === "all"
                ? "Hoy no hay llegadas ni salidas"
                : serviceFilter === "stays"
                  ? "Hoy no hay estancias"
                  : "Hoy no hay guardería"}
            </p>
            <p className="text-xs text-muted-foreground">
              {tomorrowArrivals === undefined
                ? "Nadie está hospedado en este momento."
                : tomorrowArrivals > 0
                  ? `Mañana ${tomorrowArrivals === 1 ? "llega" : "llegan"} ${plural(tomorrowArrivals, "perro", "perros")}.`
                  : "Mañana tampoco hay llegadas programadas."}
            </p>
            {!!tomorrowArrivals && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-white mt-5"
                onClick={() => setShowTomorrow(true)}
              >
                Ver agenda de mañana
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <>
            {groups.arriving.length > 0 && (
              <div ref={sectionRefs.arriving} className="scroll-mt-0">
                <GroupHeader
                  title="Por llegar"
                  count={groups.arriving.length}
                  note={
                    nextToday
                      ? `Próxima a las ${formatTime(nextToday.scheduledCheckIn)}`
                      : "Ordenado por hora"
                  }
                />
                {renderRows("arriving", groups.arriving)}
              </div>
            )}

            {groups.departing.length > 0 && (
              <div ref={sectionRefs.departing}>
                <GroupHeader
                  title="Salen hoy"
                  count={groups.departing.length}
                  note={(() => {
                    const n = groups.departing.filter(hasBalance).length;
                    return n ? `${n} con saldo pendiente` : undefined;
                  })()}
                  noteTone="warning"
                />
                {renderRows("departing", groups.departing)}
              </div>
            )}

            {groups.staying.length > 0 && (
              <div ref={sectionRefs.staying}>
                <GroupHeader title="Se quedan" count={groups.staying.length} />
                {expanded.staying ? (
                  <>
                    <div className="divide-y divide-border border-b border-border">
                      {groups.staying.map((r) => (
                        <AgendaRow
                          key={r.id}
                          reservation={r}
                          kind="staying"
                          now={now}
                          actions={actions}
                          busy={updatingReservationId === r.id}
                        />
                      ))}
                    </div>
                    <ShowMore open hidden={0} onToggle={() => toggle("staying")} />
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggle("staying")}
                    className="w-full flex items-center gap-4 px-6 py-3.5 text-left hover:bg-muted/40"
                  >
                    <MiniAvatars items={groups.staying} />
                    <p className="flex-1 min-w-0 truncate text-sm">
                      {groups.staying
                        .slice(0, 4)
                        .map((r) => r.dog.name)
                        .join(", ")}
                      {groups.staying.length > 4 && (
                        <span className="text-muted-foreground">
                          {" "}
                          y {groups.staying.length - 4} más
                        </span>
                      )}
                    </p>
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-brand-strong">
                      Ver todos
                      <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AdPawsCard>
  );
}
