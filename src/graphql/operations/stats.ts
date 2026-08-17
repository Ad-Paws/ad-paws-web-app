import { graphql } from "@/gql";

/**
 * Stats del dashboard contra el schema nuevo.
 * `revenueStats` está restringido a OWNER/ADMIN — la UI debe ocultarlo para
 * STAFF (ver Dashboard). `pastDueVaccines` ya no existe: no hay modelo de
 * vacunas todavía.
 */
export const GUEST_STATS_QUERY = graphql(`
  query GuestStats($date: DateTime) {
    guestStats(date: $date) {
      totalDogs
      checkedInNow
      arrivingToday
      departingToday
      newDogsThisMonth
    }
  }
`);

export const REVENUE_STATS_QUERY = graphql(`
  query RevenueStats($date: DateTime) {
    revenueStats(date: $date) {
      total
      paid
      unpaid
      previousUnpaid
      byServiceType {
        serviceType
        amount
      }
    }
  }
`);
