/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apolloClient } from "@/lib/api/apolloClient";
import { clearSession } from "@/lib/auth";
import { useCompanyStore } from "@/store/useCompanyStore";
import { ME_QUERY, LOGOUT_MUTATION } from "@/graphql/operations/session";
import type { MembershipRole, MeQuery } from "@/gql/graphql";

// Tipos derivados de la query generada — una sola fuente de verdad (el schema).
type Me = NonNullable<MeQuery["me"]>;
export type Membership = Me["memberships"][number];
export type Company = Membership["company"];

export interface User {
  id: string;
  email: string;
  name: string | null;
  lastname: string | null;
  profilePicture: string | null;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  /** Compañía activa (header x-company-id). */
  company: Company | null;
  /** Rol del usuario EN la compañía activa. Solo para decidir qué UI mostrar; la autorización real la hace el backend. */
  role: MembershipRole | null;
  /** Membresías activas del usuario (para selector multi-empresa). */
  memberships: Membership[];
  setActiveCompany: (companyId: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: "network-only",
      });

      if (!data?.me) {
        throw new Error("No authenticated session");
      }

      const activeMemberships = data.me.memberships.filter(
        (membership) => membership.status === "ACTIVE",
      );

      // Conservar la selección previa si sigue siendo válida; si no, la primera.
      const storedCompanyId = useCompanyStore.getState().activeCompanyId;
      const active =
        activeMemberships.find((m) => m.company.id === storedCompanyId) ??
        activeMemberships[0] ??
        null;
      useCompanyStore.getState().setActiveCompany(active?.company.id ?? null);

      setUser({
        id: data.me.id,
        email: data.me.email,
        name: data.me.name ?? null,
        lastname: data.me.lastname ?? null,
        profilePicture: data.me.profilePicture ?? null,
      });
      setMemberships(activeMemberships);
      setActiveMembership(active);
    } catch (error) {
      clearSession();
      setUser(null);
      setMemberships([]);
      setActiveMembership(null);
      throw error;
    }
  }, []);

  // Al montar: si la cookie de sesión es válida, `me` responde.
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await fetchUserData();
      } catch {
        // Sin sesión válida — estado no autenticado.
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserData]);

  /** La cookie ya fue creada por signUser; aquí solo se carga el perfil. */
  const login = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    try {
      await apolloClient.mutate({ mutation: LOGOUT_MUTATION });
    } finally {
      clearSession();
      await apolloClient.clearStore();
      setUser(null);
      setMemberships([]);
      setActiveMembership(null);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error("Failed to refetch user data:", error);
    }
  }, [fetchUserData]);

  const setActiveCompany = useCallback(
    (companyId: string) => {
      const membership = memberships.find((m) => m.company.id === companyId);
      if (!membership) return;
      useCompanyStore.getState().setActiveCompany(companyId);
      setActiveMembership(membership);
      // Datos en caché pertenecen al tenant anterior.
      apolloClient.resetStore().catch(() => undefined);
    },
    [memberships],
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    refetchUser,
    company: activeMembership?.company ?? null,
    role: activeMembership?.role ?? null,
    memberships,
    setActiveCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
