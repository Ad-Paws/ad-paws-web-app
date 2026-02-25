import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone } from "lucide-react";
import type { UserStatus } from "@/types/Dog";

export interface OwnerReservation {
  id: number;
  createdAt: string;
}

export interface OwnerDog {
  id: string;
  imageUrl: string | null;
  reservations: OwnerReservation[];
  breed: string;
  color: string;
  name: string;
  size: string;
  weight: number;
  gender: string;
  birthDate: string;
}

export interface Owner {
  id: string;
  profilePicture: string | null;
  email: string;
  phone: string;
  dogs: OwnerDog[];
  status: UserStatus;
}

interface OwnersTableProps {
  data: Owner[];
  onEdit?: (owner: Owner) => void;
  onDelete?: (owner: Owner) => void;
}

const getStatusStyles = (status: UserStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-[#E4F0E4] text-[#2E7D32]";
    case "INACTIVE":
      return "bg-[#F5F5F5] text-[#757575]";
    case "BLOCKED":
      return "bg-[#FFEBEE] text-[#C62828]";
    case "INCOMPLETE":
      return "bg-[#FFF8E1] text-[#F9A825] border border-[#F9A825]";
    case "DELETED":
      return "bg-[#FFCDD2] text-[#B71C1C]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getLastVisit = (dogs: OwnerDog[]): string => {
  const allReservations = dogs.flatMap((dog) => dog.reservations);
  if (allReservations.length === 0) return "Sin visitas";

  const mostRecent = allReservations.reduce((latest, current) =>
    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest,
  );

  return new Date(mostRecent.createdAt).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=8B7355&color=fff&name=";

const OwnersTable = ({ data }: OwnersTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-700 z-10">
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-6">
                Propietario
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Contacto
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Mascotas
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Estado
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Última visita
              </TableHead>
              {/* <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 text-center">
                Acciones
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((owner, index) => (
              <TableRow
                key={`${owner.id}-${index}`}
                className="border-b border-gray-50 dark:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-500/50"
              >
                {/* Owner */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          owner.profilePicture ||
                          `${DEFAULT_AVATAR}${encodeURIComponent(
                            owner.email.charAt(0).toUpperCase(),
                          )}`
                        }
                        alt={owner.email}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-[#8B7355]/20"
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          owner.status === "ACTIVE"
                            ? "bg-[#4CAF50]"
                            : "bg-[#9CA3AF]"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">
                        {owner.email}
                      </p>
                      <p className="text-sm text-[#9CA3AF] dark:text-gray-300">
                        ID: #{owner.id}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Contact Info */}
                <TableCell className="py-4 px-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-[#4B5563] dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300">
                      <Mail className="w-4 h-4 text-[#9CA3AF]" />
                      <span>{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4B5563] dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300">
                      <Phone className="w-4 h-4 text-[#9CA3AF]" />
                      <span>{owner.phone}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Dogs */}
                <TableCell className="py-4 px-4">
                  <div className="flex items-center">
                    {owner.dogs.length > 0 ? (
                      <>
                        <div className="flex -space-x-2">
                          {owner.dogs.slice(0, 3).map((dog) => (
                            <img
                              key={dog.id}
                              src={
                                dog.imageUrl ||
                                `https://ui-avatars.com/api/?background=D4C4B0&color=8B7355&name=🐕`
                              }
                              alt={`Dog ${dog.id}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-500"
                            />
                          ))}
                          {owner.dogs.length > 3 && (
                            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] dark:bg-gray-600 border-2 border-white dark:border-gray-500 flex items-center justify-center text-xs font-medium text-[#6B7280] dark:text-gray-300">
                              +{owner.dogs.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-[#4B5563] dark:text-gray-300">
                            {owner.dogs.length}{" "}
                            {owner.dogs.length === 1 ? "mascota" : "mascotas"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-[#9CA3AF] dark:text-gray-400">
                        Sin mascotas
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-4 px-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      owner.status,
                    )}`}
                  >
                    {owner.status}
                  </span>
                </TableCell>

                {/* Last Visit */}
                <TableCell className="py-4 px-4">
                  <span className="text-[#4B5563] dark:text-gray-300">
                    {getLastVisit(owner.dogs)}
                  </span>
                </TableCell>

                {/* Actions */}
                {/* <TableCell className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-gray-500/50 rounded-lg transition-colors group"
                      onClick={() => onEdit?.(owner)}
                    >
                      <SquarePen className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#6B7280]" />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/50 rounded-lg transition-colors group"
                      onClick={() => onDelete?.(owner)}
                    >
                      <Trash2 className="w-5 h-5 text-[#9CA3AF] group-hover:text-red-500" />
                    </button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OwnersTable;
