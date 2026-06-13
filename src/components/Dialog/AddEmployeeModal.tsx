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
  FormSelect,
} from "@/components/Form";
import {
  ADD_EMPLOYEE_MUTATION,
  GET_COMPANY_EMPLOYEES,
} from "@/lib/api/user.api";
import { showToast } from "@/lib/toast";
import type { SelectOption } from "@/components/Form/FormSelect";

interface AddEmployeeFormValues {
  email: string;
  password: string;
  name: string;
  lastname: string;
  phone: string;
  gender: string;
  birthDate: string;
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
  gender: "",
  birthDate: "",
};

const GENDER_OPTIONS: SelectOption[] = [
  { value: "Female", label: "Femenino" },
  { value: "Male", label: "Masculino" },
  { value: "Other", label: "Otro" },
];

export interface AddEmployeeModalProps {
  companyId: number;
  onSuccess?: (employee: Employee) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(
  ({ companyId, onSuccess }: AddEmployeeModalProps) => {
    const modal = useModal();
    const [showPassword, setShowPassword] = useState(false);

    const [addEmployee, { loading: isSubmitting, error: mutationError }] =
      useMutation<{ addEmployee: Employee }>(ADD_EMPLOYEE_MUTATION, {
        refetchQueries: [
          {
            query: GET_COMPANY_EMPLOYEES,
            variables: { companyId },
          },
        ],
      });

    const form = useForm<AddEmployeeFormValues>({
      defaultValues: DEFAULT_VALUES,
      mode: "onChange",
    });

    const handleSubmit = async (data: AddEmployeeFormValues) => {
      try {
        const input: Record<string, unknown> = {
          email: data.email.trim(),
          password: data.password,
        };
        if (data.name.trim()) input.name = data.name.trim();
        if (data.lastname.trim()) input.lastname = data.lastname.trim();
        if (data.phone.trim()) input.phone = data.phone.trim();
        if (data.gender) input.gender = data.gender;
        if (data.birthDate)
          input.birthDate = new Date(data.birthDate).toISOString();

        const result = await addEmployee({ variables: { input } });

        if (result.data?.addEmployee) {
          const added = result.data.addEmployee;
          const name =
            [added.name, added.lastname].filter(Boolean).join(" ") ||
            added.email;
          showToast.success(
            "Miembro agregado",
            `${name} ahora forma parte del equipo.`
          );
          onSuccess?.(result.data.addEmployee);
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

            {/* Gender and BirthDate */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <FormControl>
                      <FormSelect
                        placeholder="Seleccionar"
                        options={GENDER_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
