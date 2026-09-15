import { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DOG_UNPAID_RESERVATIONS_QUERY } from "@/graphql/operations/dashboard";
import { MARK_RESERVATION_PAID_MUTATION } from "@/graphql/operations/reservations";
import { evictReservationCache } from "@/graphql/cache";
import { showToast } from "@/lib/toast";
import { hasBalance } from "./utils/agenda";
import { formatMoney, formatShortDate } from "./utils/format";

/**
 * Cobro del saldo de un perro, reservación por reservación.
 *
 * `pendingPayments` agrupa por perro y no trae ids, así que aquí se piden sus
 * reservaciones. Se cobra una por una a propósito: marcar varias como pagadas
 * de un solo clic registraría eventos PAYMENT_RECORDED que no corresponden a
 * un cobro real en la terminal.
 *
 * Mismo criterio que `pendingPayments` en el backend: solo cuentan las que ya
 * se atendieron (CHECKED_IN, CHECKED_OUT, COMPLETED).
 */
const BILLABLE = new Set(["CHECKED_IN", "CHECKED_OUT", "COMPLETED"]);

interface CollectBalanceDialogProps {
  dog: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
}

export default function CollectBalanceDialog({
  dog,
  onOpenChange,
}: CollectBalanceDialogProps) {
  const { data, loading, error, refetch } = useQuery(
    DOG_UNPAID_RESERVATIONS_QUERY,
    {
      variables: { dogId: dog?.id ?? "" },
      skip: !dog,
      fetchPolicy: "network-only",
    },
  );
  const [markPaid, { loading: paying }] = useMutation(
    MARK_RESERVATION_PAID_MUTATION,
    { update: evictReservationCache },
  );

  const unpaid = useMemo(
    () =>
      (data?.reservations ?? [])
        .filter((r) => BILLABLE.has(r.status) && hasBalance(r))
        .sort(
          (a, b) =>
            new Date(a.scheduledCheckIn).getTime() -
            new Date(b.scheduledCheckIn).getTime(),
        ),
    [data?.reservations],
  );

  const collect = async (id: string) => {
    try {
      await markPaid({ variables: { id, method: "TERMINAL" } });
      showToast.success(
        "Cobro registrado",
        "Marcado como pagado para el match con la terminal.",
      );
      const next = await refetch();
      const left = (next.data?.reservations ?? []).filter(
        (r) => BILLABLE.has(r.status) && hasBalance(r),
      );
      if (left.length === 0) onOpenChange(false);
    } catch (err) {
      showToast.error(
        "Error",
        err instanceof Error ? err.message : "No se pudo registrar el cobro",
      );
    }
  };

  return (
    <Dialog open={!!dog} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Cobrar a {dog?.name}</DialogTitle>
          <DialogDescription>
            Registra cada cobro después de pasarlo por la terminal o recibir el
            efectivo.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="py-6 text-center">
            <p className="text-sm text-destructive mb-2">
              No se pudieron cargar las reservaciones
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm font-medium text-brand-strong hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : loading && !data ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : unpaid.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No encontramos saldos pendientes en sus últimas 30 reservaciones.
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-md">
            {unpaid.map((r) => {
              const main = r.items.find((i) => i.kind === "MAIN");
              const dates = r.scheduledCheckOut
                ? `${formatShortDate(r.scheduledCheckIn)} – ${formatShortDate(r.scheduledCheckOut)}`
                : formatShortDate(r.scheduledCheckIn);
              return (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {main?.name ?? "Reservación"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dates}
                      {r.paymentStatus === "PARTIALLY_PAID" && " · Pago parcial"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-badge-warning-foreground">
                    {formatMoney(r.total)}
                  </p>
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={paying}
                    onClick={() => collect(r.id)}
                  >
                    Cobrar
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
