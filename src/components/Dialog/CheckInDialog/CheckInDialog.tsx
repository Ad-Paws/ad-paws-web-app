import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useQuery } from "@apollo/client/react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { SERVICES_BY_COMPANY, type Service } from "@/lib/api/services.api";
import { COMPANY_DOGS } from "@/lib/api/dogs.api";
import { SERVICE_TYPE_CONFIG } from "./constants";
import { ServiceTypeCard } from "./components";
import { DaycareForm, HotelForm } from "./forms";
import type { Reservation } from "@/lib/api/reservations.api";
import type { ServiceType, Dog } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(() => {
  const modal = useModal();
  const { company } = useAuth();
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);

  // Fetch services for the company
  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useQuery<{ servicesByCompany: Service[] }>(SERVICES_BY_COMPANY, {
    variables: {
      input: {
        companyId: company?.id ? Number(company.id) : 0,
        active: true,
      },
    },
    skip: !company?.id,
  });

  // Fetch dogs for the company
  const {
    data: dogsData,
    loading: dogsLoading,
    error: dogsError,
  } = useQuery<{ companyDogs: Dog[] }>(COMPANY_DOGS, {
    variables: {
      companyId: company?.id ? Number(company.id) : 0,
    },
    skip: !company?.id,
  });

  // Get unique service types that are available (only from MAIN category services)
  const availableServiceTypes = servicesData?.servicesByCompany
    ? ([
        ...new Set(
          servicesData.servicesByCompany
            .filter((s) => s.category === "MAIN")
            .map((s) => s.type)
        ),
      ] as ServiceType[])
    : [];

  // Get MAIN services for the selected type
  const mainServicesForSelectedType =
    servicesData?.servicesByCompany?.filter(
      (s) => s.type === selectedServiceType && s.category === "MAIN"
    ) || [];

  // Get ADDON services for the selected type
  const addonServicesForSelectedType =
    servicesData?.servicesByCompany?.filter(
      (s) => s.type === selectedServiceType && s.category === "ADDON"
    ) || [];

  // Get dogs list
  const dogs = dogsData?.companyDogs || [];

  const loading = servicesLoading || dogsLoading;
  const error = servicesError || dogsError;

  const handleCancel = () => {
    modal.hide();
    setSelectedServiceType(null);
  };

  const handleBack = () => {
    setSelectedServiceType(null);
  };

  const handleServiceTypeSelect = (type: ServiceType) => {
    setSelectedServiceType(type);
  };

  const handleSuccess = (reservation: Reservation) => {
    console.log("Reservation created:", reservation);
    // TODO: Show success toast/notification
    modal.hide();
    setSelectedServiceType(null);
  };

  // Render the appropriate form based on selected service type
  const renderServiceForm = () => {
    switch (selectedServiceType) {
      case "DAYCARE":
        return (
          <DaycareForm
            services={mainServicesForSelectedType}
            addonServices={addonServicesForSelectedType}
            dogs={dogs}
            companyId={company?.id ? Number(company.id) : 0}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      case "HOTEL":
        return (
          <HotelForm
            services={mainServicesForSelectedType}
            addonServices={addonServicesForSelectedType}
            dogs={dogs}
            companyId={company?.id ? Number(company.id) : 0}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
      case "TRAINING":
        // TODO: Implement TrainingForm
        return (
          <div className="py-8 text-center text-gray-500">
            Training form coming soon...
          </div>
        );
      case "GROOMING":
        // TODO: Implement GroomingForm
        return (
          <div className="py-8 text-center text-gray-500">
            Grooming form coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    if (!selectedServiceType) {
      return "Nuevo Check-in";
    }
    return `Check-in - ${SERVICE_TYPE_CONFIG[selectedServiceType].title}`;
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      <DialogContent
        className="bg-white dark:bg-gray-800 max-w-xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            {selectedServiceType && (
              <button
                type="button"
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <DialogTitle className="text-xl font-semibold">
              {getDialogTitle()}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 pt-2">
            <div>
              <Skeleton className="h-4 w-48 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Error al cargar los datos. Por favor intenta de nuevo.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* No Services Available */}
        {!loading && !error && availableServiceTypes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay servicios disponibles en este momento.
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && availableServiceTypes.length > 0 && (
          <>
            {/* Service Type Selection */}
            {!selectedServiceType && (
              <div className="space-y-6 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Selecciona el tipo de servicio
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableServiceTypes.map((type) => {
                      const config = SERVICE_TYPE_CONFIG[type];
                      return (
                        <ServiceTypeCard
                          key={type}
                          icon={config.icon}
                          title={config.title}
                          description={config.description}
                          variant={config.variant}
                          onClick={() => handleServiceTypeSelect(type)}
                        />
                      );
                    })}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="w-full rounded-full"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            )}

            {/* Service-specific Form */}
            {selectedServiceType && renderServiceForm()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
