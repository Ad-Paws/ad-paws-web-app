import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

import { clearSession } from "@/lib/auth";
import { useCompanyStore } from "@/store/useCompanyStore";

const LOGIN_PATH = "/login";

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
 * se limpia el estado local y se redirige a login (salvo que ya estemos ahí,
 * para no ciclar en operaciones públicas como signUser).
 */
const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const unauthenticated = error.errors.some(
    (graphQLError) => graphQLError.extensions?.code === "UNAUTHENTICATED",
  );
  if (!unauthenticated) return;

  clearSession();
  if (!window.location.pathname.startsWith(LOGIN_PATH)) {
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
