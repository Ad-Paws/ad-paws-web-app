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
} from "@/components/Form";
import { type Service } from "@/lib/api/services.api";
import {
  CREATE_RESERVATION_MUTATION,
  CHECK_IN_RESERVATION_MUTATION,
  MARK_RESERVATION_PAID_MUTATION,
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
import { REVENUE_STATS_QUERY } from "@/graphql/operations/stats";

interface DaycareFormProps {
  services: Service[];
  addonServices: Service[];
  dogId: string;
  companyId: number;
  onSuccess: () => void;
  onCancel: () => void;
  onBack: () => void;
}

export function DaycareForm({
  services,
  addonServices,
  dogId,
  onSuccess,
  onCancel,
}: DaycareFormProps) {
  // El servidor calcula los precios (incluidos excepciones y cobertura de
  // paquete); el cliente solo manda servicio, extras y fechas. El walk-in de
  // guardería es crear + check-in inmediato.
  const [createReservation, { loading: isCreating, error: createError }] =
    useMutation(CREATE_RESERVATION_MUTATION, {
      update: evictReservationCache,
    });
  const [checkInReservation, { loading: isCheckingIn, error: checkInError }] =
    useMutation(CHECK_IN_RESERVATION_MUTATION, {
      refetchQueries: [RESERVATIONS_QUERY, REVENUE_STATS_QUERY],
      awaitRefetchQueries: true,
      update: evictReservationCache,
    });
  const [markReservationPaid, { loading: isMarkingPaid }] = useMutation(
    MARK_RESERVATION_PAID_MUTATION,
    { update: evictReservationCache },
  );
  const isSubmitting = isCreating || isCheckingIn || isMarkingPaid;
  const mutationError = createError || checkInError;

  const form = useForm<CheckInFormValues>({
    defaultValues: {
      serviceType: "DAYCARE",
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

  // Get the selected service details
  const selectedService = services.find(
    (s) =>
      s.id === selectedServiceId ||
      (services.length === 1 && s.id === services[0].id),
  );

  // El total lo cotiza el servidor con las mismas reglas del create
  // (excepciones de precio por fecha incluidas). Compra individual: si el
  // perro tuviera paquete, la cobertura se aplica sola al crear.
  const scheduledCheckIn = useMemo(() => new Date().toISOString(), []);
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
          scheduledCheckIn,
        },
      },
      skip: !selectedService || !dogId,
    },
  );
  // `total` es la valuación completa; `amountDue` es lo que se cobra ya
  // descontada la cobertura del paquete, que se decide por fecha.
  // Los CTA se bloquean hasta tener la cotización del servidor: confirmar
  // sin total cotizado permitiría registrar cobros con un importe alterado
  // o desactualizado.
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
    return true;
  };

  const submitWithPayment = (paymentStatus: "PAID" | "UNPAID") => {
    form.handleSubmit(async (data: CheckInFormValues) => {
      const serviceId =
        data.selectedServiceId || (services.length === 1 ? services[0].id : "");
      const service = services.find((s) => s.id === serviceId);

      if (!service || !data.dogId) return;

      try {
        const result = await createReservation({
          variables: {
            input: {
              dogId: data.dogId,
              serviceId: service.id,
              addOnServiceIds: data.additionalServices,
              scheduledCheckIn: new Date().toISOString(),
            },
          },
        });

        const created = result.data?.createReservation;
        if (created) {
          await checkInReservation({ variables: { id: created.id } });
          if (paymentStatus === "PAID") {
            // Cobrado en la terminal externa del negocio; aquí solo se marca
            // para el match con el corte.
            await markReservationPaid({
              variables: { id: created.id, method: "TERMINAL" },
            });
          }
          onSuccess();
        }
      } catch (error) {
        console.error("Error creating reservation:", error);
      }
    })();
  };

  return (
    <Form form={form} onSubmit={() => {}} className="space-y-6 pt-2">
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

      {/* 1. Service Selection - only show if multiple services */}
      {services.length > 1 && (
        <FormField
          name="selectedServiceId"
          rules={{ required: "Por favor selecciona un servicio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">
                Selecciona el servicio
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
                            {service.duration} min • {service.startTime} -{" "}
                            {service.endTime}
                          </p>
                        </div>
                        <p className="font-semibold text-brand-strong">
                          {formatPrice(service.price)}
                        </p>
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
                {services[0].duration} min • {services[0].startTime} -{" "}
                {services[0].endTime}
              </p>
            </div>
            <p className="font-semibold text-brand-strong">
              {formatPrice(services[0].price)}
            </p>
          </div>
        </div>
      )}

      {/* 2. Additional Services (Add-ons) */}
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

      {/* 3. Summary */}
      <CheckInSummary
        serviceType="DAYCARE"
        selectedService={selectedService}
        selectedAdditionalServices={selectedAdditionalServices}
        addonServices={addonServices}
        total={total}
        amountDue={amountDue}
        coveredDates={coveredDates}
        coveredAddOnIds={coveredAddOnIds}
      />

      {/* Actions */}

      {/* Acciones fijas al pie con el importe: en pantallas bajas eran justo
          lo que quedaba fuera de vista. */}
      <CheckInActionBar
        amountDue={amountDue}
        total={total}
        quoteError={quoteError}
      >
        <div className="flex flex-col gap-3">
        <Button
          type="button"
          className="rounded-full bg-[#4D67A3] hover:bg-[#293a5b] text-white"
          disabled={isSubmitting || !isFormValid() || !quoteReady}
          size="lg"
          onClick={() => submitWithPayment("PAID")}
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
            "Pagar y confirmar"
          )}
        </Button>
        <Button
          type="button"
          className="rounded-full"
          disabled={isSubmitting || !isFormValid() || !quoteReady}
          size="lg"
          variant="outline"
          onClick={() => submitWithPayment("UNPAID")}
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
            "Pendiente de pago"
          )}
        </Button>
        </div>

        <Button
          type="button"
          variant="link"
          className="w-full rounded-full h-8"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </CheckInActionBar>
    </Form>
  );
}
