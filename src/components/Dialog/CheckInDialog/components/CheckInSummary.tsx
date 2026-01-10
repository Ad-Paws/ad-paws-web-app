import { type Service } from "@/lib/api/services.api";
import { SERVICE_TYPE_CONFIG, formatDate, formatPrice } from "../constants";
import type { ServiceType, DateRangeValue } from "../types";

interface CheckInSummaryProps {
  serviceType: ServiceType;
  selectedService: Service | undefined;
  stayDates?: DateRangeValue;
  selectedAdditionalServices: string[];
  addonServices: Service[];
  total: number;
  numberOfNights?: number;
}

export function CheckInSummary({
  serviceType,
  selectedService,
  stayDates,
  selectedAdditionalServices,
  addonServices,
  total,
  numberOfNights,
}: CheckInSummaryProps) {
  const config = SERVICE_TYPE_CONFIG[serviceType];
  const Icon = config.icon;

  const isHotel = serviceType === "HOTEL";
  const nights = numberOfNights || 0;

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
              return (
                <div
                  key={serviceId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{addon.name}</span>
                  <span className="font-medium">{formatPrice(addon.price)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Total */}
        <div className="border-t-2 border-gray-300 dark:border-gray-500 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl text-[#A3C585]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
