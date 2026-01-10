import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
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
  CREATE_RESERVATION,
  type CreateReservationResponse,
  type CreateReservationVariables,
  type ReservationItemCreateInput,
} from "@/lib/api/reservations.api";
import { formatPrice } from "../constants";
import { CheckInSummary, DogSelector } from "../components";
import type { Dog, CheckInFormValues } from "../types";

interface HotelFormProps {
  services: Service[];
  addonServices: Service[];
  dogs: Dog[];
  companyId: number;
  onSuccess: (
    reservation: CreateReservationResponse["createReservation"]
  ) => void;
  onCancel: () => void;
}

export function HotelForm({
  services,
  addonServices,
  dogs,
  companyId,
  onSuccess,
  onCancel,
}: HotelFormProps) {
  const [createReservation, { loading: isSubmitting, error: mutationError }] =
    useMutation<CreateReservationResponse, CreateReservationVariables>(
      CREATE_RESERVATION
    );

  const form = useForm<CheckInFormValues>({
    defaultValues: {
      serviceType: "HOTEL",
      selectedServiceId: services.length === 1 ? services[0].id : "",
      stayDates: { from: undefined, to: undefined },
      additionalServices: [],
      dogId: "",
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

  const selectedDogId = useWatch({
    control: form.control,
    name: "dogId",
  });

  const stayDates = useWatch({
    control: form.control,
    name: "stayDates",
  });

  // Get the selected service details
  const selectedService = services.find(
    (s) =>
      s.id === selectedServiceId ||
      (services.length === 1 && s.id === services[0].id)
  );

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!stayDates?.from || !stayDates?.to) return 0;
    const diffTime = stayDates.to.getTime() - stayDates.from.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [stayDates]);

  // Calculate total
  const total = useMemo(() => {
    let sum = 0;

    if (selectedService && numberOfNights > 0) {
      sum += selectedService.price * numberOfNights;
    }

    selectedAdditionalServices.forEach((serviceId) => {
      const addon = addonServices.find((s) => s.id === serviceId);
      if (addon) {
        sum += addon.price;
      }
    });

    return sum;
  }, [selectedService, numberOfNights, selectedAdditionalServices, addonServices]);

  const toggleAdditionalService = (
    serviceId: string,
    currentServices: string[]
  ) => {
    if (currentServices.includes(serviceId)) {
      return currentServices.filter((id) => id !== serviceId);
    }
    return [...currentServices, serviceId];
  };

  const isFormValid = () => {
    if (services.length > 1 && !selectedServiceId) return false;
    if (!selectedDogId) return false;
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

    // Calculate nights for pricing
    const nights = Math.ceil(
      (data.stayDates.to.getTime() - data.stayDates.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Build reservation items
    const items: ReservationItemCreateInput[] = [];

    // Add main service (price per night * number of nights)
    items.push({
      serviceId: Number(service.id),
      name: `${service.name} (${nights} ${nights === 1 ? "noche" : "noches"})`,
      quantity: nights,
      unitPrice: service.price,
      totalPrice: service.price * nights,
      kind: "MAIN",
    });

    // Add additional services as ADDONs
    data.additionalServices.forEach((additionalServiceId) => {
      const addon = addonServices.find((s) => s.id === additionalServiceId);
      if (addon) {
        items.push({
          serviceId: Number(addon.id),
          name: addon.name,
          quantity: 1,
          unitPrice: addon.price,
          totalPrice: addon.price,
          kind: "ADDON",
        });
      }
    });

    try {
      const result = await createReservation({
        variables: {
          dogId: Number(data.dogId),
          companyId,
          items,
          checkIn: data.stayDates.from.toISOString(),
          checkOut: data.stayDates.to.toISOString(),
        },
      });

      if (result.data?.createReservation) {
        onSuccess(result.data.createReservation);
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

      {/* 1. Dog Selection - First step after service type */}
      <FormField
        name="dogId"
        rules={{ required: "Por favor selecciona un perro" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-muted-foreground">
              Selecciona el perro
            </FormLabel>
            <FormControl>
              {dogs.length > 0 ? (
                <DogSelector
                  dogs={dogs}
                  selectedDogId={field.value}
                  onSelect={field.onChange}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center bg-amber-50 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                  <p className="text-sm text-gray-600">
                    No hay perros registrados. Por favor registra un perro
                    primero.
                  </p>
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 2. Date Range Selection */}
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
                minDate={new Date()}
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

      {/* 3. Service Selection - only show if multiple services */}
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
                          ? "border-[#A3C585] bg-[#A3C585]/10"
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
                          <p className="font-semibold text-[#A3C585]">
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
        <div className="p-4 rounded-xl border-2 border-[#A3C585] bg-[#A3C585]/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{services[0].name}</p>
              <p className="text-sm text-gray-500">
                Check-in: {services[0].startTime} • Check-out:{" "}
                {services[0].endTime}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#A3C585]">
                {formatPrice(services[0].price)}
              </p>
              <p className="text-xs text-gray-500">por noche</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Additional Services (Add-ons) */}
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
                          ? "border-[#A3C585] bg-[#A3C585]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Checkbox
                        checked={field.value.includes(addon.id)}
                        onCheckedChange={() =>
                          field.onChange(
                            toggleAdditionalService(addon.id, field.value)
                          )
                        }
                        className="data-[state=checked]:bg-[#A3C585] data-[state=checked]:border-[#A3C585]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#A3C585]" />
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {addon.duration > 0
                            ? `${addon.duration} min`
                            : `${addon.startTime} - ${addon.endTime}`}
                        </p>
                      </div>
                      <span className="font-semibold text-[#A3C585]">
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

      {/* 5. Summary */}
      <CheckInSummary
        serviceType="HOTEL"
        selectedService={selectedService}
        stayDates={stayDates}
        selectedAdditionalServices={selectedAdditionalServices}
        addonServices={addonServices}
        total={total}
        numberOfNights={numberOfNights}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2 flex-col">
        <Button
          type="submit"
          className="flex-1 rounded-full bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Procesando...
            </>
          ) : (
            "Confirmar Reservación"
          )}
        </Button>
        <Button
          type="button"
          variant="link"
          className="flex-1 rounded-full"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </Form>
  );
}
