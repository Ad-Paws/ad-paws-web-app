import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useModal } from "@ebay/nice-modal-react";
import { AlertCircle, PackageIcon, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CreatePackageModal from "@/components/Dialog/CreatePackageModal";
import SellPackageModal from "@/components/Dialog/SellPackageModal";
import { DogSelector } from "@/components/Dialog/CheckInDialog/components";
import {
  CANCEL_DOG_PACKAGE_MUTATION,
  DEACTIVATE_PACKAGE_MUTATION,
  DOG_PACKAGES_QUERY,
  PACKAGES_QUERY,
  RENEW_DOG_PACKAGE_MUTATION,
} from "@/graphql/operations/packages";
import { DOGS_QUERY } from "@/graphql/operations/dogs";
import { showToast } from "@/lib/toast";
import type { PackagesQuery, DogPackagesQuery } from "@/gql/graphql";
import { PackageTemplateCard } from "./components/PackageTemplateCard";
import { DogPackageCard } from "./components/DogPackageCard";

type PackageTemplate = PackagesQuery["packages"][number];
type DogPackage = DogPackagesQuery["dogPackages"][number];

/**
 * Administración de paquetes.
 *
 * Dos pestañas porque son dos objetos distintos: el CATÁLOGO son las plantillas
 * que la empresa vende, y los VENDIDOS son instancias con saldo propio. Editar
 * una plantilla no cambia lo ya vendido — el `daysMask` y el cupo se copian en
 * la compra — así que mezclarlas en una sola vista invitaría justo al error de
 * creer que sí.
 *
 * La pestaña de vendidos exige elegir un perro: el backend expone
 * `dogPackages(dogId:)` y no hay una query "todos los paquetes de la empresa",
 * que sería cara y sin caso de uso claro.
 */
const Packages = () => {
  const [activeTab, setActiveTab] = useState("catalogo");
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const createPackageModal = useModal(CreatePackageModal);
  const sellPackageModal = useModal(SellPackageModal);

  return (
    <div className="h-full px-6 py-4 overflow-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary dark:text-secondary-foreground">
            Paquetes
          </h1>
          <p className="text-muted-foreground mt-1">
            Define lo que incluye cada paquete y administra los que ya vendiste.
          </p>
        </div>
        <Button
          onClick={() => createPackageModal.show({})}
          className="bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white rounded-full px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Paquete
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent gap-4 mb-6 h-auto p-0">
          <TabsTrigger
            value="catalogo"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Catálogo
          </TabsTrigger>
          <TabsTrigger
            value="vendidos"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Paquetes vendidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo" className="mt-0">
          <CatalogTab
            onSell={(template) => sellPackageModal.show({ template })}
          />
        </TabsContent>

        <TabsContent value="vendidos" className="mt-0">
          <SoldTab
            selectedDogId={selectedDogId}
            onSelectDog={setSelectedDogId}
            renewingId={renewingId}
            setRenewingId={setRenewingId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

const CatalogTab = ({
  onSell,
}: {
  onSell: (template: PackageTemplate) => void;
}) => {
  const { data, loading, error } = useQuery(PACKAGES_QUERY, {
    variables: { activeOnly: true },
  });

  const [deactivatePackage] = useMutation(DEACTIVATE_PACKAGE_MUTATION, {
    refetchQueries: [
      { query: PACKAGES_QUERY, variables: { activeOnly: true } },
    ],
  });

  const handleDeactivate = async (template: PackageTemplate) => {
    // Baja lógica: deja de venderse, los ya vendidos siguen vigentes. Vale la
    // pena decirlo porque "desactivar" suena a que se cancela todo.
    const confirmed = window.confirm(
      `¿Dejar de vender "${template.name}"?\n\nLos paquetes ya vendidos conservan sus saldos y siguen funcionando.`,
    );
    if (!confirmed) return;

    try {
      await deactivatePackage({ variables: { id: template.id } });
      showToast.success("Paquete desactivado", "Ya no aparecerá para vender.");
    } catch (err) {
      showToast.error(
        "No se pudo desactivar",
        err instanceof Error ? err.message : undefined,
      );
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="dark:bg-gray-700 h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Error al cargar los paquetes." />;
  }

  const templates = data?.packages ?? [];

  if (templates.length === 0) {
    return (
      <EmptyState
        title="Aún no hay paquetes"
        hint="Crea uno para poder vender guardería, noches o extras por adelantado."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {templates.map((template) => (
        <PackageTemplateCard
          key={template.id}
          template={template}
          onSell={onSell}
          onDeactivate={handleDeactivate}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Vendidos
// ---------------------------------------------------------------------------

interface SoldTabProps {
  selectedDogId: string | null;
  onSelectDog: (dogId: string) => void;
  renewingId: string | null;
  setRenewingId: (id: string | null) => void;
}

const SoldTab = ({
  selectedDogId,
  onSelectDog,
  renewingId,
  setRenewingId,
}: SoldTabProps) => {
  const { data: dogsData } = useQuery(DOGS_QUERY, {
    variables: { first: 100 },
  });

  const { data, loading, error } = useQuery(DOG_PACKAGES_QUERY, {
    // activeOnly falso: la historia importa. Un paquete agotado o vencido es
    // justo el que hay que renovar, y ocultarlo dejaría la acción inalcanzable.
    variables: { dogId: selectedDogId ?? "", activeOnly: false },
    skip: !selectedDogId,
  });

  const refetchQueries = [
    {
      query: DOG_PACKAGES_QUERY,
      variables: { dogId: selectedDogId ?? "", activeOnly: false },
    },
  ];

  const [renewDogPackage] = useMutation(RENEW_DOG_PACKAGE_MUTATION, {
    refetchQueries,
  });
  const [cancelDogPackage] = useMutation(CANCEL_DOG_PACKAGE_MUTATION, {
    refetchQueries,
  });

  const dogs = (dogsData?.dogs ?? []).map((dog) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed ?? "",
    imageUrl: dog.imageUrl ?? undefined,
    owner: dog.primaryOwner
      ? {
          name: dog.primaryOwner.name ?? undefined,
          lastname: dog.primaryOwner.lastname ?? undefined,
        }
      : undefined,
  }));

  const handleRenew = async (dogPackage: DogPackage) => {
    setRenewingId(dogPackage.id);
    try {
      const result = await renewDogPackage({
        variables: { id: dogPackage.id, markPaid: false },
      });
      if (result.data?.renewDogPackage) {
        // Renovar crea OTRO paquete: por eso el mensaje habla de un ciclo
        // nuevo y no de una actualización del anterior.
        showToast.success(
          "Paquete renovado",
          "Se creó un ciclo nuevo con saldos frescos. El cobro quedó pendiente.",
        );
      }
    } catch (err) {
      showToast.error(
        "No se pudo renovar",
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setRenewingId(null);
    }
  };

  const handleCancel = async (dogPackage: DogPackage) => {
    const reason = window.prompt(
      `¿Cancelar "${dogPackage.package.name}"?\n\nMotivo (queda en el historial):`,
    );
    if (reason === null) return;

    try {
      await cancelDogPackage({
        variables: { id: dogPackage.id, reason: reason || null },
      });
      showToast.success("Paquete cancelado");
    } catch (err) {
      showToast.error(
        "No se pudo cancelar",
        err instanceof Error ? err.message : undefined,
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Selecciona un alumno para ver sus paquetes
        </p>
        <DogSelector
          dogs={dogs}
          selectedDogId={selectedDogId}
          onSelect={onSelectDog}
        />
      </div>

      {!selectedDogId ? (
        <EmptyState
          title="Elige un alumno"
          hint="Los saldos pertenecen a cada perro, así que hay que elegir uno."
        />
      ) : loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="dark:bg-gray-700 h-48 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message="Error al cargar los paquetes del alumno." />
      ) : (data?.dogPackages ?? []).length === 0 ? (
        <EmptyState
          title="Este alumno no tiene paquetes"
          hint="Puedes venderle uno desde la pestaña de catálogo."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data!.dogPackages.map((dogPackage) => (
            <DogPackageCard
              key={dogPackage.id}
              dogPackage={dogPackage}
              onRenew={handleRenew}
              onCancel={handleCancel}
              renewing={renewingId === dogPackage.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------

const EmptyState = ({ title, hint }: { title: string; hint: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <PackageIcon className="w-10 h-10 text-gray-300 mb-3" />
    <p className="text-foreground">{title}</p>
    <p className="text-sm text-muted-foreground mt-1">{hint}</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default Packages;
