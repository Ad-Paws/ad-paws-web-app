import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

import { clearSession } from "@/lib/auth";
import { useCompanyStore } from "@/store/useCompanyStore";

const LOGIN_PATH = "/auth/login";

/** Rutas públicas: un UNAUTHENTICATED aquí es esperado y no debe redirigir. */
const PUBLIC_PATHS = [LOGIN_PATH, "/registro-cliente", "/registro-empresa"];

/**
 * Adjunta la compañía activa como `x-company-id`. El backend resuelve el
 * tenant con este header (o con la única compañía del usuario si falta) y
 * valida la membresía — el header solo selecciona, nunca autoriza.
 */
const companyLink = new SetContextLink((prevContext) => {
  const companyId = useCompanyStore.getState().activeCompanyId;
  if (!companyId) return prevContext;
  return {
    headers: {
      ...prevContext.headers,
      "x-company-id": companyId,
    },
  };
});

/**
 * Manejo global de sesión expirada. El backend responde con
 * `extensions.code === "UNAUTHENTICATED"` cuando la sesión no es válida:
 * se limpia el estado local y se redirige a login, salvo que:
 * - estemos en una ruta pública (login/registro), para no ciclar en
 *   operaciones públicas como signUser;
 * - la operación pida `context: { skipAuthRedirect: true }` (p. ej. la
 *   consulta `me` de arranque, cuyo resultado maneja ProtectedRoute).
 */
const errorLink = new ErrorLink(({ error, operation }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const unauthenticated = error.errors.some(
    (graphQLError) => graphQLError.extensions?.code === "UNAUTHENTICATED",
  );
  if (!unauthenticated) return;

  clearSession();
  if (operation.getContext().skipAuthRedirect) return;

  const { pathname } = window.location;
  const onPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (!onPublicPath) {
    window.location.assign(LOGIN_PATH);
  }
});

const uploadLink = new UploadHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_API_URL}/graphql`,
  credentials: "include",
  headers: {
    // Requerido por csrfPrevention de Apollo Server.
    "Apollo-Require-Preflight": "true",
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, companyLink, uploadLink]),
  cache: new InMemoryCache(),
});
