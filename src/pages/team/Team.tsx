import NiceModal from "@ebay/nice-modal-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { UserPlusIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  GET_COMPANY_EMPLOYEES,
  REMOVE_EMPLOYEE_MUTATION,
} from "@/lib/api/user.api";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import AddEmployeeModal from "@/components/Dialog/AddEmployeeModal";
import TeamTable, { type Employee } from "./TeamTable";

export default function Team() {
  const { company } = useAuth();
  const companyId = company?.id ? parseInt(company.id, 10) : null;

  const { data, loading } = useQuery<{ companyEmployees: Employee[] }>(
    GET_COMPANY_EMPLOYEES,
    {
      variables: { companyId },
      skip: !companyId,
      fetchPolicy: "network-only",
    },
  );

  const [removeEmployee, { loading: removing }] = useMutation(
    REMOVE_EMPLOYEE_MUTATION,
    {
      onCompleted: () => {
        showToast.success(
          "Miembro eliminado",
          "El colaborador fue removido del equipo.",
        );
      },
      onError: (err) => showToast.error("No se pudo eliminar", err.message),
      refetchQueries: [
        {
          query: GET_COMPANY_EMPLOYEES,
          variables: { companyId },
        },
      ],
    },
  );

  const employees = data?.companyEmployees ?? [];

  const handleAddEmployee = () => {
    if (!companyId) return;
    NiceModal.show(AddEmployeeModal, { companyId });
  };

  const handleRemove = (userId: string) => {
    removeEmployee({ variables: { userId: parseInt(userId, 10) } });
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | Equipo</title>
      </Helmet>
      <div className="h-full flex flex-col px-6 py-6 gap-4 overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-2xl font-bold">Equipo</p>
            <p className="text-[#6B7280] mt-1">
              Gestiona la creación de miembros de tu equipo.
            </p>
          </div>
          <Button onClick={handleAddEmployee}>
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Agregar miembro
          </Button>
        </div>

        {/* Table */}
        <TeamTable
          employees={employees}
          loading={loading}
          removing={removing}
          onRemove={handleRemove}
        />
      </div>
    </>
  );
}
