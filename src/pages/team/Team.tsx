import { useMemo } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { UserPlusIcon } from "lucide-react";
import {
  COMPANY_MEMBERS_QUERY,
  REVOKE_MEMBERSHIP_MUTATION,
} from "@/graphql/operations/team";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import AddEmployeeModal from "@/components/Dialog/AddEmployeeModal";
import TeamTable, { type Employee } from "./TeamTable";

export default function Team() {
  // El rol vive en la membresía (por compañía); la compañía sale del contexto.
  const { data, loading } = useQuery(COMPANY_MEMBERS_QUERY, {
    fetchPolicy: "network-only",
  });

  const [revokeMembership, { loading: removing }] = useMutation(
    REVOKE_MEMBERSHIP_MUTATION,
    {
      onCompleted: () => {
        showToast.success(
          "Miembro eliminado",
          "El colaborador fue removido del equipo.",
        );
      },
      onError: (err) => showToast.error("No se pudo eliminar", err.message),
      refetchQueries: [COMPANY_MEMBERS_QUERY],
    },
  );

  const employees = useMemo<Employee[]>(
    () =>
      (data?.companyMembers ?? [])
        .filter((membership) => membership.status === "ACTIVE")
        .filter((membership) => membership.role !== "CLIENT")
        .map((membership) => ({
          id: membership.user.id,
          name: membership.user.name ?? null,
          lastname: membership.user.lastname ?? null,
          email: membership.user.email,
          phone: membership.user.phone ?? null,
          role: membership.role,
          status: membership.status,
          profilePicture: membership.user.profilePicture ?? null,
        })),
    [data?.companyMembers],
  );

  const handleAddEmployee = () => {
    NiceModal.show(AddEmployeeModal, {});
  };

  const handleRemove = (userId: string) => {
    // revokeMembership exige el rol exacto de la membresía a revocar.
    const employee = employees.find((e) => e.id === userId);
    if (!employee) return;
    revokeMembership({
      variables: {
        userId,
        role: employee.role as "OWNER" | "ADMIN" | "STAFF" | "CLIENT",
      },
    });
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
