import {
  BedDoubleIcon,
  SunIcon,
  GraduationCapIcon,
  ScissorsIcon,
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

