import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./contexts/AuthContext.tsx";
import CategoryProvider from "./contexts/CategoryContext.tsx";

const Router =
  process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename="/manage-sell-client">
      <QueryClientProvider client={queryClient}>
        <CategoryProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </CategoryProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
