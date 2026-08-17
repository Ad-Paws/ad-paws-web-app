import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, Check, Infinity as InfinityIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormSelect,
  FormCheckbox,
} from "@/components/Form";
import { DogSelector } from "@/components/Dialog/CheckInDialog/components";
import {
  DOG_PACKAGES_QUERY,
  PURCHASE_PACKAGE_MUTATION,
} from "@/graphql/operations/packages";
import { DOGS_QUERY } from "@/graphql/operations/dogs";
import { daysMaskToShortLabel, moneyToNumber } from "@/utils/adapters";
import { showToast } from "@/lib/toast";
import type { PackagesQuery } from "@/gql/graphql";

type PackageTemplate = PackagesQuery["packages"][number];

const PAYMENT_METHOD_OPTIONS = [
  { value: "CASH", label: "Efectivo" },
  { value: "CARD", label: "Tarjeta" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "OTHER", label: "Otro" },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);

interface SellPackageFormValues {
  dogId: string;
  paymentMethod: string;
  markPaid: boolean;
}

interface SellPackageModalProps {
  template: PackageTemplate;
}

/**
 * Venta de un paquete a un perro.
 *
 * `markPaid` refleja si el cobro YA se hizo (terminal propia o efectivo): la
 * plataforma no mueve dinero, solo registra la transacción como COMPLETED o
 * PENDING. Por eso el default es no marcarlo pagado — dar por cobrado algo que
 * no se cobró es el error caro.
 */
// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create<SellPackageModalProps>(({ template }) => {
  const modal = useModal();

  const { data: dogsData } = useQuery(DOGS_QUERY, { variables: { first: 100 } });

  const [purchasePackage, { loading: isSubmitting, error: mutationError }] =
    useMutation(PURCHASE_PACKAGE_MUTATION);

  const form = useForm<SellPackageFormValues>({
    defaultValues: { dogId: "", paymentMethod: "CASH", markPaid: false },
    mode: "onChange",
  });

  const dogId = useWatch({ control: form.control, name: "dogId" });

  const dogs = (dogsData?.dogs ?? []).map((dog) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed ?? "",
    imageUrl: dog.imageUrl ?? undefined,
    owner: dog.primaryOwner
      ? {
          name: dog.primaryOwner.name ?? undefined,
          lastname: dog.primaryOwner.lastname ?? undefined,
        }
      : undefined,
  }));

  const handleSubmit = async (data: SellPackageFormValues) => {
    try {
      const result = await purchasePackage({
        variables: {
          input: {
            dogId: data.dogId,
            packageId: template.id,
            paymentMethod: data.paymentMethod as "CASH",
            markPaid: data.markPaid,
          },
        },
        refetchQueries: [
          {
            query: DOG_PACKAGES_QUERY,
            variables: { dogId: data.dogId, activeOnly: false },
          },
        ],
      });

      if (result.data?.purchasePackage) {
        showToast.success(
          "Paquete vendido",
          data.markPaid
            ? "Registrado como pagado."
            : "El cobro quedó pendiente.",
        );
        modal.hide();
        form.reset();
      }
    } catch (error) {
      console.error("Error selling package:", error);
    }
  };

  const handleCancel = () => {
    modal.hide();
    form.reset();
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vender {template.name}</DialogTitle>
        </DialogHeader>

        <Form form={form} onSubmit={handleSubmit} className="space-y-6">
          {mutationError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{mutationError.message}</span>
            </div>
          )}

          {/* Qué se está vendiendo, con los entitlements reales */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{template.name}</span>
              <span className="font-bold text-brand-strong">
                {formatPrice(moneyToNumber(template.price))}
              </span>
            </div>
            <div className="space-y-1 border-t border-gray-200 dark:border-gray-600 pt-2">
              {template.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {item.service.name}
                    <span className="text-muted-foreground">
                      {" "}
                      · {daysMaskToShortLabel(item.daysMask)}
                    </span>
                  </span>
                  <span className="font-medium whitespace-nowrap flex items-center gap-1">
                    {item.quantity === null ? (
                      <>
                        <InfinityIcon className="w-3 h-3 text-brand-strong" />
                        <span className="text-brand-strong">Ilimitado</span>
                      </>
                    ) : (
                      `${item.quantity} sesiones`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <FormField
            name="dogId"
            rules={{ required: "Elige a quién se le vende" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alumno</FormLabel>
                <FormControl>
                  <DogSelector
                    dogs={dogs}
                    selectedDogId={field.value || null}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pago</FormLabel>
                <FormControl>
                  <FormSelect
                    options={PAYMENT_METHOD_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="markPaid"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 cursor-pointer">
                    <FormCheckbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                    />
                    <span className="text-sm">
                      <span className="font-medium">Ya se cobró</span>
                      <span className="block text-xs text-muted-foreground">
                        La plataforma no procesa el pago; esto solo registra la
                        transacción como pagada para conciliarla después.
                      </span>
                    </span>
                  </label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              disabled={isSubmitting || !dogId}
              className="rounded-full px-6 bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" /> Vendiendo...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Confirmar venta
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
