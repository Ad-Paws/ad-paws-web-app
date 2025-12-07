import MiniInsightCard from "@/components/Dashboard/MiniInsightCard";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  FileUpIcon,
  HeartPulse,
  PlusIcon,
  UserPlus,
  UsersIcon,
} from "lucide-react";
import OwnersTable, { type Owner } from "./OwnersTable";

const ownersData: Owner[] = [
  {
    id: "OW-8291",
    name: "Emily Wilson",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    email: "emily.w@example.com",
    phone: "(555) 123-4567",
    pets: [
      {
        name: "Cooper",
        breed: "Golden Retriever",
        imageUrl:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
      },
    ],
    status: "Active",
    lastVisit: "Oct 24, 2023",
  },
  {
    id: "OW-8292",
    name: "Mark Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    email: "mark.j@example.com",
    phone: "(555) 987-6543",
    pets: [
      {
        name: "Daisy",
        breed: "Cat",
        imageUrl:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
      },
      {
        name: "Buddy",
        breed: "Golden Retriever",
        imageUrl:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
      },
    ],
    status: "Active",
    lastVisit: "Nov 12, 2023",
  },
  {
    id: "OW-8293",
    name: "Lisa Ray",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    email: "lisa.ray@example.com",
    phone: "(555) 222-3333",
    pets: [
      {
        name: "Max",
        breed: "Bulldog",
        imageUrl:
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&h=100&fit=crop",
      },
    ],
    status: "Pending Payment",
    lastVisit: "Yesterday",
  },
  {
    id: "OW-8294",
    name: "Tom Baker",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    email: "tom.b@example.com",
    phone: "(555) 444-5555",
    pets: [
      {
        name: "Luna",
        breed: "Border Collie",
        imageUrl:
          "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=100&h=100&fit=crop",
      },
    ],
    status: "Inactive",
    lastVisit: "Aug 15, 2023",
  },
  {
    id: "OW-8295",
    name: "Emily Wilson",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    email: "emily.w@example.com",
    phone: "(555) 123-4567",
    pets: [
      {
        name: "Cooper",
        breed: "Golden Retriever",
        imageUrl:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
      },
    ],
    status: "Active",
    lastVisit: "Oct 24, 2023",
  },
  {
    id: "OW-8296",
    name: "Mark Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    email: "mark.j@example.com",
    phone: "(555) 987-6543",
    pets: [
      {
        name: "Daisy",
        breed: "Cat",
        imageUrl:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
      },
      {
        name: "Buddy",
        breed: "Golden Retriever",
        imageUrl:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
      },
    ],
    status: "Active",
    lastVisit: "Nov 12, 2023",
  },
  {
    id: "OW-8297",
    name: "Lisa Ray",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    email: "lisa.ray@example.com",
    phone: "(555) 222-3333",
    pets: [
      {
        name: "Max",
        breed: "Bulldog",
        imageUrl:
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&h=100&fit=crop",
      },
    ],
    status: "Pending Payment",
    lastVisit: "Yesterday",
  },
  {
    id: "OW-8298",
    name: "Tom Baker",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    email: "tom.b@example.com",
    phone: "(555) 444-5555",
    pets: [
      {
        name: "Luna",
        breed: "Border Collie",
        imageUrl:
          "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=100&h=100&fit=crop",
      },
    ],
    status: "Inactive",
    lastVisit: "Aug 15, 2023",
  },
  {
    id: "OW-8299",
    name: "Emily Wilson",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    email: "emily.w@example.com",
    phone: "(555) 123-4567",
    pets: [
      {
        name: "Cooper",
        breed: "Golden Retriever",
        imageUrl:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
      },
    ],
    status: "Active",
    lastVisit: "Oct 24, 2023",
  },
  {
    id: "OW-8300",
    name: "Mark Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    email: "mark.j@example.com",
    phone: "(555) 987-6543",
    pets: [
      {
        name: "Daisy",
        breed: "Cat",
        imageUrl:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
      },
      {
        name: "Buddy",
        breed: "Golden Retriever",
        imageUrl:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
      },
    ],
    status: "Active",
    lastVisit: "Nov 12, 2023",
  },
  {
    id: "OW-8301",
    name: "Lisa Ray",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    email: "lisa.ray@example.com",
    phone: "(555) 222-3333",
    pets: [
      {
        name: "Max",
        breed: "Bulldog",
        imageUrl:
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&h=100&fit=crop",
      },
    ],
    status: "Pending Payment",
    lastVisit: "Yesterday",
  },
  {
    id: "OW-8302",
    name: "Tom Baker",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    email: "tom.b@example.com",
    phone: "(555) 444-5555",
    pets: [
      {
        name: "Luna",
        breed: "Border Collie",
        imageUrl:
          "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=100&h=100&fit=crop",
      },
    ],
    status: "Inactive",
    lastVisit: "Aug 15, 2023",
  },
];

const Owners = () => {
  return (
    <div className="h-full px-6 py-4 overflow-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <div>
          <p className="text-2xl font-bold">Directorio de propietarios</p>
          <p className="text-[#6B7280] mt-1">
            Gestiona la creación de propietarios y asignación a Peks.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant={"link"}
            size={"lg"}
            className="rounded-md bg-white text-black! hover:no-underline"
          >
            <FileUpIcon className="w-4 h-4" />
            Exportar
          </Button>
          <Button
            variant={undefined}
            size={"lg"}
            className="rounded-md bg-accent!"
          >
            <PlusIcon className="w-4 h-4" />
            Añadir nuevo propietario
          </Button>
        </div>
      </div>

      {/* Mini Insight Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 flex-shrink-0">
        <MiniInsightCard
          title="Propietarios totales"
          data="1,248"
          mainIcon={UsersIcon}
          iconBackgroundColor="#F5F0E8"
          iconColor="#8B7355"
          iconFill="#8B7355"
        />
        <MiniInsightCard
          title="Propietarios nuevos este mes"
          data="24"
          mainIcon={UserPlus}
          iconBackgroundColor="#E4F0E4"
          iconColor="#4CAF50"
          iconFill="none"
        />
        <MiniInsightCard
          title="Promedio de Peks por propietario"
          data="8"
          mainIcon={Calculator}
          iconBackgroundColor="#FCE4E4"
          iconColor="#E57373"
          iconFill="none"
        />
        <MiniInsightCard
          title="Propietarios activos"
          data="15"
          mainIcon={HeartPulse}
          iconBackgroundColor="#EFF6FF"
          iconColor="#C5DAEF"
          iconFill="#EFF6FF"
        />
      </div>

      {/* Owners Table */}
      <OwnersTable data={ownersData} />
    </div>
  );
};

export default Owners;
