import { useQuery } from "@apollo/client/react";
import { DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { REVENUE_STATS_QUERY } from "@/graphql/operations/stats";
import { moneyToNumber } from "@/utils/adapters";

const SERVICE_TYPE_LABELS: Record<string, string> = {
  HOTEL: "Estancias",
  DAYCARE: "Guardería",
  TRAINING: "Entrenamiento",
  GROOMING: "Grooming",
  OTHER: "Otros",
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Ingresos del día (revenueStats). Solo OWNER/ADMIN pueden pedirla —
 * el Dashboard no monta este componente para otros roles.
 */
export default function TodaysRevenue() {
  const { data, loading } = useQuery(REVENUE_STATS_QUERY);

  const revenue = data?.revenueStats;
  const previousUnpaid = moneyToNumber(revenue?.previousUnpaid);

  return (
    <div className="rounded-md bg-gradient-to-br bg-[#1F3F3A] text-white p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium opacity-90">Ingresos de Hoy</h3>
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
          <div>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(moneyToNumber(revenue?.total))}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">Pagado</span>
              <span className="text-sm font-semibold text-green-300">
                {formatCurrency(moneyToNumber(revenue?.paid))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">Pendiente</span>
              <span className="text-sm font-semibold text-amber-300">
                {formatCurrency(moneyToNumber(revenue?.unpaid))}
              </span>
            </div>
            {previousUnpaid > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Pendiente anterior</span>
                <span className="text-sm font-semibold text-red-300">
                  {formatCurrency(previousUnpaid)}
                </span>
              </div>
            )}
          </div>

          {revenue?.byServiceType && revenue.byServiceType.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/20">
              {revenue.byServiceType.map((item) => (
                <div key={item.serviceType} className="flex items-center justify-between">
                  <span className="text-sm opacity-80">
                    {SERVICE_TYPE_LABELS[item.serviceType] ?? item.serviceType}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(moneyToNumber(item.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
