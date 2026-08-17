import { useQuery } from "@apollo/client/react";
import { Infinity as InfinityIcon, PackageCheck } from "lucide-react";
import { DOG_PACKAGES_QUERY } from "@/graphql/operations/packages";
import { daysMaskToShortLabel } from "@/utils/adapters";

/**
 * Avisa que el alumno trae saldo utilizable EN ESTE PASO.
 *
 * Dos decisiones que lo hacen útil en vez de decorativo:
 *
 *   1. Se filtra por los servicios que se están reservando. Antes mostraba
 *      todos los paquetes activos, así que al reservar una alberca anunciaba
 *      un paquete de noches de hotel: ocupaba media pantalla con información
 *      que no aplica y podía hacer creer que el extra salía cubierto.
 *
 *   2. Los saldos se agrupan. Dos compras del mismo paquete son dos
 *      DogPackage distintos, pero al staff no le sirve esa distinción en el
 *      mostrador: le sirve saber que hay 20 noches. Se agrupa por servicio Y
 *      máscara de días, porque "10 noches L–V" y "10 noches L–D" no son el
 *      mismo derecho y sumarlas mentiría.
 *
 * Es informativo: la cobertura se decide por fecha y el importe autoritativo
 * lo da `quoteReservation`.
 */

interface ActivePackageBannerProps {
  dogId: string | null;
  /** Servicios en juego en este paso. Sin esto el aviso no puede ser relevante. */
  serviceIds: string[];
}

interface GroupedBalance {
  key: string;
  serviceName: string;
  daysMask: number;
  /** Null = ilimitado; basta con que un saldo lo sea. */
  remaining: number | null;
}

export function ActivePackageBanner({
  dogId,
  serviceIds,
}: ActivePackageBannerProps) {
  const { data } = useQuery(DOG_PACKAGES_QUERY, {
    variables: { dogId: dogId ?? "", activeOnly: true },
    skip: !dogId,
  });

  const relevant = new Set(serviceIds);
  const groups = new Map<string, GroupedBalance>();

  for (const dogPackage of data?.dogPackages ?? []) {
    for (const balance of dogPackage.balances) {
      if (!relevant.has(balance.service.id)) continue;

      const key = `${balance.service.id}:${balance.daysMask}`;
      const current = groups.get(key);

      if (!current) {
        groups.set(key, {
          key,
          serviceName: balance.service.name,
          daysMask: balance.daysMask,
          remaining: balance.remainingQuantity,
        });
        continue;
      }
      // Ilimitado absorbe: si un paquete no tiene tope, el conjunto tampoco.
      current.remaining =
        current.remaining === null || balance.remainingQuantity === null
          ? null
          : current.remaining + balance.remainingQuantity;
    }
  }

  const balances = [...groups.values()];
  if (balances.length === 0) return null;

  return (
    <div className="px-3 py-2.5 rounded-xl border border-brand-border bg-brand-tint">
      <div className="flex items-center gap-2 mb-1.5">
        <PackageCheck className="w-4 h-4 text-brand-strong shrink-0" />
        <p className="text-sm font-medium text-brand-strong">
          Saldo disponible para este servicio
        </p>
      </div>

      <div className="space-y-0.5">
        {balances.map((balance) => (
          <div
            key={balance.key}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="truncate">
              {balance.serviceName}
              <span className="text-muted-foreground">
                {" "}
                · {daysMaskToShortLabel(balance.daysMask)}
              </span>
            </span>
            <span className="font-medium whitespace-nowrap flex items-center gap-1 text-brand-strong">
              {balance.remaining === null ? (
                <>
                  <InfinityIcon className="w-3 h-3" />
                  Ilimitado
                </>
              ) : (
                <span
                  className={balance.remaining === 0 ? "text-amber-700" : ""}
                >
                  {balance.remaining} disponibles
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
