import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDateRangePicker,
} from "@/components/Form";
import { type Service } from "@/lib/api/services.api";
import {
  CREATE_RESERVATION_MUTATION,
  QUOTE_RESERVATION_QUERY,
  RESERVATIONS_QUERY,
} from "@/graphql/operations/reservations";
import { evictReservationCache } from "@/graphql/cache";
import { formatPrice } from "../constants";
import {
  ActivePackageBanner,
  CheckInActionBar,
  CheckInSummary,
} from "../components";
import { useQuoteBreakdown } from "../hooks/useQuoteBreakdown";
import type { CheckInFormValues } from "../types";

interface HotelFormProps {
  services: Service[];
  addonServices: Service[];
  dogId: string;
  companyId: number;
  onSuccess: () => void;
  onCancel: () => void;
  onBack: () => void;
}

export function HotelForm({
  services,
  addonServices,
  dogId,
  onSuccess,
  onCancel,
  onBack,
}: HotelFormProps) {
  // El servidor calcula noches y precios (excepciones y paquetes incluidos);
  // el cliente solo manda servicio, extras y fechas.
  const [createReservation, { loading: isSubmitting, error: mutationError }] =
    useMutation(CREATE_RESERVATION_MUTATION, {
      // Nace PENDING: aparece en "Por llegar", que puede no ser la pestaña
      // montada, así que no basta con refrescar la activa.
      refetchQueries: [RESERVATIONS_QUERY],
      awaitRefetchQueries: true,
      update: evictReservationCache,
    });

  const form = useForm<CheckInFormValues>({
    defaultValues: {
      serviceType: "HOTEL",
      selectedServiceId: services.length === 1 ? services[0].id : "",
      stayDates: { from: undefined, to: undefined },
      additionalServices: [],
      dogId: dogId,
    },
    mode: "onChange",
  });

  const selectedServiceId = useWatch({
    control: form.control,
    name: "selectedServiceId",
  });

  const selectedAdditionalServices = useWatch({
    control: form.control,
    name: "additionalServices",
  });

  const stayDates = useWatch({
    control: form.control,
    name: "stayDates",
  });

  // Get the selected service details
  const selectedService = services.find(
    (s) =>
      s.id === selectedServiceId ||
      (services.length === 1 && s.id === services[0].id),
  );

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!stayDates?.from || !stayDates?.to) return 0;
    const diffTime = stayDates.to.getTime() - stayDates.from.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [stayDates]);

  // El total lo cotiza el servidor con las mismas reglas del create: noches
  // (la fecha de salida no es noche), excepciones de precio por fecha, etc.
  // Compra individual: si el perro tuviera paquete, se aplica solo al crear.
  const {
    data: quoteData,
    loading: quoteLoading,
    error: quoteQueryError,
  } = useQuery(
    QUOTE_RESERVATION_QUERY,
    {
      variables: {
        input: {
          dogId,
          serviceId: selectedService?.id ?? "",
          addOnServiceIds: selectedAdditionalServices,
          scheduledCheckIn: stayDates?.from?.toISOString() ?? "",
          scheduledCheckOut: stayDates?.to?.toISOString(),
        },
      },
      skip: !selectedService || !dogId || !stayDates?.from || !stayDates?.to,
    },
  );
  // `total` es la valuación completa; `amountDue` es lo que se cobra ya
  // descontada la cobertura del paquete, que se decide por fecha.
  // El CTA se bloquea hasta tener la cotización del servidor: confirmar sin
  // total cotizado permitiría registrar un importe alterado o desactualizado.
  const {
    total,
    amountDue,
    coveredDates,
    coveredAddOnIds,
    quoteReady,
    quoteError,
  } =
    useQuoteBreakdown(quoteData, quoteLoading, quoteQueryError);

  const toggleAdditionalService = (
    serviceId: string,
    currentServices: string[],
  ) => {
    if (currentServices.includes(serviceId)) {
      return currentServices.filter((id) => id !== serviceId);
    }
    return [...currentServices, serviceId];
  };

  const isFormValid = () => {
    if (services.length > 1 && !selectedServiceId) return false;
    if (!stayDates?.from || !stayDates?.to) return false;
    return true;
  };

  const handleSubmit = async (data: CheckInFormValues) => {
    // Get the actual service (auto-select if only one available)
    const serviceId =
      data.selectedServiceId || (services.length === 1 ? services[0].id : "");
    const service = services.find((s) => s.id === serviceId);

    if (!service || !data.dogId || !data.stayDates?.from || !data.stayDates?.to)
      return;

    try {
      const result = await createReservation({
        variables: {
          input: {
            dogId: data.dogId,
            serviceId: service.id,
            addOnServiceIds: data.additionalServices,
            scheduledCheckIn: data.stayDates.from.toISOString(),
            scheduledCheckOut: data.stayDates.to.toISOString(),
          },
        },
      });

      if (result.data?.createReservation) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-6 pt-2">
      {/* Mutation Error */}
      {mutationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Error al crear la reservación. Por favor intenta de nuevo.
          </span>
        </div>
      )}

      {/* Saberlo ANTES de elegir fechas es lo que permite decidir: "las
          noches son L–J, el viernes se cobra". Se filtra a los servicios de
          este paso para no anunciar saldo que no aplica. */}
      <ActivePackageBanner
        dogId={dogId}
        serviceIds={[
          ...services.map((s) => s.id),
          ...addonServices.map((s) => s.id),
        ]}
      />

      {/* 1. Date Range Selection */}
      <FormField<CheckInFormValues, "stayDates">
        name="stayDates"
        rules={{
          validate: (value) => {
            if (!value?.from || !value?.to) {
              return "Selecciona las fechas de entrada y salida";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-muted-foreground">
              Fechas de estancia
            </FormLabel>
            <FormControl>
              <FormDateRangePicker
                placeholder="Selecciona check-in y check-out"
                placeholderTo="Check-out"
                value={field.value}
                onChange={field.onChange}
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                numberOfMonths={2}
              />
            </FormControl>
            {numberOfNights > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {numberOfNights} {numberOfNights === 1 ? "noche" : "noches"}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 2. Service Selection - only show if multiple services */}
      {services.length > 1 && (
        <FormField
          name="selectedServiceId"
          rules={{ required: "Por favor selecciona un servicio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">
                Selecciona el tipo de hospedaje
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => field.onChange(service.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        field.value === service.id
                          ? "border-brand-border bg-brand-tint"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            Check-in: {service.startTime} • Check-out:{" "}
                            {service.endTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-strong">
                            {formatPrice(service.price)}
                          </p>
                          <p className="text-xs text-gray-500">por noche</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Auto-selected service display for single service */}
      {services.length === 1 && (
        <div className="p-4 rounded-xl border-2 border-brand-border bg-brand-tint">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{services[0].name}</p>
              <p className="text-sm text-gray-500">
                Check-in: {services[0].startTime} • Check-out:{" "}
                {services[0].endTime}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-brand-strong">
                {formatPrice(services[0].price)}
              </p>
              <p className="text-xs text-gray-500">por noche</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Additional Services (Add-ons) */}
      {addonServices.length > 0 && (
        <FormField
          name="additionalServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">
                Servicios Adicionales
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {addonServices.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        field.value.includes(addon.id)
                          ? "border-brand-border bg-brand-tint"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Checkbox
                        checked={field.value.includes(addon.id)}
                        onCheckedChange={() =>
                          field.onChange(
                            toggleAdditionalService(addon.id, field.value),
                          )
                        }
                        className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-brand-strong" />
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {addon.duration > 0
                            ? `${addon.duration} min`
                            : `${addon.startTime} - ${addon.endTime}`}
                        </p>
                      </div>
                      <span className="font-semibold text-brand-strong">
                        +{formatPrice(addon.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* 4. Summary */}
      <CheckInSummary
        serviceType="HOTEL"
        selectedService={selectedService}
        stayDates={stayDates}
        selectedAdditionalServices={selectedAdditionalServices}
        addonServices={addonServices}
        total={total}
        amountDue={amountDue}
        coveredDates={coveredDates}
        coveredAddOnIds={coveredAddOnIds}
        numberOfNights={numberOfNights}
      />

      {/* Acciones: fijas al pie junto con el importe, para que ni el precio
          ni el botón queden bajo el pliegue en pantallas bajas. */}
      <CheckInActionBar
        amountDue={amountDue}
        total={total}
        quoteError={quoteError}
      >
        <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full"
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-full bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
          disabled={isSubmitting || !isFormValid() || !quoteReady}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Procesando...
            </>
          ) : quoteLoading ? (
            <>
              <Spinner /> Cotizando...
            </>
          ) : (
            "Confirmar Reservación"
          )}
          </Button>
        </div>
        <Button
          type="button"
          variant="link"
          className="w-full rounded-full h-8 mt-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </CheckInActionBar>
    </Form>
  );
}
