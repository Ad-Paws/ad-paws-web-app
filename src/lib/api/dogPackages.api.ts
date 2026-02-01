import { gql } from "@apollo/client";

// ============================================
// TYPES
// ============================================

export interface DogPackageBalance {
  id: number;
  dogPackageId: number;
  serviceId: number;
  service: {
    id: number;
    name: string;
    price: number;
  };
  initialQuantity: number | null;
  usedQuantity: number;
  remainingQuantity: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: number;
  name: string;
  description?: string;
  price: number;
  type: "QUANTITY" | "UNLIMITED" | "SUBSCRIPTION";
  validityDays?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DogPackage {
  id: number;
  dogId: number;
  packageId: number;
  package: Package;
  purchaseDate: string;
  expiryDate?: string;
  renewalDate?: string;
  billingCycle?: string;
  status: "ACTIVE" | "DEPLETED" | "EXPIRED" | "CANCELLED";
  balances: DogPackageBalance[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// QUERIES
// ============================================

export const ACTIVE_DOG_PACKAGES = gql`
  query ActiveDogPackages($dogId: Int!) {
    activeDogPackages(dogId: $dogId) {
      id
      dogId
      packageId
      purchaseDate
      expiryDate
      renewalDate
      billingCycle
      status
      package {
        id
        name
        description
        price
        type
        validityDays
        active
      }
      balances {
        id
        dogPackageId
        serviceId
        service {
          id
          name
          price
        }
        initialQuantity
        usedQuantity
        remainingQuantity
      }
      createdAt
      updatedAt
    }
  }
`;

export const CHECK_DOG_SERVICE_AVAILABILITY = gql`
  query CheckDogServiceAvailability($dogId: Int!, $serviceId: Int!) {
    checkDogServiceAvailability(dogId: $dogId, serviceId: $serviceId) {
      id
      dogPackageId
      serviceId
      service {
        id
        name
        price
      }
      initialQuantity
      usedQuantity
      remainingQuantity
      dogPackage {
        id
        status
        expiryDate
        package {
          id
          name
          type
          validityDays
        }
      }
    }
  }
`;
