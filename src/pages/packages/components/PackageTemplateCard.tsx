import { Ban, Infinity as InfinityIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { daysMaskToShortLabel, moneyToNumber } from "@/utils/adapters";
import type { PackagesQuery } from "@/gql/graphql";

type PackageTemplate = PackagesQuery["packages"][number];

const BILLING_CYCLE_LABELS: Record<string, string> = {
  WEEKLY: "semanal",
  MONTHLY: "mensual",
  QUARTERLY: "trimestral",
  YEARLY: "anual",
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(value);

interface PackageTemplateCardProps {
  template: PackageTemplate;
  onSell: (template: PackageTemplate) => void;
  onDeactivate: (template: PackageTemplate) => void;
}

/**
 * Una plantilla del catálogo.
 *
 * Lo que se lista por renglón es el entitlement REAL — cupo o ilimitado y los
 * días que cubre — porque es lo que determina qué se cobra. `type` se muestra
 * apenas como etiqueta: un paquete "QUANTITY" puede contener un servicio
 * ilimitado, así que anunciarlo como el resumen del paquete sería engañoso.
 */
export function PackageTemplateCard({
  template,
  onSell,
  onDeactivate,
}: PackageTemplateCardProps) {
  return (
    <div className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="font-semibold truncate">{template.name}</p>
          {template.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {template.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {template.billingCycle
              ? `Suscripción ${BILLING_CYCLE_LABELS[template.billingCycle] ?? ""}`
              : template.validityDays
                ? `Vigencia ${template.validityDays} días`
                : "Sin vencimiento"}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-lg text-brand-strong">
            {formatPrice(moneyToNumber(template.price))}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-700 pt-3">
        {template.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="text-gray-600 dark:text-gray-300 truncate">
              {item.service.name}
              <span className="text-muted-foreground">
                {" "}
                · {daysMaskToShortLabel(item.daysMask)}
              </span>
            </span>
            <span className="font-medium whitespace-nowrap flex items-center gap-1">
              {item.quantity === null ? (
                <>
                  <InfinityIcon className="w-3.5 h-3.5 text-brand-strong" />
                  <span className="text-brand-strong">Ilimitado</span>
                </>
              ) : (
                `${item.quantity} sesiones`
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="rounded-full bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
          onClick={() => onSell(template)}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Vender
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-muted-foreground"
          onClick={() => onDeactivate(template)}
        >
          <Ban className="w-3.5 h-3.5 mr-1.5" />
          Desactivar
        </Button>
      </div>
    </div>
  );
}
