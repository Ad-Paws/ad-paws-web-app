import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, SquarePen, MarsIcon, VenusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Dog, Gender } from "@/types/Dog";
import { formatAgeFromBirthDate, DOG_BREEDS } from "@/lib/utils";
import noPhotoDog from "@/assets/no_photo_dog.png";
import { Skeleton } from "@/components/ui/skeleton";

interface GuestListViewProps {
  dogs: Dog[];
  loading?: boolean;
}

const SexIcon: React.FC<{ sex: Gender }> = ({ sex }) => {
  if (sex === "Male") {
    return <MarsIcon className="w-5 h-5" stroke="#60A5AD" />;
  }
  return <VenusIcon className="w-5 h-5" stroke="#E57399" />;
};

const DEFAULT_OWNER_AVATAR =
  "https://ui-avatars.com/api/?background=8B7355&color=fff&name=O";

const GuestListViewSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="border-b border-gray-50 dark:border-gray-500">
          <TableCell className="py-4 px-6">
            <Skeleton className="w-12 h-12 rounded-full" />
          </TableCell>
          <TableCell className="py-4 px-4">
            <Skeleton className="w-32 h-5 mb-1" />
            <Skeleton className="w-24 h-4" />
          </TableCell>
          <TableCell className="py-4 px-4">
            <Skeleton className="w-16 h-5" />
          </TableCell>
          <TableCell className="py-4 px-4">
            <Skeleton className="w-16 h-5" />
          </TableCell>
          <TableCell className="py-4 px-4">
            <Skeleton className="w-8 h-8 mx-auto" />
          </TableCell>
          <TableCell className="py-4 px-4">
            <Skeleton className="w-10 h-10 rounded-full" />
          </TableCell>
          <TableCell className="py-4 px-4">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const GuestListView: React.FC<GuestListViewProps> = ({ dogs, loading }) => {
  const navigate = useNavigate();

  const handleViewProfile = (dogId?: string | null) => {
    if (dogId) {
      navigate(`/visitantes-perrunos/${dogId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-700 z-10">
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-6">
                Avatar
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Nombre
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Edad
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Peso
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 text-center">
                Sexo
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Propietario
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 text-center">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <GuestListViewSkeleton />
            ) : dogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img
                      src={noPhotoDog}
                      alt="No dogs"
                      className="w-24 h-24 opacity-50"
                    />
                    <p className="text-[#9CA3AF] dark:text-gray-400">
                      No hay peks registrados
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              dogs.map((dog, index) => (
                <TableRow
                  key={`${dog.id}-${index}`}
                  className="border-b border-gray-50 dark:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-500/50 cursor-pointer"
                  onClick={() => handleViewProfile(dog.id)}
                >
                  {/* Dog Avatar */}
                  <TableCell className="py-4 px-6">
                    <div className="relative">
                      <img
                        src={dog.imageUrl || noPhotoDog}
                        alt={dog.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-[#8B7355]/20"
                      />
                    </div>
                  </TableCell>

                  {/* Name & Breed */}
                  <TableCell className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">
                        {dog.name}
                      </p>
                      <p className="text-sm text-[#9CA3AF] dark:text-gray-300">
                        {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ||
                          dog.breed}
                      </p>
                    </div>
                  </TableCell>

                  {/* Age */}
                  <TableCell className="py-4 px-4">
                    <span className="text-[#4B5563] dark:text-gray-300">
                      {formatAgeFromBirthDate(dog.birthDate)}
                    </span>
                  </TableCell>

                  {/* Weight */}
                  <TableCell className="py-4 px-4">
                    <span className="text-[#4B5563] dark:text-gray-300">
                      {dog.weight ? `${dog.weight}kg` : "S/D"}
                    </span>
                  </TableCell>

                  {/* Sex */}
                  <TableCell className="py-4 px-4">
                    <div className="flex justify-center">
                      <SexIcon sex={dog.gender || "Male"} />
                    </div>
                  </TableCell>

                  {/* Owner Avatar */}
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <img
                        src={dog.owner?.profilePicture || DEFAULT_OWNER_AVATAR}
                        alt="Owner"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-[#8B7355]/20"
                      />
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-gray-500/50 rounded-lg transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(dog.id);
                        }}
                        aria-label="Ver perfil"
                      >
                        <Eye className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#6B7280]" />
                      </button>
                      <button
                        className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-gray-500/50 rounded-lg transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Placeholder for future edit functionality
                        }}
                        aria-label="Editar"
                      >
                        <SquarePen className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#6B7280]" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GuestListView;
