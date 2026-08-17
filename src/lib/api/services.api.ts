// Todas las operaciones de servicios migraron a
// src/graphql/operations/services.ts (services, createService, updateService),
// tipadas por codegen contra el schema nuevo. Quedan aquí solo los tipos
// legados que la UI consume; mapServiceToLegacy (src/utils/adapters.ts)
// produce esta forma desde el schema nuevo (minutos → HH:mm, daysMask → días,
// Money → number).

export type ServiceType = "HOTEL" | "DAYCARE" | "TRAINING" | "GROOMING";
export type ServiceCategory = "MAIN" | "ADDON";
export type PricingUnit =
  | "HOURLY"
  | "DAILY"
  | "NIGHTLY"
  | "SESSION"
  | "PACKAGE";

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  category: ServiceCategory;
  price: number;
  pricingUnit: PricingUnit;
  duration: number;
  startTime: string;
  endTime: string;
  daysAvailable: string[];
  active: boolean;
  companyId: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
}

export interface ServicesByCompanyInput {
  companyId: number;
  active?: boolean;
  name?: string;
  category?: ServiceCategory;
}

export interface ServicesByCompanyAndTypeVariables {
  type: ServiceType;
  companyId: number;
  category?: ServiceCategory;
}
