import { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  DollarSign,
  LogIn,
  LogOut,
  MoreVertical,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, DOG_BREEDS } from "@/lib/utils";
import {
  type AgendaReservation,
  SERVICE_TYPE_LABELS,
  delayLabel,
  hasBalance,
  mainServiceType,
} from "./utils/agenda";
import {
  formatMoney,
  formatShortDate,
  formatTime,
  ownerName,
  plural,
} from "./utils/format";
import type { ReservationActionTarget } from "./hooks/useGuestActions";

export type AgendaRowKind = "arriving" | "departing" | "staying" | "preview";

export interface AgendaRowActions {
  onCheckIn: (r: ReservationActionTarget) => void;
  onCheckout: (r: ReservationActionTarget) => void;
  onCollectPayment: (r: ReservationActionTarget) => void;
  onCheckoutAndCollect: (r: ReservationActionTarget) => void;
}

const BADGE = "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap";

function DogAvatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-muted text-brand-strong flex items-center justify-center font-semibold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function PaymentBadge({
  reservation,
  kind,
}: {
  reservation: AgendaReservation;
  kind: AgendaRowKind;
}) {
  // Una reserva cubierta por completo con paquete nace PAID en el backend
  // (reservation.service.ts, `fullyCovered`), así que cae aquí.
  if (reservation.paymentStatus === "PAID") {
    return (
      <span className={cn(BADGE, "bg-badge-success text-badge-success-foreground")}>
        Pagado
      </span>
    );
  }
  if (reservation.paymentStatus === "REFUNDED") {
    return (
      <span className={cn(BADGE, "bg-badge-danger text-badge-danger-foreground")}>
        Reembolsado
      </span>
    );
  }
  if (reservation.paymentStatus === "PARTIALLY_PAID") {
    // El schema no expone lo ya pagado: mostrar el total como deuda mentiría.
    return (
      <span className={cn(BADGE, "bg-badge-warning text-badge-warning-foreground")}>
        Pago parcial
      </span>
    );
  }
  return (
    <span className={cn(BADGE, "bg-badge-warning text-badge-warning-foreground")}>
      {/* Antes de llegar no se debe nada todavía: se cobra en mostrador. */}
      {kind === "arriving" || kind === "preview" ? "Por cobrar" : "Debe"}{" "}
      {formatMoney(reservation.total)}
    </span>
  );
}

function serviceLabel(r: AgendaReservation): string {
  const type = mainServiceType(r);
  const label = type ? (SERVICE_TYPE_LABELS[type] ?? type) : "Servicio";
  if (type === "HOTEL" && r.scheduledCheckOut) {
    const nights = Math.round(
      (new Date(r.scheduledCheckOut).setHours(0, 0, 0, 0) -
        new Date(r.scheduledCheckIn).setHours(0, 0, 0, 0)) /
        86_400_000,
    );
    if (nights > 0) return `${label}, ${plural(nights, "noche", "noches")}`;
  }
  return label;
}

function timeCell(r: AgendaReservation, kind: AgendaRowKind, now: Date) {
  if (kind === "arriving" || kind === "preview") {
    const at = new Date(r.scheduledCheckIn);
    const isPastDay = at.getTime() < new Date(now).setHours(0, 0, 0, 0);
    return isPastDay ? formatShortDate(r.scheduledCheckIn) : formatTime(r.scheduledCheckIn);
  }
  if (kind === "departing") {
    return r.scheduledCheckOut ? formatTime(r.scheduledCheckOut) : "Hoy";
  }
  return r.scheduledCheckOut ? formatShortDate(r.scheduledCheckOut) : "";
}

function RowMenu({
  reservation,
  actions,
  disabled,
}: {
  reservation: AgendaReservation;
  actions: AgendaRowActions;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const canCollect = hasBalance(reservation);
  const run = (fn: () => void) => {
    fn();
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
          aria-label={`Más acciones para ${reservation.dog.name}`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="end" role="menu">
        <button
          type="button"
          role="menuitem"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-left"
          onClick={() => run(() => actions.onCheckout(reservation))}
        >
          <LogOut className="w-4 h-4" />
          Checkout anticipado
        </button>
        {canCollect && (
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-left"
            onClick={() => run(() => actions.onCollectPayment(reservation))}
          >
            <DollarSign className="w-4 h-4" />
            Solo cobrar
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface AgendaRowProps {
  reservation: AgendaReservation;
  kind: AgendaRowKind;
  now: Date;
  actions?: AgendaRowActions;
  busy?: boolean;
}

function AgendaRow({ reservation: r, kind, now, actions, busy = false }: AgendaRowProps) {
  const owner = ownerName(r.dog.primaryOwner);
  const breed = r.dog.breed
    ? (DOG_BREEDS[r.dog.breed as keyof typeof DOG_BREEDS] ?? r.dog.breed)
    : null;
  const late =
    kind === "arriving"
      ? delayLabel(r.scheduledCheckIn, now)
      : kind === "departing" && r.scheduledCheckOut
        ? delayLabel(r.scheduledCheckOut, now)
        : null;
  const balance = hasBalance(r);

  return (
    <div className="flex items-center gap-4 px-6 py-3 hover:bg-muted/40 transition-colors">
      <p
        className={cn(
          "w-14 shrink-0 text-sm font-semibold tabular-nums",
          late && "text-badge-warning-foreground",
        )}
      >
        {timeCell(r, kind, now)}
      </p>
      <DogAvatar name={r.dog.name} imageUrl={r.dog.imageUrl} />
      <div className="flex-1 min-w-0">
        <Link
          to={`/visitantes-perrunos/${r.dog.id}`}
          className="text-sm font-semibold text-foreground hover:text-foreground hover:underline"
        >
          {r.dog.name}
        </Link>
        <p className="text-xs text-muted-foreground truncate">
          {[breed, serviceLabel(r), owner && `Dueño: ${owner}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {late && (
          <span
            className={cn(
              BADGE,
              "bg-badge-warning text-badge-warning-foreground inline-flex items-center gap-1",
            )}
          >
            <Clock className="w-3 h-3" />
            {late}
          </span>
        )}
        <PaymentBadge reservation={r} kind={kind} />

        {actions && kind === "arriving" && (
          <Button
            size="sm"
            className="rounded-full"
            disabled={busy}
            onClick={() => actions.onCheckIn(r)}
          >
            <LogIn className="w-3.5 h-3.5" />
            Check-in
          </Button>
        )}

        {actions && kind === "departing" &&
          (balance ? (
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full"
              disabled={busy}
              onClick={() => actions.onCheckoutAndCollect(r)}
            >
              <Receipt className="w-3.5 h-3.5" />
              Checkout y cobrar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full bg-white"
              disabled={busy}
              onClick={() => actions.onCheckout(r)}
            >
              <LogOut className="w-3.5 h-3.5" />
              Checkout
            </Button>
          ))}

        {actions && kind === "staying" && (
          <RowMenu reservation={r} actions={actions} disabled={busy} />
        )}
      </div>
    </div>
  );
}

export default memo(AgendaRow);
