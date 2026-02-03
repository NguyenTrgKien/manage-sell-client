import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./contexts/AuthContext.tsx";
import CategoryProvider from "./contexts/CategoryContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <CategoryProvider>
          <AuthContextProvider>
            <GoogleOAuthProvider
              clientId={
                import.meta.env.VITE_GOOGLE_CLIENT_ID ||
                "703456349605-7lrmk34o85uaqde1iikmsn5cp8csm52e.apps.googleusercontent.com"
              }
            >
              <App />
            </GoogleOAuthProvider>
          </AuthContextProvider>
        </CategoryProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>,
);
