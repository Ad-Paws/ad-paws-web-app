import { gql } from "@apollo/client";

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput) {
    createService(input: $input) {
      id
      name
      type
      category
      price
      pricingUnit
      duration
      startTime
      endTime
      daysAvailable
      active
      companyId
      createdAt
      updatedAt
    }
  }
`;

export interface CreateServiceInput {
  name: string;
  type: ServiceType;
  category?: ServiceCategory;
  companyId: number;
  price: number;
  pricingUnit: PricingUnit;
  duration: number;
  startTime: string;
  endTime: string;
  daysAvailable: string[];
}

export const SERVICES_BY_COMPANY = gql`
  query ServicesByCompany($input: ServicesByCompanyInput) {
    servicesByCompany(input: $input) {
      id
      name
      type
      category
      price
      pricingUnit
      duration
      startTime
      endTime
      daysAvailable
      active
      companyId
      createdAt
    }
  }
`;

export const SERVICES_BY_COMPANY_AND_TYPE = gql`
  query ServicesByCompanyAndType(
    $type: ServiceType
    $companyId: Int
    $category: ServiceCategory
  ) {
    servicesByCompanyAndType(
      type: $type
      companyId: $companyId
      category: $category
    ) {
      id
      name
      type
      category
      price
      pricingUnit
      duration
      startTime
      endTime
      daysAvailable
      active
      companyId
      createdAt
      updatedAt
    }
  }
`;

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
