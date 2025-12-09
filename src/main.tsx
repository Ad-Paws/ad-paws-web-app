import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/api/apolloClient";
import { AuthProvider } from "./contexts/AuthContext";
import NiceModal from "@ebay/nice-modal-react";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <NiceModal.Provider>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <RouterProvider router={routes} />
          </AuthProvider>
        </ApolloProvider>
      </NiceModal.Provider>
    </ThemeProvider>
  </StrictMode>
);
