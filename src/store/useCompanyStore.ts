import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Compañía activa para peticiones multi-tenant.
 *
 * El id viaja en el header `x-company-id` (ver apolloClient). Solo es un
 * SELECTOR de conveniencia: el backend valida que el usuario realmente sea
 * miembro de esa compañía, así que persistirlo en localStorage no es un
 * riesgo de autorización. Nunca derivar permisos de este valor.
 */
interface CompanyStore {
  activeCompanyId: string | null;
  setActiveCompany: (id: string | null) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      activeCompanyId: null,
      setActiveCompany: (id) => set({ activeCompanyId: id }),
    }),
    { name: "adpaws.activeCompany" },
  ),
);
