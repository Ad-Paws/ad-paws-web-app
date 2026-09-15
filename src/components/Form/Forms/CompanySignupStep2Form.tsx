import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { PasswordStrengthMeter } from "../PasswordStrengthMeter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  PASSWORD_MIN_LENGTH,
  passwordFieldRules,
} from "@/lib/passwordPolicy";

export interface CompanySignupStep2Values {
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}

interface CompanySignupStep2FormProps {
  onSubmit: (data: CompanySignupStep2Values) => void;
  defaultValues?: Partial<CompanySignupStep2Values>;
  loading?: boolean;
}

const CompanySignupStep2Form = ({
  onSubmit,
  defaultValues,
  loading = false,
}: CompanySignupStep2FormProps) => {
  const form = useForm<CompanySignupStep2Values>({
    defaultValues: {
      ownerName: "",
      ownerEmail: "",
      ownerPassword: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
      <FieldSet className="gap-5">
        <FormField
          name="ownerName"
          rules={{
            required: "El nombre es requerido",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="ej. Enrique Álvarez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="ownerEmail"
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

        <FormField
          name="ownerPassword"
          rules={passwordFieldRules}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres`}
                  {...field}
                />
              </FormControl>
              <PasswordStrengthMeter password={field.value ?? ""} />
              {/* El semáforo ya explica qué falta; solo se muestra el error de vacío. */}
              {fieldState.error?.type === "required" && <FormMessage />}
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

export default CompanySignupStep2Form;
