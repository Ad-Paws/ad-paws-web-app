import { ArrowLeft } from "lucide-react";

import { formatAgeFromBirthDate, DOG_BREEDS } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const SIZE_LABELS: Record<string, string> = {
  SMALL: "Pequeño",
  MEDIUM: "Mediano",
  LARGE: "Grande",
  TOY: "Toy",
  GIGANTIC: "Gigante",
};

const GENDER_LABELS: Record<string, string> = {
  Male: "Macho",
  Female: "Hembra",
  Other: "Otro",
};

interface Owner {
  id?: string | null;
  name?: string | null;
  lastname?: string | null;
  phone?: string | null;
  profilePicture?: string | null;
}

interface DogProfileHeaderProps {
  dog: {
    id?: string | null;
    name: string;
    breed: string;
    birthDate?: string | null;
    gender?: string | null;
    weight?: number | null;
    size?: string | null;
    color?: string | null;
    imageUrl?: string | null;
  };
  owner?: Owner | null;
  onBack: () => void;
}

const DogProfileHeader = ({ dog, owner, onBack }: DogProfileHeaderProps) => {
  const formatBirthDate = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy", { locale: es });
  };

  return (
    <div className="bg-[#3D3B39] text-white">
      <div className="px-6 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Perfil de {dog.name}</h1>
              <p className="text-sm text-gray-400">
                Guest ID: #GS-{dog.id?.padStart(4, "0")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button> */}
          </div>
        </div>

        {/* Dog info header */}
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={
                dog.imageUrl ||
                "https://ui-avatars.com/api/?background=8B7355&color=fff&name=" +
                  encodeURIComponent(dog.name.charAt(0))
              }
              alt={dog.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold">{dog.name}</h2>
              {/* <span className="px-3 py-1 bg-[#4CAF50] text-white text-xs font-medium rounded-full">
                Checked In
              </span> */}
            </div>
            <p className="text-gray-300 mb-4">
              {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] || dog.breed} •{" "}
              {formatAgeFromBirthDate(dog.birthDate)} •{" "}
              {GENDER_LABELS[dog.gender || "Male"]}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Peso
                </p>
                <p className="text-lg font-semibold">{dog.weight || 0} kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Tamaño
                </p>
                <p className="text-lg font-semibold">
                  {SIZE_LABELS[dog.size || "MEDIUM"]}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Color
                </p>
                <p className="text-lg font-semibold">{dog.color || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Fecha de nacimiento
                </p>
                <p className="text-lg font-semibold">
                  {dog.birthDate ? formatBirthDate(dog.birthDate) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Owner mini card */}
          {owner && (
            <div className="bg-[#4A4845] rounded-xl p-4 min-w-[200px]">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Dueño
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={
                    owner.profilePicture ||
                    "https://ui-avatars.com/api/?background=8B7355&color=fff&name=" +
                      encodeURIComponent(
                        (owner.name?.charAt(0) || "") +
                          (owner.lastname?.charAt(0) || ""),
                      )
                  }
                  alt={`${owner.name} ${owner.lastname}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {owner.name} {owner.lastname}
                  </p>
                  <p className="text-sm text-gray-400">{owner.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogProfileHeader;
