import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export interface CompanySignupStep1Values {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
}

interface CompanySignupStep1FormProps {
  onSubmit: (data: CompanySignupStep1Values) => void;
  defaultValues?: Partial<CompanySignupStep1Values>;
  loading?: boolean;
}

const CompanySignupStep1Form = ({
  onSubmit,
  defaultValues,
  loading = false,
}: CompanySignupStep1FormProps) => {
  const form = useForm<CompanySignupStep1Values>({
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
      <FieldSet className="gap-5">
        <FormField
          name="companyName"
          rules={{
            required: "El nombre de la empresa es requerido",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la empresa</FormLabel>
              <FormControl>
                <Input placeholder="ej. AdPaws Marketing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyEmail"
          rules={{
            required: "El correo de la empresa es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Correo electrónico inválido",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo de la empresa</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contacto@empresa.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="companyPhone"
          rules={{
            required: "El teléfono de la empresa es requerido",
            pattern: {
              value: /^[\d\s\-()+ ]+$/,
              message: "Número de teléfono inválido",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono de la empresa</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+52 55 1234 5678" {...field} />
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

export default CompanySignupStep1Form;
