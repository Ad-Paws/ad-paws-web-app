import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, PackageCheck, Sparkles } from "lucide-react";
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
import { REVENUE_STATS_QUERY } from "@/graphql/operations/stats";
import { evictReservationCache } from "@/graphql/cache";
import { formatPrice } from "../constants";
import { ActivePackageBanner, CheckInActionBar } from "../components";
import { useQuoteBreakdown } from "../hooks/useQuoteBreakdown";

interface ExtrasFormValues {
  selectedExtras: string[];
  dogId: string;
}

interface ExtrasFormProps {
  /** Servicios sueltos (categoría ADDON) de cualquier tipo. */
  services: Service[];
  dogId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBack: () => void;
}

/**
 * Extras sin estancia: baño, corte, sesión de entrenamiento, etc.
 * El primer extra seleccionado viaja como servicio principal y el resto como
 * add-ons — para el backend un ADDON activo es reservable como cualquier
 * servicio. Walk-in: crear + check-in inmediato, cobro opcional (terminal
 * externa). El total lo cotiza el servidor.
 */
export function ExtrasForm({
  services,
  dogId,
  onSuccess,
  onCancel,
}: ExtrasFormProps) {
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

  const form = useForm<ExtrasFormValues>({
    defaultValues: { selectedExtras: [], dogId },
    mode: "onChange",
  });

  const selectedExtras = useWatch({
    control: form.control,
    name: "selectedExtras",
  });

  const scheduledCheckIn = useMemo(() => new Date().toISOString(), []);
  const [mainServiceId, ...addOnServiceIds] = selectedExtras;

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
          serviceId: mainServiceId ?? "",
          addOnServiceIds,
          scheduledCheckIn,
        },
      },
      skip: !mainServiceId || !dogId,
    },
  );
  // `total` es la valuación completa; `amountDue` descuenta lo que cubre un
  // paquete (aquí típicamente un grooming o natación incluidos).
  // Los CTA se bloquean hasta tener la cotización del servidor: confirmar
  // sin total cotizado permitiría registrar un importe alterado.
  const {
    total,
    amountDue,
    coveredDates,
    coveredAddOnIds,
    quoteReady,
    quoteError,
  } =
    useQuoteBreakdown(quoteData, quoteLoading, quoteQueryError);
  const coveredCount = coveredDates.length + coveredAddOnIds.length;

  const toggleExtra = (serviceId: string, current: string[]) =>
    current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId];

  const submitWithPayment = (paymentStatus: "PAID" | "UNPAID") => {
    form.handleSubmit(async (data: ExtrasFormValues) => {
      const [serviceId, ...addOns] = data.selectedExtras;
      if (!serviceId || !data.dogId) return;

      try {
        const result = await createReservation({
          variables: {
            input: {
              dogId: data.dogId,
              serviceId,
              addOnServiceIds: addOns,
              scheduledCheckIn: new Date().toISOString(),
            },
          },
        });

        const created = result.data?.createReservation;
        if (created) {
          await checkInReservation({ variables: { id: created.id } });
          if (paymentStatus === "PAID") {
            // Cobrado en la terminal externa; aquí solo se marca el match.
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
      {mutationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Error al crear la reservación. Por favor intenta de nuevo.
          </span>
        </div>
      )}

      {/* Solo saldo de los extras que se ofrecen aquí: un paquete de noches
          de hotel no cubre una alberca y anunciarlo confundía. */}
      <ActivePackageBanner
        dogId={dogId}
        serviceIds={services.map((s) => s.id)}
      />

      <FormField
        name="selectedExtras"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-muted-foreground">
              Selecciona los extras
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      field.value.includes(service.id)
                        ? "border-brand-border bg-brand-tint"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Checkbox
                      checked={field.value.includes(service.id)}
                      onCheckedChange={() =>
                        field.onChange(toggleExtra(service.id, field.value))
                      }
                      className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-strong" />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {service.duration > 0
                          ? `${service.duration} min`
                          : `${service.startTime} - ${service.endTime}`}
                      </p>
                    </div>
                    <span className="font-semibold text-brand-strong">
                      {formatPrice(service.price)}
                    </span>
                  </label>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Total cotizado por el servidor */}
      {selectedExtras.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          {quoteError ? (
            // Nunca renderizar 0 cuando la cotización falló: se cobraría de
            // menos creyendo que el paquete lo cubre.
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No se pudo cotizar</p>
                <p className="text-xs mt-0.5">{quoteError}</p>
              </div>
            </div>
          ) : total === null || amountDue === null ? (
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-sm text-muted-foreground">Cotizando…</span>
            </div>
          ) : (
            <>
              {total - amountDue > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-brand-strong mb-1">
                    <span className="flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5" />
                      Cubierto por paquete
                      {coveredCount > 0 && ` (${coveredCount})`}
                    </span>
                    <span>−{formatPrice(total - amountDue)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {total - amountDue > 0 ? "A cobrar" : "Total"}
                </span>
                <span className="text-lg font-bold text-brand-strong">
                  {formatPrice(amountDue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Calculado por el servidor con los precios vigentes de hoy.
              </p>
            </>
          )}
        </div>
      )}

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
          disabled={isSubmitting || selectedExtras.length === 0 || !quoteReady}
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
          disabled={isSubmitting || selectedExtras.length === 0 || !quoteReady}
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
