import type { ApolloCache } from "@apollo/client";

/**
 * Invalida todo lo que una reservación toca al cambiar de estado.
 *
 * `refetchQueries` no alcanza: solo refresca las queries ACTIVAS. El tablero
 * monta una sola `reservations` a la vez —la de la pestaña visible— y cada
 * pestaña es una variante distinta en caché por sus variables. Al hacer
 * check-in desde "Por llegar", esa variante se refrescaba y la de "Hoy" se
 * quedaba vieja: el huésped recién recibido no aparecía hasta recargar.
 *
 * `evict` sobre el CAMPO borra todas sus variantes de un golpe. Las queries
 * activas se refrescan solas al quedar incompletas, y las que no están
 * montadas van a la red cuando se monten.
 *
 * Se listan los campos, no las queries, porque el campo es lo que el servidor
 * cambió: quién está adentro, cuánto se cobró hoy y qué tan llena está la
 * agenda son consecuencias del mismo hecho.
 */
export function evictReservationCache(cache: ApolloCache): void {
  for (const fieldName of [
    "reservations",
    "reservationsOn",
    "guestStats",
    "revenueStats",
    // La ocupación cambia con cada alta o cancelación; si no se invalida, el
    // calendario de disponibilidad miente sobre los lugares libres.
    "occupancy",
  ]) {
    cache.evict({ id: "ROOT_QUERY", fieldName });
  }
  cache.gc();
}
