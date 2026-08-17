import { Syringe, Plus, CheckCircle2, AlertTriangle } from "lucide-react";

interface Vaccination {
  name: string;
  expiry: string;
  status: "valid" | "expiring" | "expired";
}

interface DogVaccinationsSectionProps {
  vaccinations: Vaccination[];
}

const DogVaccinationsSection = ({
  vaccinations,
}: DogVaccinationsSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Syringe className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Vacunas</h3>
        </div>
        <button className="text-brand-strong hover:text-brand-strong">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {vaccinations.map((vaccine) => (
          <div
            key={vaccine.name}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="font-medium text-sm">{vaccine.name}</p>
              <p className="text-xs text-gray-500">Expires: {vaccine.expiry}</p>
            </div>
            {vaccine.status === "valid" && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            {vaccine.status === "expiring" && (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogVaccinationsSection;

