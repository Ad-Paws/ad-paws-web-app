import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { FormDatePicker } from "../FormDatePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface ClientSignupStep1Values {
  name: string;
  lastname: string;
  birthdate: Date | undefined;
  gender: "female" | "male" | "other" | "";
  email: string;
  password: string;
  phone: string;
}

interface GenderOption {
  value: "Female" | "Male" | "Other";
  label: string;
}

const genderOptions: GenderOption[] = [
  { value: "Female", label: "Femenino" },
  { value: "Male", label: "Masculino" },
  { value: "Other", label: "Otro" },
];

interface ClientSignupStep1FormProps {
  onSubmit: (data: ClientSignupStep1Values) => void;
  defaultValues?: Partial<ClientSignupStep1Values>;
  loading?: boolean;
}

const ClientSignupStep1Form = ({
  onSubmit,
  defaultValues,
  loading = false,
}: ClientSignupStep1FormProps) => {
  const form = useForm<ClientSignupStep1Values>({
    defaultValues: {
      name: "",
      lastname: "",
      birthdate: undefined,
      gender: "",
      email: "",
      password: "",
      phone: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col gap-6 w-full"
    >
      <FieldSet className="gap-5">
        {/* Nombre y Apellido - Lado a lado */}
        <div className="flex gap-3 w-full">
          <FormField
            name="name"
            rules={{
              required: "El nombre es requerido",
            }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="ej. María" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastname"
            rules={{
              required: "El apellido es requerido",
            }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="ej. García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fecha de nacimiento */}
        <FormField
          name="birthdate"
          rules={{
            required: "La fecha de nacimiento es requerida",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <FormDatePicker
                  placeholder="dd/mm/aaaa"
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selección de género */}
        <FormField
          name="gender"
          rules={{
            required: "Por favor selecciona un género",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Género</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "px-5 py-2 rounded-md text-sm font-medium transition-all border",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        field.value === option.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-card border-border text-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Correo electrónico */}
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
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contraseña */}
        <FormField
          name="password"
          rules={{
            required: "La contraseña es requerida",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de teléfono */}
        <FormField
          name="phone"
          rules={{
            required: "El número de teléfono es requerido",
            pattern: {
              value: /^[\d\s\-()+ ]+$/,
              message: "Número de teléfono inválido",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de teléfono</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(55) 1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldSet>

      <Button
        type="submit"
        size="lg"
        disabled={
          form.formState.isSubmitting || !form.formState.isValid || loading
        }
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold mt-2"
      >
        {form.formState.isSubmitting ? "Procesando..." : "Continuar"}
      </Button>
    </Form>
  );
};

export default ClientSignupStep1Form;
