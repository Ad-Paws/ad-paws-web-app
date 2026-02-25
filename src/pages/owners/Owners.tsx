import MiniInsightCard from "@/components/Dashboard/MiniInsightCard";

import { Calculator, HeartPulse, UserPlus, UsersIcon } from "lucide-react";
import OwnersTable, { type Owner } from "./OwnersTable";
import { GET_OWNERS_QUERY } from "@/lib/api/user.api";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/contexts/AuthContext";

const Owners = () => {
  const { company } = useAuth();
  const { data, loading } = useQuery<{ companyDogOwners: Owner[] }>(
    GET_OWNERS_QUERY,
    {
      variables: { companyId: Number(company?.id) },
    },
  );

  const owners = data?.companyDogOwners ?? [];
  const activeOwners = owners.filter((o) => o.status === "ACTIVE").length;
  const totalDogs = owners.reduce((sum, o) => sum + o.dogs.length, 0);
  const avgDogsPerOwner =
    owners.length > 0 ? Math.round(totalDogs / owners.length) : 0;

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
            Añadir nuevo propietario
          </Button> */}
        </div>
      </div>

      {/* Mini Insight Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 flex-shrink-0">
        <MiniInsightCard
          title="Propietarios totales"
          data={loading ? "..." : owners.length.toLocaleString()}
          mainIcon={UsersIcon}
          iconBackgroundColor="#F5F0E8"
          iconColor="#8B7355"
          iconFill="#8B7355"
        />
        <MiniInsightCard
          title="Mascotas totales"
          data={loading ? "..." : totalDogs.toLocaleString()}
          mainIcon={UserPlus}
          iconBackgroundColor="#E4F0E4"
          iconColor="#4CAF50"
          iconFill="none"
        />
        <MiniInsightCard
          title="Promedio de Peks por propietario"
          data={loading ? "..." : avgDogsPerOwner.toString()}
          mainIcon={Calculator}
          iconBackgroundColor="#FCE4E4"
          iconColor="#E57373"
          iconFill="none"
        />
        <MiniInsightCard
          title="Propietarios activos"
          data={loading ? "..." : activeOwners.toLocaleString()}
          mainIcon={HeartPulse}
          iconBackgroundColor="#EFF6FF"
          iconColor="#C5DAEF"
          iconFill="#EFF6FF"
        />
      </div>

      {/* Owners Table */}
      <OwnersTable data={owners} />
    </div>
  );
};

export default Owners;
