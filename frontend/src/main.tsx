import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SearchProvider } from "./contexts/SearchContext";
import { queryClient } from "./services/queryClient";
import { enforceHttps } from "./utils/httpsRedirect";
import App from "./App";
import "./index.css";

enforceHttps();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SearchProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </SearchProvider>
    </ThemeProvider>
  </StrictMode>
);
