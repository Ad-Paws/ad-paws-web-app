import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, SquarePen, Trash2 } from "lucide-react";

export type OwnerStatus = "Active" | "Pending Payment" | "Inactive";

export interface Pet {
  name: string;
  breed: string;
  imageUrl: string;
}

export interface Owner {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  phone: string;
  pets: Pet[];
  status: OwnerStatus;
  lastVisit: string;
}

interface OwnersTableProps {
  data: Owner[];
  onEdit?: (owner: Owner) => void;
  onDelete?: (owner: Owner) => void;
}

const getStatusStyles = (status: OwnerStatus) => {
  switch (status) {
    case "Active":
      return "bg-[#E4F0E4] text-[#2E7D32]";
    case "Pending Payment":
      return "bg-[#FFF8E1] text-[#F9A825] border border-[#F9A825]";
    case "Inactive":
      return "bg-[#F5F5F5] text-[#757575]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const OwnersTable = ({ data, onEdit, onDelete }: OwnersTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-700 z-10">
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-6">
                Owner Name
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Contact Info
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Pets
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Status
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4">
                Last Visit
              </TableHead>
              <TableHead className="text-xs text-[#6B7280] dark:text-gray-100 font-medium uppercase tracking-wider py-4 px-4 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((owner, index) => (
              <TableRow
                key={`${owner.id}-${index}`}
                className="border-b border-gray-50 dark:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-500/50"
              >
                {/* Owner Name */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={owner.avatarUrl}
                        alt={owner.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-[#8B7355]/20"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">
                        {owner.name}
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

                {/* Pets */}
                <TableCell className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {owner.pets.map((pet, petIndex) => (
                        <img
                          key={petIndex}
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-500"
                        />
                      ))}
                      {/* {owner.pets.length > 1 && (
                        <div className="w-10 h-10 rounded-full bg-[#F3F4F6] border-2 border-white flex items-center justify-center text-xs font-medium text-[#6B7280]">
                          +
                        </div>
                      )} */}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-[#4B5563] dark:text-gray-300">
                        {owner.pets.map((p) => p.name).join(", ")}
                        {owner.pets.length === 1 && ` (${owner.pets[0].breed})`}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-4 px-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      owner.status
                    )}`}
                  >
                    {owner.status}
                  </span>
                </TableCell>

                {/* Last Visit */}
                <TableCell className="py-4 px-4">
                  <span className="text-[#4B5563] dark:text-gray-300">
                    {owner.lastVisit}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-4 px-4">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OwnersTable;
