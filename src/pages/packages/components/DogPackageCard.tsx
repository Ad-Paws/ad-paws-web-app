import { CalendarClock, Infinity as InfinityIcon, RotateCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { daysMaskToShortLabel } from "@/utils/adapters";
import { cn } from "@/lib/utils";
import type { DogPackagesQuery } from "@/gql/graphql";

type DogPackage = DogPackagesQuery["dogPackages"][number];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-brand/20 text-brand-strong",
  DEPLETED: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activo",
  DEPLETED: "Agotado",
  EXPIRED: "Vencido",
  CANCELLED: "Cancelado",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

interface DogPackageCardProps {
  dogPackage: DogPackage;
  onRenew: (dogPackage: DogPackage) => void;
  onCancel: (dogPackage: DogPackage) => void;
  renewing: boolean;
}

/**
 * Un paquete vendido, con sus saldos.
 *
 * Renovar no está disponible para un paquete cancelado: el backend lo rechaza
 * (hay que vender uno nuevo), así que la UI no ofrece la acción en vez de dejar
 * al usuario descubrirlo con un error. Sí se ofrece en AGOTADO y VENCIDO, que
 * es justo cuando renovar tiene sentido.
 */
export function DogPackageCard({
  dogPackage,
  onRenew,
  onCancel,
  renewing,
}: DogPackageCardProps) {
  const isCancelled = dogPackage.status === "CANCELLED";
  // El backend permite una sola renovación por paquete: el sucesor existe o no.
  const alreadyRenewed = dogPackage.renewedTo !== null;

  return (
    <div
      className={cn(
        "p-5 rounded-xl border-2 bg-white dark:bg-gray-800",
        isCancelled
          ? "border-gray-200 dark:border-gray-700 opacity-70"
          : "border-gray-200 dark:border-gray-700",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-semibold truncate">{dogPackage.package.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Comprado el {formatDate(dogPackage.purchaseDate)}
          </p>
        </div>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full font-medium shrink-0",
            STATUS_STYLES[dogPackage.status] ?? "bg-gray-100 text-gray-600",
          )}
        >
          {STATUS_LABELS[dogPackage.status] ?? dogPackage.status}
        </span>
      </div>

      {/* Saldos: por servicio, porque las cantidades son por item */}
      <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-700 pt-3">
        {dogPackage.balances.map((balance) => (
          <div
            key={balance.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="text-gray-600 dark:text-gray-300 truncate">
              {balance.service.name}
              <span className="text-muted-foreground">
                {" "}
                · {daysMaskToShortLabel(balance.daysMask)}
              </span>
            </span>
            <span className="font-medium whitespace-nowrap flex items-center gap-1">
              {balance.remainingQuantity === null ? (
                <>
                  <InfinityIcon className="w-3.5 h-3.5 text-brand-strong" />
                  <span className="text-brand-strong">Ilimitado</span>
                </>
              ) : (
                <span
                  className={
                    balance.remainingQuantity === 0
                      ? "text-amber-600"
                      : "text-brand-strong"
                  }
                >
                  {balance.remainingQuantity} de {balance.initialQuantity}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {(dogPackage.expiryDate || dogPackage.renewalDate) && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
          <CalendarClock className="w-3.5 h-3.5" />
          {dogPackage.renewalDate
            ? `Renueva el ${formatDate(dogPackage.renewalDate)}`
            : `Vence el ${formatDate(dogPackage.expiryDate!)}`}
        </div>
      )}

      {!isCancelled && (
        <div className="flex gap-2 mt-4">
          {alreadyRenewed ? (
            <span className="text-xs text-muted-foreground self-center">
              Ya renovado — el ciclo siguiente es otro paquete
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={renewing}
              onClick={() => onRenew(dogPackage)}
            >
              <RotateCw
                className={cn("w-3.5 h-3.5 mr-1.5", renewing && "animate-spin")}
              />
              Renovar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full text-muted-foreground hover:text-red-600"
            onClick={() => onCancel(dogPackage)}
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
