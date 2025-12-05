import { FieldSet } from "@/components/ui/field";
import { useForm, useWatch } from "react-hook-form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { Form } from "../Form";
import { FormSelect, type SelectOption } from "../FormSelect";
import { FormDatePicker } from "../FormDatePicker";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface HotelQuickFormValues {
  dogId: string;
  checkInDate: Date | undefined;
  checkoutDate: Date | undefined;
  roomId: string;
}

// Example options - these would typically come from an API
const dogOptions: SelectOption[] = [
  { value: "1", label: "Kukulkán" },
  { value: "2", label: "Max" },
  { value: "3", label: "Luna" },
  { value: "4", label: "Rocky" },
];

const roomOptions: SelectOption[] = [
  { value: "1", label: "Habitación 101 - Suite" },
  { value: "2", label: "Habitación 102 - Standard" },
  { value: "3", label: "Habitación 103 - Deluxe" },
];

const HotelQuickForm = () => {
  const form = useForm<HotelQuickFormValues>({
    defaultValues: {
      dogId: "",
      checkInDate: undefined,
      checkoutDate: undefined,
      roomId: "",
    },
    mode: "onChange",
  });

  const checkInDate = useWatch({
    control: form.control,
    name: "checkInDate",
  });

  const onSubmit = (data: HotelQuickFormValues) => {
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
              <FormLabel>Nombre del Huésped</FormLabel>
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

        <div className="flex gap-4 w-full min-w-0">
          <FormField
            name="checkInDate"
            rules={{
              required: "La fecha de entrada es requerida",
            }}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-0">
                <FormLabel>Fecha de Entrada</FormLabel>
                <FormControl>
                  <FormDatePicker
                    placeholder="Selecciona"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={new Date()}
                    dateFormat="dd-MM-yy"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="checkoutDate"
            rules={{
              required: "La fecha de salida es requerida",
            }}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-0">
                <FormLabel>Fecha de Salida</FormLabel>
                <FormControl>
                  <FormDatePicker
                    placeholder="Selecciona"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={checkInDate || new Date()}
                    dateFormat="dd-MM-yy"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="roomId"
          rules={{
            required: "Selecciona una habitación",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habitación</FormLabel>
              <FormControl>
                <FormSelect
                  placeholder="Selecciona una habitación"
                  options={roomOptions}
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
        disabled={
          form.formState.isSubmitting ||
          !form.formState.isValid ||
          form.formState.isLoading
        }
        className="w-full bg-accent!"
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner /> Reservando...
          </>
        ) : (
          "Confirmar reserva"
        )}
      </Button>
    </Form>
  );
};

export default HotelQuickForm;
