import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { UserPlusIcon, EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
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

} from "@/components/Form";
import {
  COMPANY_MEMBERS_QUERY,
  INVITE_MEMBER_MUTATION,
} from "@/graphql/operations/team";
import { showToast } from "@/lib/toast";

interface AddEmployeeFormValues {
  email: string;
  password: string;
  name: string;
  lastname: string;
  phone: string;
}

interface Employee {
  id: string;
  name: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  profilePicture: string | null;
}

const DEFAULT_VALUES: AddEmployeeFormValues = {
  email: "",
  password: "",
  name: "",
  lastname: "",
  phone: "",
};

export interface AddEmployeeModalProps {
  onSuccess?: (employee: Employee) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(
  ({ onSuccess }: AddEmployeeModalProps) => {
    const modal = useModal();
    const [showPassword, setShowPassword] = useState(false);

    // inviteMember crea la cuenta (password temporal) o vincula una existente
    // como STAFF de la compañía activa. gender/birthDate ya no forman parte
    // del input: son datos del perfil del usuario, no de la membresía.
    const [inviteMember, { loading: isSubmitting, error: mutationError }] =
      useMutation(INVITE_MEMBER_MUTATION, {
        refetchQueries: [COMPANY_MEMBERS_QUERY],
      });

    const form = useForm<AddEmployeeFormValues>({
      defaultValues: DEFAULT_VALUES,
      mode: "onChange",
    });

    const handleSubmit = async (data: AddEmployeeFormValues) => {
      try {
        const result = await inviteMember({
          variables: {
            input: {
              email: data.email.trim(),
              password: data.password || undefined,
              name: data.name.trim() || undefined,
              lastname: data.lastname.trim() || undefined,
              phone: data.phone.trim() || undefined,
              role: "STAFF",
            },
          },
        });

        if (result.data?.inviteMember) {
          const { user, membership } = result.data.inviteMember;
          const name =
            [user.name, user.lastname].filter(Boolean).join(" ") || user.email;
          showToast.success(
            "Miembro agregado",
            `${name} ahora forma parte del equipo.`
          );
          onSuccess?.({
            id: user.id,
            name: user.name ?? null,
            lastname: user.lastname ?? null,
            email: user.email,
            phone: null,
            role: membership.role,
            status: membership.status,
            profilePicture: null,
          });
          modal.hide();
          form.reset(DEFAULT_VALUES);
          setShowPassword(false);
        }
      } catch (error) {
        console.error("Error adding employee:", error);
        showToast.error(
          "No se pudo agregar",
          error instanceof Error ? error.message : "Error desconocido"
        );
      }
    };

    const handleCancel = () => {
      modal.hide();
      form.reset(DEFAULT_VALUES);
      setShowPassword(false);
    };

    return (
      <Dialog open={modal.visible} onOpenChange={handleCancel}>
        <DialogContent
          className="sm:max-w-md bg-white dark:bg-gray-800"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Agregar miembro al equipo
            </DialogTitle>
          </DialogHeader>

          <Form form={form} onSubmit={handleSubmit} className="space-y-4">
            {/* Mutation Error */}
            {mutationError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Error al agregar el miembro. Por favor intenta de nuevo.
                </span>
              </div>
            )}

            {/* Name and Lastname */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Juan"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pérez"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              name="email"
              rules={{
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo electrónico <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@empresa.com"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              rules={{
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña temporal"
                        disabled={isSubmitting}
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151] transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+52 55 1234 5678"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* gender/birthDate se quitaron: InviteMemberInput no los acepta
                (son datos del perfil del usuario, editables por él mismo). */}

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-full px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
                className="rounded-full px-6"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" /> Agregando...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="w-4 h-4 mr-2" /> Agregar
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
