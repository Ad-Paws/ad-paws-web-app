import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { DOG_BY_ID } from "@/lib/api/dogs.api";
import type { Dog, User } from "@/types/Dog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DogBasicInfoFormValues } from "@/components/Form/Forms/DogBasicInfoForm";
import {
  DogProfileHeader,
  DogBasicInfoSection,
  // DogMedicalInfoSection,
  // DogBehavioralNotesSection,
  DogOwnerDetailsSection,
  // DogVaccinationsSection,
  // DogQuickStatsSection,
  DogProfileSkeleton,
} from "./components";

interface DogDetailOwner extends Omit<User, "password"> {
  birthDate?: string;
}

interface DogDetail extends Omit<Dog, "owner"> {
  owner?: DogDetailOwner | null;
}

// Mock data for sections not yet from API
// const mockMedicalInfo = {
//   allergies: "None reported",
//   medications: "None currently",
//   specialDietaryNeeds: "High-protein diet recommended",
//   veterinarian: "Dr. Sarah Mitchell - Paws & Claws Clinic",
//   lastCheckup: "15/10/2024",
//   nextCheckup: "15/04/2025",
// };

// const mockBehavioralNotes = {
//   temperament: "Friendly, energetic, loves to play fetch",
//   socialization:
//     "Gets along well with other dogs. Loves children. Can be shy around cats initially but warms up quickly.",
//   specialInstructions:
//     "Needs at least 1 hour of exercise daily. Prefers outdoor play. Responds well to positive reinforcement training.",
//   tags: ["Good with Kids", "Good with Dogs", "Energetic", "Playful"],
// };

// const mockVaccinations = [
//   { name: "Rabies", expiry: "Dec 2025", status: "valid" as const },
//   { name: "DHPP", expiry: "Nov 2025", status: "valid" as const },
//   { name: "Bordetella", expiry: "Feb 2025", status: "expiring" as const },
//   { name: "Lyme Disease", expiry: "Aug 2025", status: "valid" as const },
// ];

// const mockQuickStats = {
//   totalVisits: 47,
//   lastVisit: "Dec 28, 2024",
//   totalDays: 142,
//   favoriteService: "Daycare",
//   memberStatus: "Gold",
// };

const DogProfile = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ dogById: DogDetail }>(DOG_BY_ID, {
    variables: { dogByIdId: Number(dogId) },
    skip: !dogId,
  });

  const dog = data?.dogById;
  const owner = dog?.owner;

  // Memoize form default values to prevent unnecessary re-renders
  const formDefaultValues = useMemo<DogBasicInfoFormValues>(
    () => ({
      name: dog?.name || "",
      breed: dog?.breed || "",
      birthDate: dog?.birthDate?.split("T")[0] || "",
      gender: dog?.gender || "Male",
      color: dog?.color || "",
      weight: dog?.weight?.toString() || "",
      size: dog?.size || "MEDIUM",
    }),
    [dog],
  );

  if (loading) {
    return <DogProfileSkeleton />;
  }

  if (error || !dog) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar perfil</h2>
          <p className="text-gray-500 mb-4">
            No se pudo encontrar la información del perro.
          </p>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#F9FAFB]">
      <DogProfileHeader dog={dog} owner={owner} onBack={() => navigate(-1)} />

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 2 cols wide */}
          <div className="col-span-2 space-y-6">
            <DogBasicInfoSection
              dogId={Number(dog.id)}
              ownerId={dog.ownerId}
              defaultValues={formDefaultValues}
            />
            {/* <DogMedicalInfoSection medicalInfo={mockMedicalInfo} />
            <DogBehavioralNotesSection behavioralNotes={mockBehavioralNotes} /> */}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {owner && <DogOwnerDetailsSection owner={owner} />}
            {/* <DogVaccinationsSection vaccinations={mockVaccinations} /> */}
            {/* <DogQuickStatsSection stats={mockQuickStats} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogProfile;
