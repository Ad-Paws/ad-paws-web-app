import type { QuoteReservationQuery } from "@/gql/graphql";
import { moneyToNumber } from "@/utils/adapters";

/**
 * Desglose de la cotización para el resumen de check-in.
 *
 * Los tres formularios (hotel, guardería, extras) leían solo `total` y lo
 * cobraban. Con cobertura de paquetes eso está mal: `total` es la valuación
 * completa, `amountDue` es lo que hay que cobrar. La diferencia no es un
 * descuento global — la cobertura se decide fecha por fecha, así que una
 * estancia puede quedar cubierta a medias.
 *
 * Pura y compartida para que los tres formularios no la deriven cada uno a su
 * manera; el servidor sigue siendo la única fuente de los importes.
 */
export interface QuoteBreakdown {
  /** Valuación completa, como si no hubiera paquete. Null si no hay cotización. */
  total: number | null;
  /** Lo que realmente se cobra. Null si no hay cotización. */
  amountDue: number | null;
  /** Fechas (ISO) cubiertas por un paquete. */
  coveredDates: string[];
  /** Ids de servicios add-on cubiertos por paquete. */
  coveredAddOnIds: string[];
  /** El CTA se bloquea hasta que el servidor cotice. */
  quoteReady: boolean;
  /**
   * Mensaje del servidor cuando rechaza la cotización.
   *
   * Devolverlo NO es opcional. Antes los importes caían a 0 cuando la
   * cotización fallaba, así que una reserva rechazada se veía idéntica a una
   * gratis: "$0.00" y un botón muerto sin explicación. Un cero silencioso es
   * la peor forma de reportar un error cuando la pantalla habla de dinero.
   */
  quoteError: string | null;
}

export function useQuoteBreakdown(
  data: QuoteReservationQuery | undefined,
  loading: boolean,
  error?: { message: string } | null,
): QuoteBreakdown {
  const quote = data?.quoteReservation;

  return {
    // Null, no 0: "todavía no sé" y "cuesta cero" son cosas distintas y la UI
    // tiene que poder distinguirlas.
    total: quote ? moneyToNumber(quote.total) : null,
    amountDue: quote ? moneyToNumber(quote.amountDue) : null,
    coveredDates: quote?.coveredDates ?? [],
    coveredAddOnIds:
      quote?.addOns
        .filter((addOn) => addOn.coveredByPackage)
        .map((addOn) => addOn.service.id) ?? [],
    quoteReady: !loading && !!quote,
    quoteError: error?.message ?? null,
  };
}
