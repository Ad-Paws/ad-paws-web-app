import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, Check, Info, Plus, Trash2 } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
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
  CREATE_PACKAGE_MUTATION,
  PACKAGES_QUERY,
} from "@/graphql/operations/packages";
import { SERVICES_QUERY } from "@/graphql/operations/services";
import { dayValuesToDaysMask } from "@/utils/adapters";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/**
 * Alta de plantilla de paquete.
 *
 * La forma del formulario sigue la del dominio: **las cantidades son por
 * servicio, no por paquete**. Un paquete puede incluir "guardería L–V con cupo
 * de 20" junto a "noches ilimitadas L–J", así que cada renglón tiene su propio
 * cupo y sus propios días. `type` es solo la etiqueta comercial.
 *
 * Las reglas que el backend rechaza se validan aquí también, para que el
 * usuario no descubra el problema con un error de servidor.
 */

type PackageType = "QUANTITY" | "UNLIMITED" | "SUBSCRIPTION";
type BillingCycle = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

interface PackageItemFormValue {
  serviceId: string;
  /** Vacío = ilimitado. Se manda como null. */
  quantity: string;
  daysAvailable: string[];
}

interface CreatePackageFormValues {
  name: string;
  description: string;
  price: number;
  type: PackageType;
  validityDays: string;
  billingCycle: BillingCycle | "";
  items: PackageItemFormValue[];
}

const PACKAGE_TYPE_OPTIONS = [
  { value: "QUANTITY", label: "Por cantidad — cupo fijo de sesiones" },
  { value: "UNLIMITED", label: "Ilimitado — uso libre durante la vigencia" },
  { value: "SUBSCRIPTION", label: "Suscripción — se renueva por ciclo" },
];

const BILLING_CYCLE_OPTIONS = [
  { value: "WEEKLY", label: "Semanal" },
  { value: "MONTHLY", label: "Mensual" },
  { value: "QUARTERLY", label: "Trimestral" },
  { value: "YEARLY", label: "Anual" },
];

/** Mismo orden de despliegue que el resto de la app: lunes primero. */
const DAYS = [
  { value: "Monday", label: "L" },
  { value: "Tuesday", label: "M" },
  { value: "Wednesday", label: "X" },
  { value: "Thursday", label: "J" },
  { value: "Friday", label: "V" },
  { value: "Saturday", label: "S" },
  { value: "Sunday", label: "D" },
];

const ALL_DAYS = DAYS.map((day) => day.value);
const WEEKDAYS = ALL_DAYS.slice(0, 5);

const emptyItem = (): PackageItemFormValue => ({
  serviceId: "",
  quantity: "",
  daysAvailable: [...ALL_DAYS],
});

