import { graphql } from "@/gql";

/**
 * Servicios de la compañía activa (reemplaza a servicesByCompany y
 * servicesByCompanyAndType, que recibían companyId del cliente).
 * Horarios en minutos desde medianoche y días como bitmask — ver
 * utils/adapters.ts para las conversiones de UI.
 */
/**
 * Mutations de servicios. Inputs nuevos: price como Money (string decimal),
 * horarios en minutos, días como daysMask; sin companyId (contexto).
 * UpdateServiceInput no permite cambiar type/category.
 */
export const CREATE_SERVICE_MUTATION = graphql(`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      name
      description
      type
      category
      price
      currency
      pricingUnit
      durationMinutes
      opensAtMinute
      closesAtMinute
      daysMask
      capacity
      checkoutCutoffMinute
      status
    }
  }
`);

export const UPDATE_SERVICE_MUTATION = graphql(`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      name
      description
      type
      category
      price
      currency
      pricingUnit
      durationMinutes
      opensAtMinute
      closesAtMinute
      daysMask
      capacity
      checkoutCutoffMinute
      status
    }
  }
`);

export const SERVICES_QUERY = graphql(`
  query Services($type: ServiceType, $status: ServiceStatus) {
    services(type: $type, status: $status) {
      id
      name
      description
      type
      category
      price
      currency
      pricingUnit
      durationMinutes
      opensAtMinute
      closesAtMinute
      daysMask
      capacity
      checkoutCutoffMinute
      status
    }
  }
`);
