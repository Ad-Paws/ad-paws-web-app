import {
  BedDoubleIcon,
  SunIcon,
  GraduationCapIcon,
  ScissorsIcon,
  SparklesIcon,
} from "lucide-react";
import type { ServiceType, ServiceTypeConfig } from "./types";

export const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  Omit<ServiceTypeConfig, "type">
> = {
  HOTEL: {
    icon: BedDoubleIcon,
    title: "Hospedaje",
    description: "Alojamiento y cuidado nocturno",
    variant: "green",
  },
  DAYCARE: {
    icon: SunIcon,
    title: "Guardería",
    description: "Supervisión y juego diario",
    variant: "blue",
  },
  TRAINING: {
    icon: GraduationCapIcon,
    title: "Entrenamiento",
    description: "Sesiones profesionales",
    variant: "amber",
  },
  GROOMING: {
    icon: ScissorsIcon,
    title: "Estética",
    description: "Spa y servicios de estilismo",
    variant: "rose",
  },
};

/**
 * Flujo de extras sueltos: servicios de categoría ADDON sin estancia
 * (baño, corte de uñas, etc.). No es un ServiceType del backend — el primer
 * extra seleccionado viaja como servicio principal de la reservación.
 */
export const EXTRAS_TYPE_CONFIG: Omit<ServiceTypeConfig, "type"> = {
  icon: SparklesIcon,
  title: "Solo extras",
  description: "Servicios sueltos sin estancia",
  variant: "amber",
};

// Helper functions
export const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
};

