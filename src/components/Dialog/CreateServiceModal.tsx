import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { Check, Info, DollarSign, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormSelect,
} from "@/components/Form";
import {
  CREATE_SERVICE,
  type ServiceType,
  type ServiceCategory,
  type PricingUnit,
  type Service,
  SERVICES_BY_COMPANY_AND_TYPE,
} from "@/lib/api/services.api";
import { cn } from "@/lib/utils";

// Form values type
interface CreateServiceFormValues {
  name: string;
  type: ServiceType;
  category: ServiceCategory;
  companyId: number;
  price: number;
  pricingUnit: PricingUnit;
  duration: number;
  startTime: string;
  endTime: string;
  daysAvailable: string[];
}

// Opciones de tipo de servicio
const SERVICE_TYPE_OPTIONS = [
  { value: "HOTEL", label: "Hotel / Estancias" },
  { value: "DAYCARE", label: "Guardería" },
  { value: "GROOMING", label: "Estética" },
  { value: "TRAINING", label: "Entrenamiento" },
];

// Opciones de categoría de servicio
const SERVICE_CATEGORY_OPTIONS = [
  { value: "MAIN", label: "Servicio Principal" },
  { value: "ADDON", label: "Servicio Adicional (Add-on)" },
];

// Opciones de unidad de precio
const PRICING_UNIT_OPTIONS = [
  { value: "HOURLY", label: "Por hora" },
  { value: "DAILY", label: "Por día" },
  { value: "NIGHTLY", label: "Por noche" },
  { value: "SESSION", label: "Por sesión" },
  { value: "PACKAGE", label: "Paquete" },
];

// Días de la semana
const DAYS_OF_WEEK = [
  { value: "Monday", label: "Lun" },
  { value: "Tuesday", label: "Mar" },
  { value: "Wednesday", label: "Mié" },
  { value: "Thursday", label: "Jue" },
  { value: "Friday", label: "Vie" },
  { value: "Saturday", label: "Sáb" },
  { value: "Sunday", label: "Dom" },
];

export interface CreateServiceModalProps {
  companyId: number;
  onSuccess?: (service: Service) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(
  ({ companyId, onSuccess }: CreateServiceModalProps) => {
    const modal = useModal();

    const [createService, { loading: isSubmitting, error: mutationError }] =
      useMutation<{ createService: Service }>(CREATE_SERVICE);

    const form = useForm<CreateServiceFormValues>({
      defaultValues: {
        name: "",
        type: "" as ServiceType,
        category: "MAIN" as ServiceCategory,
        companyId: companyId,
        price: 0,
        pricingUnit: "" as PricingUnit,
        duration: 8,
        startTime: "",
        endTime: "",
        daysAvailable: [],
      },
      mode: "onChange",
    });

    const handleSubmit = async (data: CreateServiceFormValues) => {
      try {
        const result = await createService({
          variables: {
            input: {
              name: data.name,
              type: data.type,
              category: data.category,
              companyId: data.companyId,
              price: Number(data.price),
              pricingUnit: data.pricingUnit,
              duration: Number(data.duration),
              startTime: data.startTime,
              endTime: data.endTime,
              daysAvailable: data.daysAvailable,
            },
          },
          refetchQueries: [
            {
              query: SERVICES_BY_COMPANY_AND_TYPE,
              variables: { type: data.type, companyId: data.companyId },
            },
          ],
        });

        if (result.data?.createService) {
          onSuccess?.(result.data.createService);
          modal.hide();
          form.reset();
        }
      } catch (error) {
        console.error("Error creating service:", error);
      }
    };

    const handleCancel = () => {
      modal.hide();
      form.reset();
    };

    const toggleDay = (day: string, currentDays: string[]) => {
      if (currentDays.includes(day)) {
        return currentDays.filter((d) => d !== day);
      }
      return [...currentDays, day];
    };

    return (
      <Dialog open={modal.visible} onOpenChange={handleCancel}>
        <DialogContent
          className="bg-white dark:bg-gray-800 sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Crear Nuevo Servicio
            </DialogTitle>
          </DialogHeader>

          <Form form={form} onSubmit={handleSubmit} className="space-y-6">
            {/* Mutation Error */}
            {mutationError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Error al crear el servicio. Por favor intenta de nuevo.
                </span>
              </div>
            )}

            {/* Sección de Información Básica */}
            <div className="bg-amber-50/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-4">
                <Info className="w-5 h-5" />
                <span className="uppercase text-sm tracking-wide">
                  Información Básica
                </span>
              </div>

              {/* Nombre del Servicio */}
              <FormField
                name="name"
                rules={{ required: "El nombre del servicio es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre del Servicio{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Guardería, Suite de Lujo, Baño Completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Servicio y Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="type"
                  rules={{ required: "Selecciona un tipo de servicio" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipo de Servicio <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <FormSelect
                          placeholder="Selecciona tipo..."
                          options={SERVICE_TYPE_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="category"
                  rules={{ required: "Selecciona una categoría" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Categoría <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <FormSelect
                          placeholder="Selecciona categoría..."
                          options={SERVICE_CATEGORY_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Detalles de Precio */}
            <div className="bg-green-50/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-medium mb-4">
                <DollarSign className="w-5 h-5" />
                <span className="uppercase text-sm tracking-wide">
                  Detalles de Precio
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Precio */}
                <FormField
                  name="price"
                  rules={{
                    required: "El precio es requerido",
                    min: { value: 0, message: "El precio debe ser mayor a 0" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Precio <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Unidad de Precio */}
                <FormField
                  name="pricingUnit"
                  rules={{ required: "Selecciona una unidad de precio" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Unidad de Precio <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <FormSelect
                          placeholder="Selecciona unidad..."
                          options={PRICING_UNIT_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Horario y Duración */}
            <div className="bg-yellow-50/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-yellow-700 font-medium mb-4">
                <Clock className="w-5 h-5" />
                <span className="uppercase text-sm tracking-wide">
                  Horario y Duración
                </span>
              </div>

              {/* Fila de Horario y Duración */}
              <div className="grid grid-cols-3 gap-4">
                {/* Hora de Inicio */}
                <FormField
                  name="startTime"
                  rules={{ required: "La hora de inicio es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hora de Inicio <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hora de Fin */}
                <FormField
                  name="endTime"
                  rules={{ required: "La hora de fin es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hora de Fin <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duración */}
                <FormField
                  name="duration"
                  rules={{
                    required: "La duración es requerida",
                    min: { value: 1, message: "Mínimo 1 hora" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Duración (horas) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Días Disponibles */}
              <FormField
                name="daysAvailable"
                rules={{
                  validate: (value) =>
                    value.length > 0 || "Selecciona al menos un día",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Días Disponibles <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2 flex-wrap">
                        {DAYS_OF_WEEK.map((day) => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() =>
                              field.onChange(toggleDay(day.value, field.value))
                            }
                            className={cn(
                              "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                              field.value.includes(day.value)
                                ? "border-[#A3C585] bg-[#A3C585]/20 text-[#5D7A3A]"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            )}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pie del Modal */}
            <DialogFooter className="gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-full px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" /> Creando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Crear Servicio
                  </>
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
