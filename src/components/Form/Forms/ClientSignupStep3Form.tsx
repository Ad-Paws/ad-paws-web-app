import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DOG_BREEDS } from "@/lib/utils";
import type { ClientSignupStep1Values } from "./ClientSignupStep1Form";
import type { DogFormValues } from "./ClientSignupStep2Form";

interface ClientSignupStep3FormProps {
  userInfo: ClientSignupStep1Values;
  dogs: DogFormValues[];
  onConfirm: () => void;
  onEditUserInfo: () => void;
  onEditDog: (dogId: string) => void;
  loading?: boolean;
}

const genderLabels: Record<string, string> = {
  Female: "Femenino",
  Male: "Masculino",
  Other: "Otro",
};

const dogGenderLabels: Record<string, string> = {
  Male: "Macho",
  Female: "Hembra",
};

const formatAge = (years: string, months: string): string => {
  const y = parseInt(years) || 0;
  const m = parseInt(months) || 0;

  const parts: string[] = [];
  if (y > 0) parts.push(`${y}a`);
  if (m > 0) parts.push(`${m}m`);

  return parts.length > 0 ? parts.join(" ") : "0m";
};

const ClientSignupStep3Form = ({
  userInfo,
  dogs,
  onConfirm,
  onEditUserInfo,
  onEditDog,
  loading = false,
}: ClientSignupStep3FormProps) => {
  const fullName = `${userInfo.name} ${userInfo.lastname}`;
  const formattedBirthdate = userInfo.birthdate
    ? format(userInfo.birthdate, "yyyy-MM-dd", { locale: es })
    : "";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* User Information Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Tu información
          </h2>
          <button
            type="button"
            onClick={onEditUserInfo}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Editar
          </button>
        </div>

        <div className="space-y-3">
          <InfoRow label="Nombre completo" value={fullName} />
          <InfoRow label="Fecha de nacimiento" value={formattedBirthdate} />
          <InfoRow
            label="Género"
            value={genderLabels[userInfo.gender] || userInfo.gender}
          />
          <InfoRow label="Correo" value={userInfo.email} />
          <InfoRow label="Teléfono" value={userInfo.phone} />
        </div>
      </div>

      {/* Dogs Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Tus perros
        </h2>

        <div className="flex flex-col gap-3">
          {dogs.map((dog) => (
            <div
              key={dog.id}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                {/* Dog Photo */}
                <div className="w-14 h-14 rounded-full bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {dog.photo ? (
                    <img
                      src={URL.createObjectURL(dog.photo)}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🐕</span>
                  )}
                </div>

                {/* Dog Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {dog.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onEditDog(dog.id)}
                      className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ||
                      dog.breed}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{formatAge(dog.ageYears, dog.ageMonths)}</span>
                    <span className="text-border">•</span>
                    <span>{dogGenderLabels[dog.gender] || dog.gender}</span>
                    <span className="text-border">•</span>
                    <span>{dog.weight} kg</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        type="button"
        size="lg"
        onClick={onConfirm}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold mt-2"
      >
        {loading ? "Creando cuenta..." : "Confirmar y crear cuenta"}
      </Button>
    </div>
  );
};

// Helper component for info rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground text-right">
      {value}
    </span>
  </div>
);

export default ClientSignupStep3Form;
