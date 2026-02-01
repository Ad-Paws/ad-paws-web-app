import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { FormSelect, type SelectOption } from "../FormSelect";
import { FormDatePicker } from "../FormDatePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DOG_BREEDS, calculateAge, cn } from "@/lib/utils";
import { UPDATE_DOG } from "@/lib/api/dogs.api";
import { Save, Loader2 } from "lucide-react";

// Convert DOG_BREEDS object to SelectOption array
const breedOptions: SelectOption[] = Object.entries(DOG_BREEDS).map(
  ([value, label]) => ({ value, label })
);

const sizeOptions: SelectOption[] = [
  { value: "TOY", label: "Toy (0-4 kg)" },
  { value: "SMALL", label: "Pequeño (0-10 kg)" },
  { value: "MEDIUM", label: "Mediano (10-25 kg)" },
  { value: "LARGE", label: "Grande (25-45 kg)" },
  { value: "GIGANTIC", label: "Gigante (45+ kg)" },
];

const genderOptions: SelectOption[] = [
  { value: "Male", label: "Macho" },
  { value: "Female", label: "Hembra" },
  { value: "Other", label: "Otro" },
];

export interface DogBasicInfoFormValues {
  name: string;
  breed: string;
  birthDate: string;
  gender: string;
  color: string;
  weight: string;
  size: string;
}

interface DogBasicInfoFormProps {
  dogId: number;
  ownerId: number;
  defaultValues: DogBasicInfoFormValues;
  onSuccess?: () => void;
}

const DogBasicInfoForm = ({
  dogId,
  ownerId,
  defaultValues,
  onSuccess,
}: DogBasicInfoFormProps) => {
  const form = useForm<DogBasicInfoFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const [updateDog, { loading: isUpdating }] = useMutation(UPDATE_DOG, {
    onCompleted: () => {
      console.log("✅ Dog info updated successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("❌ Error updating dog:", error.message);
    },
  });

  const { isDirty } = form.formState;
  const birthDateValue = form.watch("birthDate");

  // Calculate age from birthDate
  const age = useMemo(() => {
    if (!birthDateValue) return { years: 0, months: 0 };
    return calculateAge(birthDateValue);
  }, [birthDateValue]);

  // Reset form when defaultValues change
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = async (data: DogBasicInfoFormValues) => {
    await updateDog({
      variables: {
        input: {
          id: dogId,
          ownerId: ownerId,
          name: data.name,
          breed: data.breed,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString()
            : null,
          gender: data.gender || null,
          color: data.color || null,
          weight: data.weight ? parseFloat(data.weight) : null,
          size: data.size || null,
        },
      },
    });
    // Reset the dirty state after successful save
    form.reset(data);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="relative">
      <div className="grid grid-cols-2 gap-4">
        {/* Dog Name */}
        <FormField
          name="name"
          rules={{ required: "El nombre es requerido" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Nombre del perro
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Breed */}
        <FormField
          name="breed"
          rules={{ required: "La raza es requerida" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Raza
              </FormLabel>
              <FormControl>
                <FormSelect
                  placeholder="Selecciona una raza"
                  options={breedOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  triggerClassName="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Birth Date */}
        <FormField
          name="birthDate"
          rules={{ required: "La fecha de nacimiento es requerida" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Fecha de nacimiento
              </FormLabel>
              <FormControl>
                <FormDatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => {
                    field.onChange(
                      date ? date.toISOString().split("T")[0] : ""
                    );
                  }}
                  maxDate={new Date()}
                  className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age (Read-only computed fields) */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Edad (Años)
            </label>
            <Input
              value={age.years}
              readOnly
              className="mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Edad (Meses)
            </label>
            <Input
              value={age.months}
              readOnly
              className="mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Gender */}
        <FormField
          name="gender"
          rules={{ required: "El sexo es requerido" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Sexo
              </FormLabel>
              <FormControl>
                <FormSelect
                  placeholder="Selecciona el sexo"
                  options={genderOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  triggerClassName="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color */}
        <FormField
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Color
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ej. Dorado"
                  className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weight */}
        <FormField
          name="weight"
          rules={{
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: "Ingresa un número válido",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Peso (kg)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  {...field}
                  placeholder="ej. 15"
                  className="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Size */}
        <FormField
          name="size"
          rules={{ required: "La categoría de tamaño es requerida" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-gray-500 uppercase tracking-wider">
                Categoría de tamaño
              </FormLabel>
              <FormControl>
                <FormSelect
                  placeholder="Selecciona un tamaño"
                  options={sizeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  triggerClassName="mt-1 bg-gray-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Floating Save Button */}
      <div
        className={cn(
          "fixed bottom-6 right-6 transition-all duration-300 ease-out z-50",
          isDirty
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Button
          type="submit"
          disabled={isUpdating}
          size="lg"
          className="bg-[#A3C585] hover:bg-[#8FB86E] text-black shadow-lg shadow-[#A3C585]/30 px-6 py-3 h-auto rounded-full font-semibold flex items-center gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default DogBasicInfoForm;
