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

interface DaycareFormProps {
  services: Service[];
  addonServices: Service[];
  dogs: Dog[];
  companyId: number;
  onSuccess: (
    reservation: CreateReservationResponse["createReservation"]
  ) => void;
  onCancel: () => void;
}

export function DaycareForm({
  services,
  addonServices,
  dogs,
  companyId,
  onSuccess,
  onCancel,
}: DaycareFormProps) {
  const [createReservation, { loading: isSubmitting, error: mutationError }] =
    useMutation<CreateReservationResponse, CreateReservationVariables>(
      CREATE_RESERVATION
    );

  const form = useForm<CheckInFormValues>({
    defaultValues: {
      serviceType: "DAYCARE",
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

  // Get the selected service details
  const selectedService = services.find(
    (s) =>
      s.id === selectedServiceId ||
      (services.length === 1 && s.id === services[0].id)
  );

  // Calculate total
  const total = useMemo(() => {
    let sum = 0;

    if (selectedService) {
      sum += selectedService.price;
    }

    selectedAdditionalServices.forEach((serviceId) => {
      const addon = addonServices.find((s) => s.id === serviceId);
      if (addon) {
        sum += addon.price;
      }
    });

    return sum;
  }, [selectedService, selectedAdditionalServices, addonServices]);

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
    return true;
  };

  const handleSubmit = async (data: CheckInFormValues) => {
    // Get the actual service (auto-select if only one available)
    const serviceId =
      data.selectedServiceId || (services.length === 1 ? services[0].id : "");
    const service = services.find((s) => s.id === serviceId);

    if (!service || !data.dogId) return;

    // Build reservation items
    const items: ReservationItemCreateInput[] = [];

    // Add main service
    items.push({
      serviceId: Number(service.id),
      name: service.name,
      quantity: 1,
      unitPrice: service.price,
      totalPrice: service.price,
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

      {/* 2. Service Selection - only show if multiple services */}
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
                          ? "border-[#A3C585] bg-[#A3C585]/10"
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
                        <p className="font-semibold text-[#A3C585]">
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
        <div className="p-4 rounded-xl border-2 border-[#A3C585] bg-[#A3C585]/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{services[0].name}</p>
              <p className="text-sm text-gray-500">
                {services[0].duration} min • {services[0].startTime} -{" "}
                {services[0].endTime}
              </p>
            </div>
            <p className="font-semibold text-[#A3C585]">
              {formatPrice(services[0].price)}
            </p>
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

      {/* 4. Summary */}
      <CheckInSummary
        serviceType="DAYCARE"
        selectedService={selectedService}
        selectedAdditionalServices={selectedAdditionalServices}
        addonServices={addonServices}
        total={total}
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
            "Confirmar Check-in"
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
