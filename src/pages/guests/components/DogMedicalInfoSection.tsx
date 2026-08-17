import { Heart, Plus } from "lucide-react";

interface MedicalInfo {
  allergies: string;
  medications: string;
  specialDietaryNeeds: string;
  veterinarian: string;
  lastCheckup: string;
  nextCheckup: string;
}

interface DogMedicalInfoSectionProps {
  medicalInfo: MedicalInfo;
}

const DogMedicalInfoSection = ({ medicalInfo }: DogMedicalInfoSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold">Información Médica</h3>
        </div>
        <button className="text-sm text-brand-strong hover:underline flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Alergias
          </label>
          <p className="mt-1 text-gray-900">{medicalInfo.allergies}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Medicamentos
          </label>
          <p className="mt-1 text-gray-900">{medicalInfo.medications}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Necesidades dietéticas especiales
          </label>
          <p className="mt-1 text-gray-900">
            {medicalInfo.specialDietaryNeeds}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Veterinario
          </label>
          <p className="mt-1 text-gray-900">{medicalInfo.veterinarian}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Último chequeo
            </label>
            <p className="mt-1 text-gray-900">{medicalInfo.lastCheckup}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Próximo chequeo
            </label>
            <p className="mt-1 text-gray-900">{medicalInfo.nextCheckup}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogMedicalInfoSection;

