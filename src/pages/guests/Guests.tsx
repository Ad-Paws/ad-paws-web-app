import { useState } from "react";
import MiniInsightCard from "@/components/Dashboard/MiniInsightCard";
import PetCard from "@/components/PetCard";
import {
  CheckIcon,
  PawPrintIcon,
  StarIcon,
  SyringeIcon,
  Grid3x3,
  List,
} from "lucide-react";
import { COMPANY_DOGS } from "@/lib/api/dogs.api";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@apollo/client/react";
import type { Dog } from "@/types/Dog";
import PetCardSkeleton from "@/components/PetCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_GUEST_STATS } from "@/lib/api/stats.api";
import type { GuestsStats } from "@/types/Stats";
import { formatAgeFromBirthDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GuestListView from "./components/GuestListView";

type ViewMode = "grid" | "list";

const Guests = () => {
  const { company } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

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
          <p className="text-2xl font-bold">Gestión de Peks</p>
          <p className="text-[#6B7280] mt-1">
            Edita perfiles, reportes médicos y más.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
              aria-label="Vista de lista"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
              aria-label="Vista de cuadrícula"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
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

      {/* Pet Cards Grid / List View */}
      {viewMode === "grid" ? (
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
      ) : (
        <GuestListView dogs={data?.companyDogs || []} loading={loading} />
      )}
    </div>
  );
};

export default Guests;
