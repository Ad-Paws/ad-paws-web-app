import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { type Service } from "@/lib/api/services.api";
import { DOGS_QUERY } from "@/graphql/operations/dogs";
import { SERVICES_QUERY } from "@/graphql/operations/services";
import { mapServiceToLegacy } from "@/utils/adapters";
import { SERVICE_TYPE_CONFIG, EXTRAS_TYPE_CONFIG } from "./constants";
import { ServiceTypeCard, DogSelector } from "./components";
import { DaycareForm, HotelForm, ExtrasForm } from "./forms";
import type { ServiceType, Dog } from "./types";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/api/apolloClient";

type CheckInStep =
  | "service-type"
  | "dog-selection"
  | "service-form"
  | "summary";

/** Selección del paso 1: un tipo de servicio principal, o extras sueltos. */
type ServiceSelection = ServiceType | "EXTRAS";

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(() => {
  const modal = useModal();
  const { company } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckInStep>("service-type");
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceSelection | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  // Fetch services for the company
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["servicesByCompany", company?.id],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: SERVICES_QUERY,
        fetchPolicy: "no-cache",
        variables: { status: "ACTIVE" as const },
      });
      return {
        servicesByCompany: (result.data?.services ?? []).map(
          mapServiceToLegacy,
        ),
      };
    },
    enabled: !!company?.id,
  });

  // Fetch dogs for the company
  const {
    data: dogsData,
    isLoading: dogsLoading,
    error: dogsError,
  } = useQuery<{ companyDogs: Dog[] }>({
    queryKey: ["companyDogs", company?.id],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: DOGS_QUERY,
        variables: { first: 50 },
      });
      return {
        companyDogs: (result.data?.dogs ?? []).map((dog) => ({
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
        })),
      };
    },
    enabled: !!company?.id,
  });

  // Get unique service types that are available (only from MAIN category services)
  const availableServiceTypes = servicesData?.servicesByCompany
    ? ([
        ...new Set(
          servicesData.servicesByCompany
            .filter((s: Service) => s.category === "MAIN")
            .map((s: Service) => s.type),
        ),
      ] as ServiceType[])
    : [];

  // Get MAIN services for the selected type
  const mainServicesForSelectedType =
    servicesData?.servicesByCompany?.filter(
      (s: Service) => s.type === selectedServiceType && s.category === "MAIN",
    ) || [];

  const addonServicesForSelectedType =
    servicesData?.servicesByCompany?.filter(
      (s: Service) => s.type === selectedServiceType && s.category === "ADDON",
    ) || [];

  // Todos los extras (ADDON) de la compañía, para el flujo de solo extras.
  const allAddonServices =
    servicesData?.servicesByCompany?.filter(
      (s: Service) => s.category === "ADDON",
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

  const handleServiceTypeSelect = (type: ServiceSelection) => {
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

  const handleSuccess = () => {
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
      case "EXTRAS":
        return (
          <ExtrasForm
            services={allAddonServices}
            dogId={selectedDogId}
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

  /**
   * Solo estos formularios traen `CheckInActionBar` pegada al fondo. Los
   * placeholders de Training y Grooming caen en el mismo paso pero no la
   * tienen, así que condicionar por paso les quitaría el respiro de abajo.
   */
  const formHasActionBar =
    currentStep === "service-form" &&
    (selectedServiceType === "DAYCARE" ||
      selectedServiceType === "HOTEL" ||
      selectedServiceType === "EXTRAS");

  const selectedTypeConfig =
    selectedServiceType === "EXTRAS"
      ? EXTRAS_TYPE_CONFIG
      : selectedServiceType
        ? SERVICE_TYPE_CONFIG[selectedServiceType]
        : null;

  const getDialogTitle = () => {
    if (currentStep === "service-type" || !selectedTypeConfig) {
      return "Nuevo Check-in";
    }
    if (currentStep === "dog-selection") {
      return `Seleccionar Perro - ${selectedTypeConfig.title}`;
    }
    return `Check-in - ${selectedTypeConfig.title}`;
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case "service-type":
        return { step: 1, total: 3, label: "Tipo de servicio" };
      case "dog-selection":
        return { step: 2, total: 3, label: "Seleccionar perro" };
      case "service-form":
        return { step: 3, total: 3, label: "Detalles del servicio" };
      case "summary":
        return { step: 4, total: 3, label: "Confirmar" };
      default:
        return { step: 1, total: 3, label: "" };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      {/*
        Columna flex en vez de un bloque con scroll: el encabezado es un
        hermano que no encoge y el cuerpo se lleva el desbordamiento. La
        versión anterior lo resolvía con `sticky` y `-mt-6`, y el margen
        negativo dejaba una franja sobre el encabezado por donde se veía pasar
        el contenido — el header quedaba pegado al borde del padding, no al
        del contenedor.
      */}
      <DialogContent
        className="bg-white dark:bg-gray-800 max-w-xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
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
                  className="bg-brand h-1.5 rounded-full transition-all duration-300"
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

        {/*
          Cuerpo: lo único que scrollea. El px-6 vive aquí, así que la barra de
          acciones puede sangrarse con -mx-6 para ocupar todo el ancho.

          min-h-0 es obligatorio: en una columna flex el mínimo por defecto es
          el contenido, así que sin esto el cuerpo no encoge, desborda el max-h
          del diálogo y el scroll se va al contenedor equivocado.

          El padding inferior depende de quién cierra la pantalla. En el paso
          del formulario la barra de acciones va pegada abajo y necesita llegar
          al ras — cualquier padding aquí la dejaría flotando con contenido
          asomándose por debajo. En los pasos anteriores no hay barra, así que
          el cuerpo pone su propio respiro o el contenido queda contra el borde.
        */}
        <div
          className={cn(
            "flex-1 min-h-0 overflow-y-auto px-6 pt-4",
            formHasActionBar ? "pb-0" : "pb-6",
          )}
        >
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
        {!loading &&
          !error &&
          availableServiceTypes.length === 0 &&
          allAddonServices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay servicios disponibles en este momento.
            </p>
          </div>
        )}

        {/* Content */}
        {!loading &&
          !error &&
          (availableServiceTypes.length > 0 || allAddonServices.length > 0) && (
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
                    {allAddonServices.length > 0 && (
                      <ServiceTypeCard
                        icon={EXTRAS_TYPE_CONFIG.icon}
                        title={EXTRAS_TYPE_CONFIG.title}
                        description={EXTRAS_TYPE_CONFIG.description}
                        variant={EXTRAS_TYPE_CONFIG.variant}
                        onClick={() => handleServiceTypeSelect("EXTRAS")}
                      />
                    )}
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
        </div>
      </DialogContent>
    </Dialog>
  );
});
