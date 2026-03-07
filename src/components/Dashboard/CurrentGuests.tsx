import { useState, memo } from "react";
import AdPawsCard from "../AdPawsCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, LogOut, DollarSign, Receipt, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { type ReservationFull } from "@/lib/api/reservations.api";
import { DOG_BREEDS } from "@/lib/utils";

import { useGuestFilters } from "./hooks/useGuestFilters";
import { useGuestData } from "./hooks/useGuestData";
import { useGuestActions } from "./hooks/useGuestActions";
import {
  type ServiceFilter,
  type TimeFilter,
  STATUS_LABELS,
  STATUS_STYLES,
  PAYMENT_STATUS_CONFIG,
} from "./constants/guestConstants";
import {
  getServiceLabel,
  formatCheckIn,
  getOwnerName,
  getAvailableActions,
} from "./utils/guestUtils";

function GuestAvatar({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-brandSecondary-100 flex items-center justify-center text-brandSecondary-600 font-semibold text-lg">
      {name.charAt(0)}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status;
  const style = STATUS_STYLES[status as keyof typeof STATUS_STYLES] ?? "";
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>
      {label}
    </span>
  );
}

function PaymentBadge({ paymentStatus }: { paymentStatus: string }) {
  const config =
    PAYMENT_STATUS_CONFIG[paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG];
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${config?.style ?? ""}`}
    >
      {config?.label ?? paymentStatus}
    </span>
  );
}

function GuestRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

interface GuestActionsMenuProps {
  reservation: ReservationFull;
  onCheckout: (reservation: ReservationFull) => void;
  onCollectPayment: (reservation: ReservationFull) => void;
  onCheckoutAndCollect: (reservation: ReservationFull) => void;
  isActionLoading?: boolean;
}

function GuestActionsMenu({
  reservation,
  onCheckout,
  onCollectPayment,
  onCheckoutAndCollect,
  isActionLoading,
}: GuestActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const actions = getAvailableActions(reservation);

  if (!actions.hasAnyAction) return null;

  const handleAction = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isActionLoading}
          className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
          aria-label={`Acciones para ${reservation.dog?.name ?? "huésped"}`}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end" role="menu">
        {actions.canCheckoutAndCollect && (
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left font-medium"
            onClick={() =>
              handleAction(() => onCheckoutAndCollect(reservation))
            }
          >
            <Receipt className="w-4 h-4" />
            Checkout y Cobrar
          </button>
        )}
        {actions.canCheckout && (
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            onClick={() => handleAction(() => onCheckout(reservation))}
          >
            <LogOut className="w-4 h-4" />
            Solo Checkout
          </button>
        )}
        {actions.canCollectPayment && (
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            onClick={() => handleAction(() => onCollectPayment(reservation))}
          >
            <DollarSign className="w-4 h-4" />
            Solo Cobrar
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface GuestRowProps {
  reservation: ReservationFull;
  onCheckout: (reservation: ReservationFull) => void;
  onCollectPayment: (reservation: ReservationFull) => void;
  onCheckoutAndCollect: (reservation: ReservationFull) => void;
  isActionLoading: boolean;
}

const GuestRow = memo(function GuestRow({
  reservation,
  onCheckout,
  onCollectPayment,
  onCheckoutAndCollect,
  isActionLoading,
}: GuestRowProps) {
  const dog = reservation.dog;
  const ownerName = getOwnerName(reservation);
  const checkInTime = formatCheckIn(reservation.checkIn);

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors">
      <GuestAvatar name={dog?.name ?? "?"} imageUrl={dog?.imageUrl} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{dog?.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {DOG_BREEDS[dog?.breed as keyof typeof DOG_BREEDS] || dog?.breed} •{" "}
          {getServiceLabel(reservation)}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {checkInTime}
          {checkInTime && ownerName && " • "}
          {ownerName && `Dueño: ${ownerName}`}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <PaymentBadge paymentStatus={reservation.paymentStatus} />
        <StatusBadge status={reservation.status} />
        <GuestActionsMenu
          reservation={reservation}
          onCheckout={onCheckout}
          onCollectPayment={onCollectPayment}
          onCheckoutAndCollect={onCheckoutAndCollect}
          isActionLoading={isActionLoading}
        />
      </div>
    </div>
  );
});

function EmptyState({
  serviceFilter,
  timeFilter,
}: {
  serviceFilter: ServiceFilter;
  timeFilter: TimeFilter;
}) {
  const filterLabel =
    serviceFilter === "all"
      ? "visitantes"
      : serviceFilter === "stays"
        ? "estancias"
        : "guarderías";

  return (
    <div className="px-6 py-10 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        No hay {filterLabel}
      </p>
      <p className="text-xs text-muted-foreground">
        {timeFilter === "today"
          ? "Los huéspedes aparecerán aquí cuando hagan check-in"
          : "No hay registros históricos para esta categoría"}
      </p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="text-sm text-destructive mb-2">
        Error al cargar visitantes
      </p>
      <p className="text-xs text-muted-foreground mb-4">{error.message}</p>
      <button
        onClick={onRetry}
        className="text-sm font-medium text-primary hover:underline"
      >
        Reintentar
      </button>
    </div>
  );
}

export default function CurrentGuests() {
  const { company } = useAuth();
  const {
    serviceFilter,
    setServiceFilter,
    timeFilter,
    setTimeFilter,
    filterConfig,
  } = useGuestFilters();

  const { reservations, loading, error, counts, refetch } = useGuestData(
    company?.id ? Number(company.id) : undefined,
    serviceFilter,
    filterConfig,
  );

  const {
    handleCheckout,
    handleCollectPayment,
    handleCheckoutAndCollect,
    updatingReservationId,
  } = useGuestActions();

  return (
    <AdPawsCard className="!p-0 flex flex-col min-h-0 overflow-hidden gap-0">
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <h2 className="text-lg font-bold">Visitantes</h2>
        <Tabs
          value={serviceFilter}
          onValueChange={(v) => setServiceFilter(v as ServiceFilter)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-3">
              Todos ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="stays" className="text-xs px-3">
              Estancias ({counts.stays})
            </TabsTrigger>
            <TabsTrigger value="daycare" className="text-xs px-3">
              Guardería ({counts.daycare})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-6">
        <Tabs
          value={timeFilter}
          onValueChange={(v) => setTimeFilter(v as TimeFilter)}
        >
          <TabsList variant="line">
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="past">Pasados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading && !reservations.length ? (
          Array.from({ length: 4 }).map((_, i) => <GuestRowSkeleton key={i} />)
        ) : reservations.length === 0 ? (
          <EmptyState serviceFilter={serviceFilter} timeFilter={timeFilter} />
        ) : (
          reservations.map((reservation) => (
            <GuestRow
              key={reservation.id}
              reservation={reservation}
              onCheckout={handleCheckout}
              onCollectPayment={handleCollectPayment}
              onCheckoutAndCollect={handleCheckoutAndCollect}
              isActionLoading={updatingReservationId === reservation.id}
            />
          ))
        )}
      </div>
    </AdPawsCard>
  );
}
