import MiniInsightCard from "@/components/Dashboard/MiniInsightCard";
import PetCard from "@/components/PetCard";
import { CheckIcon, PawPrintIcon, StarIcon, SyringeIcon } from "lucide-react";
import { COMPANY_DOGS } from "@/lib/api/dogs.api";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@apollo/client/react";
import type { Dog } from "@/types/Dog";
import PetCardSkeleton from "@/components/PetCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_GUEST_STATS } from "@/lib/api/stats.api";
import type { GuestsStats } from "@/types/Stats";
import { formatAgeFromBirthDate } from "@/lib/utils";

const Guests = () => {
  const { company } = useAuth();
  const { data, loading } = useQuery<{ companyDogs: Dog[] }>(COMPANY_DOGS, {
    variables: { companyId: Number(company?.id) },
  });
  const { data: statsData, loading: statsLoading } = useQuery<{
    guestsStats: GuestsStats;
  }>(GET_GUEST_STATS);
  return (
    <div className="h-full px-6 py-4 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-2xl font-bold">Guestión de Peks</p>
          <p className="text-[#6B7280] mt-1">
            Edita perfiles, reportes médicos y más.
          </p>
        </div>
        <div className="flex gap-4">
          {/* <Button
            variant={"link"}
            size={"lg"}
            className="rounded-md bg-white text-black! hover:no-underline"
          >
            <FileUpIcon className="w-4 h-4" />
            Exportar
          </Button> */}
          {/* <Button
            variant={undefined}
            size={"lg"}
            className="rounded-md bg-accent!"
          >
            <PlusIcon className="w-4 h-4" />
            Añadir nuevo Pek
          </Button> */}
        </div>
      </div>

      {statsLoading && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="flex rounded-md">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="flex rounded-md">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="flex rounded-md">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="flex rounded-md">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>
      )}
      {!statsLoading && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <MiniInsightCard
            title="Peks registrados"
            data={statsData?.guestsStats?.totalDogs || 0}
            mainIcon={PawPrintIcon}
            iconBackgroundColor="#F5F0E8"
            iconColor="#8B7355"
            iconFill="#8B7355"
          />
          <MiniInsightCard
            title="Check-In hoy"
            data={statsData?.guestsStats?.todayCheckedInDogs || 0}
            mainIcon={CheckIcon}
            iconBackgroundColor="#E4F0E4"
            iconColor="#4CAF50"
            iconFill="none"
          />
          <MiniInsightCard
            title="Vacunas vencidas"
            data={statsData?.guestsStats?.pastDueVaccines || 0}
            mainIcon={SyringeIcon}
            iconBackgroundColor="#FCE4E4"
            iconColor="#E57373"
            iconFill="none"
          />
          <MiniInsightCard
            title="NUEVOS ESTE MES"
            data={statsData?.guestsStats?.newDogsDuringMonth || 0}
            mainIcon={StarIcon}
            iconBackgroundColor="#EFF6FF"
            iconColor="#C5DAEF"
            iconFill="#C5DAEF"
          />
        </div>
      )}

      {/* Pet Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <PetCardSkeleton key={index} />
            ))
          : data?.companyDogs?.map((dog: Dog) => (
              <PetCard
                key={dog.id}
                dogId={dog.id || undefined}
                name={dog.name}
                breed={dog.breed}
                age={formatAgeFromBirthDate(dog.birthDate)}
                weight={`${dog.weight}kg`}
                sex={dog.gender || "Male"}
                imageUrl={dog.imageUrl || ""}
                ownerAvatarUrl={dog.owner?.profilePicture || ""}
              />
            ))}
      </div>
    </div>
  );
};

export default Guests;
