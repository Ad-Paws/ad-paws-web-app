import { ApolloClient, InMemoryCache } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const uploadLink = new UploadHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_API_URL}/graphql`,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true", // si usas Apollo Server 3/4 con csrfPrevention
  },
});

export const apolloClient = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});
