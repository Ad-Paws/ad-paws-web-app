export const RESERVATION_STATUS = {
  PENDING: "PENDING",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const PAYMENT_STATUS = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  REFUNDED: "REFUNDED",
} as const;

export const PAYMENT_METHOD = {
  EFECTIVO: "EFECTIVO",
  TARJETA: "TARJETA",
  TRANSFERENCIA: "TRANSFERENCIA",
} as const;

export const ITEM_KIND = {
  MAIN: "MAIN",
  ADDON: "ADDON",
  DISCOUNT: "DISCOUNT",
  FEE: "FEE",
} as const;

export type ServiceFilter = "all" | "stays" | "daycare";
export type TimeFilter = "today" | "past";

export const SERVICE_TYPE_MAP: Record<ServiceFilter, string | null> = {
  all: null,
  stays: "HOTEL",
  daycare: "DAYCARE",
};

type ReservationStatusKey = keyof typeof RESERVATION_STATUS;
type PaymentStatusKey = keyof typeof PAYMENT_STATUS;

export const STATUS_LABELS: Record<ReservationStatusKey, string> = {
  CHECKED_IN: "Activo",
  PENDING: "Pendiente",
  CHECKED_OUT: "Finalizado",
  CANCELLED: "Cancelado",
  COMPLETED: "Completado",
};

export const STATUS_STYLES: Record<ReservationStatusKey, string> = {
  CHECKED_IN: "bg-badge-success text-badge-success-foreground",
  PENDING: "bg-badge-warning text-badge-warning-foreground",
  CHECKED_OUT: "bg-muted text-muted-foreground",
  CANCELLED: "bg-badge-danger text-badge-danger-foreground",
  COMPLETED: "bg-muted text-muted-foreground",
};

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  HOTEL: "Estancia",
  DAYCARE: "Guardería",
  TRAINING: "Entrenamiento",
  GROOMING: "Grooming",
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatusKey,
  { label: string; style: string }
> = {
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
