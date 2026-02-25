import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useModal } from "@ebay/nice-modal-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { ServicePricingCard, type ServicePricing } from "@/components/Services";
import CreateServiceModal from "@/components/Dialog/CreateServiceModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  type Service,
  type ServiceType,
  type PricingUnit,
  SERVICES_BY_COMPANY_AND_TYPE,
} from "@/lib/api/services.api";

// Map tab values to ServiceType
const TAB_TO_SERVICE_TYPE: Record<string, ServiceType> = {
  boarding: "HOTEL",
  daycare: "DAYCARE",
  grooming: "GROOMING",
  training: "TRAINING",
};

// Map PricingUnit to price unit labels
const PRICING_UNIT_LABELS: Record<PricingUnit, string> = {
  HOURLY: "por hora",
  DAILY: "por día",
  NIGHTLY: "por noche",
  SESSION: "por sesión",
  PACKAGE: "paquete",
};

// Format duration in hours and minutes
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
};

// Generate service description based on pricingUnit
const getServiceDescription = (service: Service): string => {
  const { pricingUnit, duration, startTime, endTime } = service;

  switch (pricingUnit) {
    case "HOURLY":
      // Show duration in hours/minutes with time range
      return `${formatDuration(duration)} • ${startTime} - ${endTime}`;

    case "DAILY":
      // Full day service - show time range
      return `Día completo • ${startTime} - ${endTime}`;

    case "NIGHTLY":
      // Overnight service - show check-in/out times
      return `Check-in: ${startTime} • Check-out: ${endTime}`;

    case "SESSION":
      // Session-based - show duration
      return duration > 0
        ? `Duración: ${formatDuration(duration)}`
        : `${startTime} - ${endTime}`;

    case "PACKAGE":
      // Package - show what's included or duration if available
      return duration > 0
        ? `Incluye ${formatDuration(duration)}`
        : "Paquete completo";

    default:
      return `${startTime} - ${endTime}`;
  }
};

const transformService = (service: Service): ServicePricing => ({
  id: service.id,
  name: service.name,
  description: getServiceDescription(service),
  price: service.price,
  priceUnit: PRICING_UNIT_LABELS[service.pricingUnit],
  status: service.status,
  category: service.category,
});

interface ServiceTabContentProps {
  serviceType: ServiceType;
  companyId: number;
  onEdit: (service: ServicePricing) => void;
  onDelete: (service: ServicePricing) => void;
}

const ServiceTabContent = ({
  serviceType,
  companyId,
  onEdit,
  onDelete,
}: ServiceTabContentProps) => {
  const { data, loading, error } = useQuery<{
    servicesByCompanyAndType: Service[];
  }>(SERVICES_BY_COMPANY_AND_TYPE, {
    variables: {
      type: serviceType,
      companyId,
    },
    skip: !companyId,
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Error al cargar los servicios. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  const services = data?.servicesByCompanyAndType || [];

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No hay servicios configurados para esta categoría.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Crea tu primer servicio para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <ServicePricingCard
          key={service.id}
          service={transformService(service)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const Services = () => {
  const { company } = useAuth();
  const [activeTab, setActiveTab] = useState("daycare");
  const companyId = company?.id ? Number(company.id) : 0;

  const createServiceModal = useModal(CreateServiceModal);

  const handleEdit = (service: ServicePricing) => {
    console.log("Edit service:", service);
    // TODO: Open edit modal
  };

  const handleDelete = (service: ServicePricing) => {
    console.log("Delete service:", service);
    // TODO: Open delete confirmation
  };

  const handleCreateService = () => {
    createServiceModal.show({
      companyId,
      onSuccess: (service: Service) => {
        console.log("Service created:", service);
        // Switch to the tab of the created service type
        const tabMap: Record<ServiceType, string> = {
          HOTEL: "boarding",
          DAYCARE: "daycare",
          GROOMING: "grooming",
          TRAINING: "training",
        };
        setActiveTab(tabMap[service.type]);
      },
    });
  };

  return (
    <div className="h-full px-6 py-4 overflow-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary dark:text-secondary-foreground">
            Servicios y Precios
          </h1>
          <p className="text-muted-foreground mt-1">
            Configura tus servicios, paquetes y extras.
          </p>
        </div>
        <Button
          onClick={handleCreateService}
          className="bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white rounded-full px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent gap-4 mb-6 h-auto p-0">
          <TabsTrigger
            value="boarding"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Hotel / Estancias
          </TabsTrigger>
          <TabsTrigger
            value="daycare"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Guardería
          </TabsTrigger>
          <TabsTrigger
            value="grooming"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Estética
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
          >
            Entrenamiento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boarding" className="mt-0">
          <ServiceTabContent
            serviceType={TAB_TO_SERVICE_TYPE.boarding}
            companyId={companyId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="daycare" className="mt-0">
          <ServiceTabContent
            serviceType={TAB_TO_SERVICE_TYPE.daycare}
            companyId={companyId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="grooming" className="mt-0">
          <ServiceTabContent
            serviceType={TAB_TO_SERVICE_TYPE.grooming}
            companyId={companyId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="training" className="mt-0">
          <ServiceTabContent
            serviceType={TAB_TO_SERVICE_TYPE.training}
            companyId={companyId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Services;
