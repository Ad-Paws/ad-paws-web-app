import { PackageCheck } from "lucide-react";
import { type Service } from "@/lib/api/services.api";
import { SERVICE_TYPE_CONFIG, formatDate, formatPrice } from "../constants";
import type { ServiceType } from "../types";
import type { DateRangeValue } from "@/components/Form";

interface CheckInSummaryProps {
  serviceType: ServiceType;
  selectedService: Service | undefined;
  stayDates?: DateRangeValue;
  selectedAdditionalServices: string[];
  addonServices: Service[];
  /** Valuación completa, como si no hubiera paquete. Null si no hay cotización. */
  total: number | null;
  /** Lo que realmente se cobra, ya descontada la cobertura. Null si no hay cotización. */
  amountDue?: number | null;
  /** Fechas (ISO) que cubre un paquete. La cobertura se decide por fecha. */
  coveredDates?: string[];
  /** Add-ons cubiertos por paquete, por id de servicio. */
  coveredAddOnIds?: string[];
  numberOfNights?: number;
}

export function CheckInSummary({
  serviceType,
  selectedService,
  stayDates,
  selectedAdditionalServices,
  addonServices,
  total,
  amountDue,
  coveredDates = [],
  coveredAddOnIds = [],
  numberOfNights,
}: CheckInSummaryProps) {
  const config = SERVICE_TYPE_CONFIG[serviceType];
  const Icon = config.icon;

  const isHotel = serviceType === "HOTEL";
  const nights = numberOfNights || 0;

  // La cobertura es por fecha, así que una estancia puede estar cubierta a
  // medias: con "noches L–J", un miércoles→domingo son dos noches del paquete
  // y dos en efectivo. Mostrar solo el total en ese caso haría creer que se
  // cobra algo que ya estaba pagado.
  const coveredCount = coveredDates.length + coveredAddOnIds.length;
  const hasCoverage = coveredCount > 0;

  // El importe a cobrar lo muestra CheckInActionBar; aquí solo hace falta
  // cuánto absorbió el paquete para poder mostrarlo junto a las fechas.
  const payable = amountDue ?? total ?? 0;
  const discount = total !== null ? total - payable : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Resumen del Servicio
      </h3>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
        {/* Service Type */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              config.variant === "green"
                ? "bg-green-100 text-green-600"
                : config.variant === "blue"
                ? "bg-blue-100 text-blue-600"
                : config.variant === "amber"
                ? "bg-amber-100 text-amber-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{config.title}</p>
            {selectedService && (
              <p className="text-sm text-gray-500">
                {selectedService.name}
                {isHotel && nights > 0 && (
                  <span>
                    {" "}
                    • {nights} {nights === 1 ? "noche" : "noches"}
                  </span>
                )}
              </p>
            )}
          </div>
          {selectedService && (
            <div className="text-right">
              {isHotel && nights > 0 ? (
                <>
                  <p className="font-semibold">
                    {formatPrice(selectedService.price * nights)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(selectedService.price)} x {nights}
                  </p>
                </>
              ) : (
                <p className="font-semibold">
                  {formatPrice(selectedService.price)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Dates for Hotel */}
        {isHotel && stayDates?.from && stayDates?.to && (
          <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
            <span className="text-gray-500">Fechas</span>
            <span className="font-medium">
              {formatDate(stayDates.from)} - {formatDate(stayDates.to)}
            </span>
          </div>
        )}

        {/* Additional Services */}
        {selectedAdditionalServices.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
            <p className="text-sm text-gray-500">Servicios adicionales</p>
            {selectedAdditionalServices.map((serviceId) => {
              const addon = addonServices.find((s) => s.id === serviceId);
              if (!addon) return null;
              const covered = coveredAddOnIds.includes(serviceId);
              return (
                <div
                  key={serviceId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{addon.name}</span>
                  {covered ? (
                    <span className="font-medium text-brand-strong flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5" />
                      Incluido
                    </span>
                  ) : (
                    <span className="font-medium">
                      {formatPrice(addon.price)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/*
          Cobertura del paquete.
          El importe final ya NO vive aquí: lo muestra la barra fija del pie,
          que está siempre a la vista. Este bloque se queda con lo que la barra
          no puede decir — QUÉ fechas se cubrieron, que es lo que permite
          revisar si la cobertura salió como se esperaba.
        */}
        {hasCoverage && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-brand-strong font-medium">
                <PackageCheck className="w-4 h-4 shrink-0" />
                {coveredDates.length > 0
                  ? `${coveredDates.length} ${
                      isHotel
                        ? coveredDates.length === 1
                          ? "noche cubierta"
                          : "noches cubiertas"
                        : coveredDates.length === 1
                          ? "día cubierto"
                          : "días cubiertos"
                    }`
                  : "Extras cubiertos"}
              </span>
              {discount > 0 && (
                <span className="text-brand-strong whitespace-nowrap">
                  −{formatPrice(discount)}
                </span>
              )}
            </div>
            {coveredDates.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {coveredDates
                  .map((date) => formatDate(new Date(date)))
                  .join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
