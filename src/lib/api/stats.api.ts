import { gql } from "@apollo/client";

export const GET_GUEST_STATS = gql`
  query Query {
    guestsStats {
      newDogsDuringMonth
      pastDueVaccines
      todayCheckedInDogs
      totalDogs
    }
  }
`;

export const GET_TODAYS_REVENUE = gql`
  query TodaysRevenue($companyId: Int!) {
    todaysRevenue(companyId: $companyId) {
      total
      paid
      unpaid
      refunded
      byServiceType {
        serviceType
        amount
      }
    }
  }
`;

export interface RevenueByServiceType {
  serviceType: string;
  amount: number;
}

export interface TodaysRevenue {
  total: number;
  paid: number;
  unpaid: number;
  refunded: number;
  byServiceType: RevenueByServiceType[];
}

export interface TodaysRevenueResponse {
  todaysRevenue: TodaysRevenue;
}

export interface TodaysRevenueVariables {
  companyId: number;
}