interface CreatePackageModalProps {
  onSuccess?: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create<CreatePackageModalProps>(({ onSuccess }) => {
  const modal = useModal();

  const { data: servicesData, loading: servicesLoading } =
    useQuery(SERVICES_QUERY);

  const [createPackage, { loading: isSubmitting, error: mutationError }] =
    useMutation(CREATE_PACKAGE_MUTATION, {
      refetchQueries: [{ query: PACKAGES_QUERY, variables: {} }],
    });

  const form = useForm<CreatePackageFormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      type: "QUANTITY",
      validityDays: "",
      billingCycle: "",
      items: [emptyItem()],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const type = useWatch({ control: form.control, name: "type" });
  const items = useWatch({ control: form.control, name: "items" });

  const isSubscription = type === "SUBSCRIPTION";
  // Un item sin cantidad es ilimitado, y un entitlement ilimitado sin fecha de
  // término no termina nunca. La suscripción está acotada por su ciclo.
  const hasUnlimitedItem = (items ?? []).some(
    (item) => item.quantity.trim() === "",
  );
  const validityRequired =
    (hasUnlimitedItem || type === "UNLIMITED") && !isSubscription;

  const serviceOptions = (servicesData?.services ?? []).map((service) => ({
    value: service.id,
    label: service.name,
  }));

  const toggleDay = (day: string, current: string[]) =>
    current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];

  const handleSubmit = async (data: CreatePackageFormValues) => {
    try {
      const result = await createPackage({
        variables: {
          input: {
            name: data.name,
            description: data.description || null,
            price: Number(data.price).toFixed(2),
            type: data.type,
            validityDays: data.validityDays
              ? Number(data.validityDays)
              : null,
            // Prohibido fuera de SUBSCRIPTION: mandarlo sería un error 400.
            billingCycle: isSubscription
              ? (data.billingCycle as BillingCycle)
              : null,
            items: data.items.map((item) => ({
              serviceId: item.serviceId,
              quantity:
                item.quantity.trim() === "" ? null : Number(item.quantity),
              daysMask: dayValuesToDaysMask(item.daysAvailable),
            })),
          },
        },
      });

      if (result.data?.createPackage) {
        showToast.success(
          "Paquete creado",
          `${result.data.createPackage.name} ya está disponible para vender.`,
        );
        onSuccess?.();
        modal.hide();
        form.reset();
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  const handleCancel = () => {
    modal.hide();
    form.reset();
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Paquete</DialogTitle>
        </DialogHeader>

        <Form form={form} onSubmit={handleSubmit} className="space-y-6">
          {mutationError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{mutationError.message}</span>
            </div>
          )}

          {/* Datos comerciales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              name="name"
              rules={{ required: "Ponle un nombre al paquete" }}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Guardería L–V + noches ilimitadas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              rules={{
                required: "Indica el precio",
                min: { value: 1, message: "El precio debe ser mayor a cero" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs md:text-sm"
                      placeholder="$0.00"
                      prefix="$"
                      decimalsLimit={2}
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <FormSelect
                      options={PACKAGE_TYPE_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSubscription ? (
              <FormField
                name="billingCycle"
                rules={{
                  required: "Una suscripción necesita ciclo de cobro",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo de cobro</FormLabel>
                    <FormControl>
                      <FormSelect
                        options={BILLING_CYCLE_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecciona el ciclo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              name="validityDays"
              rules={{
                validate: (value: string) =>
                  !validityRequired || value.trim() !== ""
                    ? true
                    : "Con un servicio ilimitado hace falta vigencia: sin fecha de término el paquete nunca vence.",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vigencia (días){" "}
                    {!validityRequired && (
                      <span className="text-muted-foreground font-normal">
                        · opcional
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder={isSubscription ? "Igual al ciclo" : "Ej. 30"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Servicios incluidos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Servicios incluidos</p>
                <p className="text-xs text-muted-foreground">
                  El cupo y los días son por servicio, no del paquete completo.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => append(emptyItem())}
              >
                <Plus className="w-4 h-4 mr-1" /> Agregar
              </Button>
            </div>

            {servicesLoading && (
              <p className="text-sm text-muted-foreground">
                Cargando servicios...
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 space-y-3"
              >
                <div className="flex gap-3 items-start">
                  <FormField<
                    CreatePackageFormValues,
                    `items.${number}.serviceId`
                  >
                    name={`items.${index}.serviceId`}
                    rules={{ required: "Elige un servicio" }}
                    render={({ field: serviceField }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Servicio</FormLabel>
                        <FormControl>
                          <FormSelect
                            options={serviceOptions}
                            value={serviceField.value}
                            onValueChange={serviceField.onChange}
                            placeholder="Selecciona un servicio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField<
                    CreatePackageFormValues,
                    `items.${number}.quantity`
                  >
                    name={`items.${index}.quantity`}
                    rules={{
                      validate: (value: string) =>
                        value.trim() === "" || Number(value) >= 1
                          ? true
                          : "El cupo debe ser al menos 1",
                    }}
                    render={({ field: qtyField }) => (
                      <FormItem className="w-36">
                        <FormLabel className="text-xs">Cupo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="Ilimitado"
                            {...qtyField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 shrink-0 text-muted-foreground hover:text-red-600"
                      onClick={() => remove(index)}
                      aria-label="Quitar servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <FormField<
                  CreatePackageFormValues,
                  `items.${number}.daysAvailable`
                >
                  name={`items.${index}.daysAvailable`}
                  rules={{
                    validate: (value: string[]) =>
                      value.length > 0
                        ? true
                        : "Selecciona al menos un día, o el servicio nunca se podrá usar",
                  }}
                  render={({ field: daysField }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Días que cubre
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          · la cobertura se decide por fecha
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap items-center gap-2">
                          {DAYS.map((day) => {
                            const selected = daysField.value.includes(
                              day.value,
                            );
                            return (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() =>
                                  daysField.onChange(
                                    toggleDay(day.value, daysField.value),
                                  )
                                }
                                className={cn(
                                  "w-9 h-9 rounded-full border-2 text-sm font-medium transition-all",
                                  selected
                                    ? "border-brand-border bg-brand text-black"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300",
                                )}
                              >
                                {day.label}
                              </button>
                            );
                          })}
                          <div className="flex gap-1 ml-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => daysField.onChange([...WEEKDAYS])}
                            >
                              L–V
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => daysField.onChange([...ALL_DAYS])}
                            >
                              Todos
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {hasUnlimitedItem && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 text-blue-800 text-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Dejar el cupo vacío significa <strong>ilimitado</strong> para
                  ese servicio. Los demás conservan el suyo.
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 pt-2">
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
                  <Check className="w-4 h-4 mr-2" /> Crear Paquete
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
