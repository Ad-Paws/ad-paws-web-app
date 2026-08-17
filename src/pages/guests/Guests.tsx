import { useMemo, useState } from "react";
import MiniInsightCard from "@/components/Dashboard/MiniInsightCard";
import PetCard from "@/components/PetCard";
import {
  CalendarClock,
  CheckIcon,
  PawPrintIcon,
  StarIcon,
  Grid3x3,
  List,
} from "lucide-react";
import { DOGS_QUERY } from "@/graphql/operations/dogs";
import { GUEST_STATS_QUERY } from "@/graphql/operations/stats";
import { mapDogToLegacy } from "@/utils/adapters";
import { useQuery } from "@apollo/client/react";
import PetCardSkeleton from "@/components/PetCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAgeFromBirthDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GuestListView from "./components/GuestListView";

type ViewMode = "grid" | "list";

const Guests = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, loading } = useQuery(DOGS_QUERY, {
    variables: { first: 50 },
  });
  const { data: statsData, loading: statsLoading } =
    useQuery(GUEST_STATS_QUERY);

  const dogs = useMemo(
    () => (data?.dogs ?? []).map(mapDogToLegacy),
    [data?.dogs],
  );
  const stats = statsData?.guestStats;

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
            data={stats?.totalDogs || 0}
            mainIcon={PawPrintIcon}
            iconBackgroundColor="#F5F0E8"
            iconColor="#8B7355"
            iconFill="#8B7355"
          />
          <MiniInsightCard
            title="En instalaciones"
            data={stats?.checkedInNow || 0}
            mainIcon={CheckIcon}
            iconBackgroundColor="#E4F0E4"
            iconColor="#4CAF50"
            iconFill="none"
          />
          {/* "Vacunas vencidas" se retiró: el backend eliminó pastDueVaccines
              (no existe modelo de vacunas todavía). */}
          <MiniInsightCard
            title="Llegadas hoy"
            data={stats?.arrivingToday || 0}
            mainIcon={CalendarClock}
            iconBackgroundColor="#FCE4E4"
            iconColor="#E57373"
            iconFill="none"
          />
          <MiniInsightCard
            title="NUEVOS ESTE MES"
            data={stats?.newDogsThisMonth || 0}
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
            : dogs.map((dog) => (
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
        <GuestListView dogs={dogs} loading={loading} />
      )}
    </div>
  );
};

export default Guests;
