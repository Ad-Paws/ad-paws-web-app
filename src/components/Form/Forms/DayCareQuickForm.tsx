import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormSelect, type SelectOption } from "../FormSelect";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface DayCareQuickFormValues {
  dogId: string;
}

const dogOptions: SelectOption[] = [
  { value: "1", label: "Kukulkán" },
  { value: "2", label: "Max" },
  { value: "3", label: "Luna" },
  { value: "4", label: "Rocky" },
];

const DayCareQuickForm = () => {
  const form = useForm<DayCareQuickFormValues>({
    defaultValues: {
      dogId: "",
    },
  });

  const onSubmit = (data: DayCareQuickFormValues) => {
    console.log(data);
  };

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col justify-between h-full"
    >
      <FieldSet>
        <FormField
          name="dogId"
          rules={{
            required: "Selecciona un huésped",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecciona al Pek</FormLabel>
              <FormControl>
                <FormSelect
                  placeholder="Selecciona un huésped"
                  options={dogOptions}
                  value={field.value}
                  onValueChange={field.onChange}
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
        variant={undefined}
        disabled={form.formState.isSubmitting || !form.formState.isValid}
        className="w-full bg-accent!"
      >
        {form.formState.isSubmitting ? "Confirmando..." : "Confirmar Day Care"}
      </Button>
    </Form>
  );
};

export default DayCareQuickForm;
