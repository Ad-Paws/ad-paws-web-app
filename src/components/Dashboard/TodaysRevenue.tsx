import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ChevronDown, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { REVENUE_STATS_QUERY } from "@/graphql/operations/stats";
import { PENDING_PAYMENTS_QUERY } from "@/graphql/operations/dashboard";
import { moneyToNumber } from "@/utils/adapters";
import CollectBalanceDialog from "./CollectBalanceDialog";
import { formatMoney, plural } from "./utils/format";

const COLLAPSED_BALANCES = 3;

/**
 * Ingresos del día (revenueStats) y, debajo, a quién hay que cobrarle
 * (pendingPayments). Solo OWNER/ADMIN pueden pedir revenueStats — el
 * Dashboard no monta este componente para otros roles.
 */
export default function TodaysRevenue() {
  const { data, loading } = useQuery(REVENUE_STATS_QUERY);
  const {
    data: balancesData,
    loading: balancesLoading,
    error: balancesError,
  } = useQuery(PENDING_PAYMENTS_QUERY);
  const [showAll, setShowAll] = useState(false);
  const [collecting, setCollecting] = useState<{ id: string; name: string } | null>(
    null,
  );

  const revenue = data?.revenueStats;
  const previousUnpaid = moneyToNumber(revenue?.previousUnpaid);
  const balances = balancesData?.pendingPayments ?? [];
  const visible = showAll ? balances : balances.slice(0, COLLAPSED_BALANCES);

  return (
    <div className="rounded-md bg-[#1F3F3A] text-white p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium opacity-90">Ingresos de hoy</h3>
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-28 !bg-white/20" />
          <Skeleton className="h-4 w-40 !bg-white/10" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold tracking-tight">
            {formatMoney(revenue?.total)}
          </p>

          <div className="space-y-1.5 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">Pagado</span>
              <span className="text-sm font-semibold text-green-300">
                {formatMoney(revenue?.paid)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">Pendiente de hoy</span>
              <span className="text-sm font-semibold text-amber-300">
                {formatMoney(revenue?.unpaid)}
              </span>
            </div>
            {previousUnpaid > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Pendiente anterior</span>
                <span className="text-sm font-semibold text-red-300">
                  {formatMoney(previousUnpaid)}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Por cobrar */}
      <div className="pt-3 border-t border-white/20 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide font-medium opacity-70">
          Por cobrar
        </p>
        {balancesError ? (
          <p className="text-sm opacity-80">No se pudieron cargar los saldos.</p>
        ) : balancesLoading && !balancesData ? (
          <>
            <Skeleton className="h-9 w-full !bg-white/10" />
            <Skeleton className="h-9 w-full !bg-white/10" />
          </>
        ) : balances.length === 0 ? (
          <p className="text-sm opacity-80">Nadie tiene saldo pendiente.</p>
        ) : (
          <>
            {visible.map((b) => (
              <div key={b.dog.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {b.dog.name} · {formatMoney(b.amount)}
                  </p>
                  <p className="text-xs opacity-70">
                    {plural(b.reservations, "reservación", "reservaciones")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCollecting({ id: b.dog.id, name: b.dog.name })}
                  className="h-7 px-3 rounded-full bg-white/15 hover:bg-white/25 text-[13px] font-medium transition-colors"
                >
                  Cobrar
                </button>
              </div>
            ))}
            {balances.length > COLLAPSED_BALANCES && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="self-start flex items-center gap-1 text-[13px] font-medium opacity-85 hover:opacity-100"
              >
                {showAll ? "Ver menos" : `Ver los ${balances.length} saldos`}
                <ChevronDown className={showAll ? "w-3.5 h-3.5 rotate-180" : "w-3.5 h-3.5"} />
              </button>
            )}
          </>
        )}
      </div>

      <CollectBalanceDialog
        dog={collecting}
        onOpenChange={(open) => !open && setCollecting(null)}
      />
    </div>
  );
}
