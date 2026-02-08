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
import { StatsigProvider } from "@statsig/react-bindings";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";
import { StatsigWrapper } from "./components/StatsigWrapper";

const STATSIG_CLIENT_KEY =
  import.meta.env.VITE_STATSIG_CLIENT_KEY ||
  "client-MEUVgenA06nWlhyr4oSSidp0SJO2u6xiMZdwgPusW1l";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <StatsigProvider
            sdkKey={STATSIG_CLIENT_KEY}
            user={{ userID: "anonymous" }}
            options={{
              environment: {
                tier:
                  import.meta.env.MODE === "production"
                    ? "production"
                    : "development",
              },
              plugins: [
                new StatsigAutoCapturePlugin(),
                new StatsigSessionReplayPlugin(),
              ],
            }}
          >
            <StatsigWrapper>
              <NiceModal.Provider>
                <RouterProvider router={routes} />
              </NiceModal.Provider>
            </StatsigWrapper>
          </StatsigProvider>
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
);
