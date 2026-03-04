import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import AdPawsCard from "../AdPawsCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreVertical,
  ArrowRight,
  LogOut,
  DollarSign,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  RESERVATIONS_BY_COMPANY,
  RESERVATIONS_BY_COMPANY_OPERATION,
  UPDATE_RESERVATION,
  type ReservationsByCompanyResponse,
  type ReservationsByCompanyVariables,
  type ReservationFull,
} from "@/lib/api/reservations.api";
import { DOG_BREEDS } from "@/lib/utils";

type ServiceFilter = "all" | "stays" | "daycare";

const STATUS_LABELS: Record<string, string> = {
  CHECKED_IN: "Activo",
  PENDING: "Pendiente",
};

const STATUS_STYLES: Record<string, string> = {
  CHECKED_IN: "bg-badge-success text-badge-success-foreground",
  PENDING: "bg-badge-warning text-badge-warning-foreground",
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  HOTEL: "Estancia",
  DAYCARE: "Guardería",
  TRAINING: "Entrenamiento",
  GROOMING: "Grooming",
};

function getMainServiceType(reservation: ReservationFull): string | null {
  const mainItem = reservation.items.find((i) => i.kind === "MAIN");
  return mainItem?.service?.type ?? null;
}

function getServiceLabel(reservation: ReservationFull): string {
  const mainItem = reservation.items.find((i) => i.kind === "MAIN");
  const type = mainItem?.service?.type;
  if (!type) return mainItem?.name ?? "Servicio";
  return SERVICE_TYPE_LABELS[type] ?? type;
}

function formatCheckIn(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOwnerName(reservation: ReservationFull): string {
  const owner = reservation.dog?.owner;
  if (!owner) return "";
  return [owner.name, owner.lastname].filter(Boolean).join(" ");
}

function filterReservations(
  reservations: ReservationFull[],
  filter: ServiceFilter,
): ReservationFull[] {
  if (filter === "all") return reservations;
  return reservations.filter((r) => {
    const type = getMainServiceType(r);
    if (filter === "stays") return type === "HOTEL";
    if (filter === "daycare") return type === "DAYCARE";
    return true;
  });
}

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
  const label = STATUS_LABELS[status] ?? status;
  const style = STATUS_STYLES[status] ?? "";
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>
      {label}
    </span>
  );
}

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; style: string }> =
  {
    PAID: {
      label: "Pagado",
      style: "bg-badge-success text-badge-success-foreground",
    },
    UNPAID: {
      label: "Sin pagar",
      style: "bg-badge-warning text-badge-warning-foreground",
    },
    REFUNDED: {
      label: "Reembolsado",
      style: "bg-badge-danger text-badge-danger-foreground",
    },
  };

function PaymentBadge({ paymentStatus }: { paymentStatus: string }) {
  const config = PAYMENT_STATUS_CONFIG[paymentStatus];
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
  const canCheckout = reservation.status === "CHECKED_IN";
  const canCollectPayment =
    reservation.paymentStatus === "UNPAID" || reservation.paymentStatus === "";

  const canCheckoutAndCollect = canCheckout && canCollectPayment;

  if (!canCheckout && !canCollectPayment) return null;

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
          aria-label="Más opciones"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        {canCheckoutAndCollect && (
          <button
            type="button"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left font-medium"
            onClick={() =>
              handleAction(() => onCheckoutAndCollect(reservation))
            }
          >
            <Receipt className="w-4 h-4" />
            Checkout y Cobrar
          </button>
        )}
        {canCheckout && (
          <button
            type="button"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            onClick={() => handleAction(() => onCheckout(reservation))}
          >
            <LogOut className="w-4 h-4" />
            Solo Checkout
          </button>
        )}
        {canCollectPayment && (
          <button
            type="button"
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

export default function CurrentGuests() {
  const { company } = useAuth();
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [updatingReservationId, setUpdatingReservationId] = useState<
    number | null
  >(null);

  const [updateReservation] = useMutation(UPDATE_RESERVATION, {
    refetchQueries: [RESERVATIONS_BY_COMPANY_OPERATION],
  });

  const handleCheckout = async (reservation: ReservationFull) => {
    setUpdatingReservationId(reservation.id);
    try {
      await updateReservation({
        variables: {
          id: reservation.id,
          data: {
            status: "CHECKED_OUT",
            checkOut: new Date().toISOString(),
          },
        },
      });
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const handleCollectPayment = async (reservation: ReservationFull) => {
    setUpdatingReservationId(reservation.id);
    try {
      await updateReservation({
        variables: {
          id: reservation.id,
          data: {
            paymentStatus: "PAID",
            paymentMethod: "EFECTIVO",
          },
        },
      });
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const handleCheckoutAndCollect = async (reservation: ReservationFull) => {
    setUpdatingReservationId(reservation.id);
    try {
      await updateReservation({
        variables: {
          id: reservation.id,
          data: {
            status: "CHECKED_OUT",
            checkOut: new Date().toISOString(),
            paymentStatus: "PAID",
            paymentMethod: "EFECTIVO",
          },
        },
      });
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const { data, loading } = useQuery<
    ReservationsByCompanyResponse,
    ReservationsByCompanyVariables
  >(RESERVATIONS_BY_COMPANY, {
    variables: {
      companyId: Number(company?.id),
      filters: { status: "CHECKED_IN" },
    },
    skip: !company?.id,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reservations = data?.reservationsByCompany ?? [];

  const counts = useMemo(() => {
    const all = reservations.length;
    const stays = reservations.filter(
      (r) => getMainServiceType(r) === "HOTEL",
    ).length;
    const daycare = reservations.filter(
      (r) => getMainServiceType(r) === "DAYCARE",
    ).length;
    return { all, stays, daycare };
  }, [reservations]);

  const filtered = filterReservations(reservations, filter);

  return (
    <AdPawsCard className="!p-0 flex flex-col min-h-0 overflow-hidden gap-0">
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <h2 className="text-lg font-bold">Visitantes Actuales</h2>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as ServiceFilter)}
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

      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
        {loading && !filtered.length ? (
          Array.from({ length: 4 }).map((_, i) => <GuestRowSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No hay huéspedes en esta categoría.
          </div>
        ) : (
          filtered.map((reservation) => {
            const dog = reservation.dog;
            const ownerName = getOwnerName(reservation);
            return (
              <div
                key={reservation.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors"
              >
                <GuestAvatar name={dog?.name ?? "?"} imageUrl={dog?.imageUrl} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{dog?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {DOG_BREEDS[dog?.breed as keyof typeof DOG_BREEDS] ||
                      dog?.breed}{" "}
                    • {getServiceLabel(reservation)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatCheckIn(reservation.checkIn)}
                    {ownerName && `Dueño: ${ownerName}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <PaymentBadge paymentStatus={reservation.paymentStatus} />
                  <StatusBadge status={reservation.status} />
                  <GuestActionsMenu
                    reservation={reservation}
                    onCheckout={handleCheckout}
                    onCollectPayment={handleCollectPayment}
                    onCheckoutAndCollect={handleCheckoutAndCollect}
                    isActionLoading={updatingReservationId === reservation.id}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-6 py-4 border-t border-border shrink-0">
        <button className="flex items-center gap-2 mx-auto text-sm font-medium text-secondary dark:text-secondary-foreground hover:underline">
          Ver Todos los Huéspedes <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </AdPawsCard>
  );
}
