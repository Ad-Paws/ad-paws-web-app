import type { LucideIcon } from "lucide-react";
import { type ServiceTypeVariant, type DateRangeValue } from "../../Form";

export type ServiceType = "HOTEL" | "DAYCARE" | "TRAINING" | "GROOMING";

export interface Dog {
  id: string;
  name: string;
  breed: string;
  imageUrl?: string;
  owner?: {
    name?: string;
    lastname?: string;
  };
}

export interface CheckInFormValues {
  serviceType: ServiceType | "";
  selectedServiceId: string;
  stayDates: DateRangeValue;
  additionalServices: string[];
  dogId: string;
}

export interface ServiceTypeConfig {
  type: ServiceType;
  icon: LucideIcon;
  title: string;
  description: string;
  variant: ServiceTypeVariant;
}

