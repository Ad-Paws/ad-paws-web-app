import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

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
