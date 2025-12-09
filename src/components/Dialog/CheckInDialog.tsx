import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm, useWatch } from "react-hook-form";
import {
  BedDoubleIcon,
  SunIcon,
  GraduationCapIcon,
  ScissorsIcon,
  WavesIcon,
  // SparklesIcon,
  // CameraIcon,
  // UtensilsIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDateRangePicker,
  FormServiceTypeCard,
  FormAdditionalServiceItem,
  type ServiceTypeVariant,
  type ServiceItemVariant,
  type DateRangeValue,
} from "../Form";

type ServiceType = "overnight" | "daycare" | "training" | "grooming";

interface CheckInFormValues {
  serviceType: ServiceType | "";
  stayDates: DateRangeValue;
  additionalServices: string[];
}

interface ServiceTypeOption {
  id: ServiceType;
  icon: typeof BedDoubleIcon;
  title: string;
  description: string;
  variant: ServiceTypeVariant;
}

interface AdditionalService {
  id: string;
  icon: typeof WavesIcon;
  title: string;
  description: string;
  price?: string;
  variant: ServiceItemVariant;
}

const serviceTypes: ServiceTypeOption[] = [
  {
    id: "overnight",
    icon: BedDoubleIcon,
    title: "Hospedaje",
    description: "Alojamiento y cuidado nocturno",
    variant: "green",
  },
  {
    id: "daycare",
    icon: SunIcon,
    title: "Guardería",
    description: "Supervisión y juego diario",
    variant: "blue",
  },
  {
    id: "training",
    icon: GraduationCapIcon,
    title: "Entrenamiento",
    description: "Sesiones profesionales",
    variant: "amber",
  },
  {
    id: "grooming",
    icon: ScissorsIcon,
    title: "Estética",
    description: "Spa y servicios de estilismo",
    variant: "rose",
  },
];

const additionalServices: AdditionalService[] = [
  {
    id: "swimming",
    icon: WavesIcon,
    title: "Sesión de Natación",
    description: "30 min de actividad en alberca",
    price: "$25",
    variant: "blue",
  },
  // {
  //   id: "spa",
  //   icon: SparklesIcon,
  //   title: "Tratamiento de Spa",
  //   description: "Baño, masaje y cuidados",
  //   price: "$35",
  //   variant: "green",
  // },
  // {
  //   id: "photo",
  //   icon: CameraIcon,
  //   title: "Sesión de Fotos",
  //   description: "Fotografía profesional de mascotas",
  //   price: "$20",
  //   variant: "orange",
  // },
  // {
  //   id: "meals",
  //   icon: UtensilsIcon,
  //   title: "Comidas Premium",
  //   description: "Mejora a comida gourmet",
  //   price: "$15/día",
  //   variant: "red",
  // },
];

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(() => {
  const modal = useModal();

  const form = useForm<CheckInFormValues>({
    defaultValues: {
      serviceType: "",
      stayDates: { from: undefined, to: undefined },
      additionalServices: [],
    },
    mode: "onChange",
  });

  const serviceType = useWatch({
    control: form.control,
    name: "serviceType",
  });

  const handleCancel = () => {
    modal.hide();
    form.reset();
  };

  const onSubmit = (data: CheckInFormValues) => {
    console.log("Form submitted:", data);
    // Handle form submission here
    modal.hide();
    form.reset();
  };

  const toggleAdditionalService = (
    serviceId: string,
    currentServices: string[]
  ) => {
    if (currentServices.includes(serviceId)) {
      return currentServices.filter((id) => id !== serviceId);
    }
    return [...currentServices, serviceId];
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      <DialogContent
        className="bg-white dark:bg-gray-800 max-w-xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nuevo Check-in
          </DialogTitle>
        </DialogHeader>

        <Form form={form} onSubmit={onSubmit} className="space-y-6 pt-2">
          {/* Service Type Selection */}
          <FormField
            name="serviceType"
            rules={{ required: "Por favor selecciona un tipo de servicio" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Selecciona el tipo de servicio
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceTypes.map((service) => (
                      <FormServiceTypeCard
                        key={service.id}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        variant={service.variant}
                        value={service.id}
                        selectedValue={field.value}
                        onSelect={field.onChange}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Selection */}
          {serviceType === "overnight" && (
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
                    Selecciona las fechas de estancia
                  </FormLabel>
                  <FormControl>
                    <FormDateRangePicker
                      placeholder="Selecciona las fechas"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={new Date()}
                      numberOfMonths={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Additional Services */}
          <FormField
            name="additionalServices"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Servicios Adicionales
                </FormLabel>
                <FormControl>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {additionalServices.map((service) => (
                      <FormAdditionalServiceItem
                        key={service.id}
                        id={service.id}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        price={service.price || ""}
                        variant={service.variant}
                        checked={field.value.includes(service.id)}
                        onCheckedChange={() =>
                          field.onChange(
                            toggleAdditionalService(service.id, field.value)
                          )
                        }
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2 flex-col">
            <Button
              type="submit"
              className="flex-1 rounded-full bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner /> Procesando...
                </>
              ) : (
                "Continuar"
              )}
            </Button>
            <Button
              type="button"
              variant="link"
              className="flex-1 rounded-full"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
