import { useState } from "react";
import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { FormSelect, type SelectOption } from "../FormSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { cn, DOG_BREEDS } from "@/lib/utils";
import { Plus, Trash2, Camera } from "lucide-react";

// Convert DOG_BREEDS object to SelectOption array
const breedOptions: SelectOption[] = Object.entries(DOG_BREEDS).map(
  ([value, label]) => ({ value, label })
);

export interface DogFormValues {
  id: string;
  photo?: File;
  name: string;
  breed: string;
  color: string;
  size: "small" | "medium" | "large" | "xlarge" | "";
  gender: "male" | "female" | "";
  weight: string;
  ageYears: string;
  ageMonths: string;
}

interface SizeOption {
  value: "SMALL" | "MEDIUM" | "LARGE" | "GIGANTIC";
  label: string;
}

interface GenderOption {
  value: "Male" | "Female";
  label: string;
}

const sizeOptions: SizeOption[] = [
  { value: "SMALL", label: "Chico" },
  { value: "MEDIUM", label: "Mediano" },
  { value: "LARGE", label: "Grande" },
  { value: "GIGANTIC", label: "X-Grande" },
];

const genderOptions: GenderOption[] = [
  { value: "Male", label: "Macho" },
  { value: "Female", label: "Hembra" },
];

interface ClientSignupStep2FormProps {
  onSubmit: (dogs: DogFormValues[]) => void;
  defaultDogs?: DogFormValues[];
  loading?: boolean;
}

const emptyDogValues: Omit<DogFormValues, "id"> = {
  photo: undefined,
  name: "",
  breed: "",
  color: "",
  size: "",
  gender: "",
  weight: "",
  ageYears: "",
  ageMonths: "",
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const ClientSignupStep2Form = ({
  onSubmit,
  defaultDogs = [],
  loading = false,
}: ClientSignupStep2FormProps) => {
  const [dogs, setDogs] = useState<DogFormValues[]>(defaultDogs);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<Omit<DogFormValues, "id">>({
    defaultValues: emptyDogValues,
    mode: "onChange",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        form.setValue("photo", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDog = (data: Omit<DogFormValues, "id">) => {
    const newDog: DogFormValues = {
      ...data,
      id: generateId(),
    };
    setDogs((prev) => [...prev, newDog]);
    form.reset(emptyDogValues);
    setPhotoPreview(null);
  };

  const handleRemoveDog = (id: string) => {
    setDogs((prev) => prev.filter((dog) => dog.id !== id));
  };

  const handleFinish = () => {
    // If there's data in the form, add it first
    const currentData = form.getValues();
    if (currentData.name) {
      const allDogs = [...dogs, { ...currentData, id: generateId() }];
      onSubmit(allDogs);
    } else if (dogs.length > 0) {
      onSubmit(dogs);
    }
  };

  const canFinish = dogs.length > 0 || form.formState.isValid;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* List of added dogs */}
      {dogs.length > 0 && (
        <div className="flex flex-col gap-2">
          {dogs.map((dog) => (
            <div
              key={dog.id}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                {dog.photo ? (
                  <img
                    src={URL.createObjectURL(dog.photo)}
                    alt={dog.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">🐕</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {dog.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ||
                    dog.breed}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDog(dog.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                aria-label={`Eliminar ${dog.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dog form */}
      <Form
        form={form}
        onSubmit={handleAddDog}
        className="flex flex-col gap-6 w-full rounded-md bg-white p-4"
      >
        <FieldSet className="gap-5">
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="photo-upload"
              className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-6 h-6 text-muted-foreground" />
              )}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <span className="text-xs text-muted-foreground">Subir foto</span>
          </div>

          {/* Name */}
          <FormField
            name="name"
            rules={{
              required: "El nombre es requerido",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="ej. Buddy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Breed */}
          <FormField
            name="breed"
            rules={{
              required: "La raza es requerida",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <FormControl>
                  <FormSelect
                    placeholder="Selecciona una raza"
                    options={breedOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            name="color"
            rules={{
              required: "El color es requerido",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="ej. Dorado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Selection */}
          <FormField
            name="size"
            rules={{
              required: "Por favor selecciona un tamaño",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tamaño</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {sizeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-all border",
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

          {/* Gender and Weight - Side by side */}
          <div className="flex gap-3 w-full">
            <FormField
              name="gender"
              rules={{
                required: "El género es requerido",
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Género</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={cn(
                            "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all border",
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

            <FormField
              name="weight"
              rules={{
                required: "El peso es requerido",
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: "Ingresa un número válido",
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="ej. 15"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Age - Years and Months */}
          <div className="flex gap-3 w-full">
            <FormField
              name="ageYears"
              rules={{
                pattern: {
                  value: /^\d*$/,
                  message: "Ingresa un número válido",
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Edad</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Años"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="ageMonths"
              rules={{
                pattern: {
                  value: /^\d*$/,
                  message: "Ingresa un número válido",
                },
                max: {
                  value: 11,
                  message: "Máximo 11 meses",
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="invisible">Meses</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Meses"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FieldSet>

        {/* Add another dog button */}
        <Button
          type="submit"
          variant="outline"
          disabled={!form.formState.isValid}
          className="w-full border-dashed border-primary text-primary hover:bg-primary/5 rounded-full h-11"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar otro perro
        </Button>
      </Form>

      {/* Finish button */}
      <Button
        type="button"
        size="lg"
        onClick={handleFinish}
        disabled={!canFinish || loading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold"
      >
        {loading ? "Procesando..." : "Finalizar"}
      </Button>
    </div>
  );
};

export default ClientSignupStep2Form;
