import { useCompanyStore } from "@/store/useCompanyStore";

/**
 * La autenticación funciona por cookie de sesión (`credentials: "include"` en
 * Apollo). Los tokens JWT NO se guardan en localStorage: serían robables vía
 * XSS y el backend los rota/revoca (`refreshSession`), por lo que un token
 * filtrado además invalidaría la sesión legítima.
 *
 * `USER_DATA_KEY` es solo caché de arranque de la UI, no es autoritativo:
 * los permisos reales vienen de `me.memberships` y los valida el backend.
 */
export const USER_DATA_KEY = "userData";

/** Limpia todo estado local de sesión (logout o sesión expirada). */
export function clearSession(): void {
  localStorage.removeItem(USER_DATA_KEY);
  useCompanyStore.getState().setActiveCompany(null);
}
