import { UserXIcon, UserPlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Employee {
  id: string;
  name: string | null;
  lastname: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  profilePicture: string | null;
}

interface TeamTableProps {
  employees: Employee[];
  loading: boolean;
  removing: boolean;
  onRemove: (userId: string) => void;
}

function EmployeeAvatar({
  name,
  lastname,
}: {
  name?: string | null;
  lastname?: string | null;
}) {
  const initials =
    [name?.[0], lastname?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  return (
    <div className="w-10 h-10 rounded-full bg-[#8B7355]/20 flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-[#8B7355]">{initials}</span>
    </div>
  );
}

const TeamTableSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <TableRow
        key={i}
        className="border-b border-gray-50 dark:border-gray-500"
      >
        <TableCell className="py-4 px-6">
          <Skeleton className="w-10 h-10 rounded-full" />
        </TableCell>
        <TableCell className="py-4 px-4">
          <Skeleton className="w-32 h-5 mb-1" />
          <Skeleton className="w-24 h-4" />
        </TableCell>
        <TableCell className="py-4 px-4">
          <Skeleton className="w-40 h-5" />
        </TableCell>
        <TableCell className="py-4 px-4">
          <Skeleton className="w-24 h-5" />
        </TableCell>
        <TableCell className="py-4 px-4">
          <Skeleton className="w-8 h-8 rounded-lg mx-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const TeamTable = ({
  employees,
  loading,
  removing,
  onRemove,
}: TeamTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-6 sticky top-0 bg-white dark:bg-gray-700 z-10">
                Avatar
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 sticky top-0 bg-white dark:bg-gray-700 z-10">
                Nombre
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 sticky top-0 bg-white dark:bg-gray-700 z-10">
                Correo
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 sticky top-0 bg-white dark:bg-gray-700 z-10">
                Teléfono
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 text-center sticky top-0 bg-white dark:bg-gray-700 z-10">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TeamTableSkeleton />
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#F3F4F6] dark:bg-gray-600 flex items-center justify-center">
                      <UserPlusIcon className="w-7 h-7 text-[#9CA3AF]" />
                    </div>
                    <p className="text-[#9CA3AF] dark:text-gray-400">
                      No hay miembros en el equipo
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="border-b border-gray-50 dark:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-500/50"
                >
                  <TableCell className="py-4 px-6">
                    <EmployeeAvatar name={emp.name} lastname={emp.lastname} />
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <p className="font-semibold text-[#1F2937] dark:text-white">
                      {emp.name || emp.lastname
                        ? [emp.name, emp.lastname].filter(Boolean).join(" ")
                        : "Sin nombre"}
                    </p>
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <span className="text-[#4B5563] dark:text-gray-300">
                      {emp.email}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <span className="text-[#4B5563] dark:text-gray-300">
                      {emp.phone ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <button
                        className="p-2 hover:bg-[#FEE2E2] dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                        disabled={removing}
                        onClick={() => onRemove(emp.id)}
                        aria-label="Eliminar miembro"
                      >
                        <UserXIcon className="w-5 h-5 text-[#9CA3AF] group-hover:text-red-500" />
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

export default TeamTable;
