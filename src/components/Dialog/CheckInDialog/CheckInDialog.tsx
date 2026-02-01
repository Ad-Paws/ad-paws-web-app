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
import { ServiceTypeCard, DogSelector } from "./components";
import { DaycareForm, HotelForm } from "./forms";
import type { Reservation } from "@/lib/api/reservations.api";
import type { ServiceType, Dog } from "./types";

type CheckInStep =
  | "service-type"
  | "dog-selection"
  | "service-form"
  | "summary";

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(() => {
  const modal = useModal();
  const { company } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckInStep>("service-type");
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

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
            .filter((s: Service) => s.category === "MAIN")
            .map((s: Service) => s.type)
        ),
      ] as ServiceType[])
    : [];

  // Get MAIN services for the selected type
  const mainServicesForSelectedType =
    servicesData?.servicesByCompany?.filter(
      (s: Service) => s.type === selectedServiceType && s.category === "MAIN"
    ) || [];

  // Get ADDON services for the selected type
  const addonServicesForSelectedType =
    servicesData?.servicesByCompany?.filter(
      (s: Service) => s.type === selectedServiceType && s.category === "ADDON"
    ) || [];

  // Get dogs list
  const dogs = dogsData?.companyDogs || [];

  const loading = servicesLoading || dogsLoading;
  const error = servicesError || dogsError;

  const handleCancel = () => {
    modal.hide();
    setCurrentStep("service-type");
    setSelectedServiceType(null);
    setSelectedDogId(null);
  };

  const handleBack = () => {
    if (currentStep === "dog-selection") {
      setCurrentStep("service-type");
      setSelectedServiceType(null);
      setSelectedDogId(null);
    } else if (currentStep === "service-form") {
      setCurrentStep("dog-selection");
    }
  };

  const handleServiceTypeSelect = (type: ServiceType) => {
    setSelectedServiceType(type);
    setCurrentStep("dog-selection");
  };

  const handleDogSelect = (dogId: string) => {
    setSelectedDogId(dogId);
    // Don't auto-advance step, wait for continue button
  };

  const handleDogContinue = () => {
    if (selectedDogId) {
      setCurrentStep("service-form");
    }
  };

  const handleSuccess = (reservation: Reservation) => {
    console.log("Reservation created:", reservation);
    // TODO: Show success toast/notification
    modal.hide();
    setCurrentStep("service-type");
    setSelectedServiceType(null);
    setSelectedDogId(null);
  };

  // Render the appropriate form based on selected service type
  const renderServiceForm = () => {
    if (!selectedDogId) return null;

    switch (selectedServiceType) {
      case "DAYCARE":
        return (
          <DaycareForm
            services={mainServicesForSelectedType}
            addonServices={addonServicesForSelectedType}
            dogId={selectedDogId}
            companyId={company?.id ? Number(company.id) : 0}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onBack={handleBack}
          />
        );
      case "HOTEL":
        return (
          <HotelForm
            services={mainServicesForSelectedType}
            addonServices={addonServicesForSelectedType}
            dogId={selectedDogId}
            companyId={company?.id ? Number(company.id) : 0}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onBack={handleBack}
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
    if (currentStep === "service-type") {
      return "Nuevo Check-in";
    }
    if (currentStep === "dog-selection") {
      return `Seleccionar Perro - ${
        SERVICE_TYPE_CONFIG[selectedServiceType!].title
      }`;
    }
    return `Check-in - ${SERVICE_TYPE_CONFIG[selectedServiceType!].title}`;
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case "service-type":
        return { step: 1, total: 4, label: "Tipo de servicio" };
      case "dog-selection":
        return { step: 2, total: 4, label: "Seleccionar perro" };
      case "service-form":
        return { step: 3, total: 4, label: "Detalles del servicio" };
      case "summary":
        return { step: 4, total: 4, label: "Confirmar" };
      default:
        return { step: 1, total: 4, label: "" };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      <DialogContent
        className="bg-white dark:bg-gray-800 max-w-xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {currentStep !== "service-type" && (
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
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#A3C585] h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(stepInfo.step / stepInfo.total) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Paso {stepInfo.step} de {stepInfo.total}
              </span>
            </div>
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
            {/* Step 1: Service Type Selection */}
            {currentStep === "service-type" && (
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

            {/* Step 2: Dog Selection */}
            {currentStep === "dog-selection" && (
              <div className="space-y-6 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Selecciona el perro para el servicio
                  </p>
                  {dogs.length > 0 ? (
                    <DogSelector
                      dogs={dogs}
                      selectedDogId={selectedDogId}
                      onSelect={handleDogSelect}
                      onContinue={handleDogContinue}
                      showContinueButton
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-amber-50 rounded-xl">
                      <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                      <p className="text-sm text-gray-600">
                        No hay perros registrados. Por favor registra un perro
                        primero.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 & 4: Service-specific Form (includes its own summary) */}
            {currentStep === "service-form" && renderServiceForm()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
