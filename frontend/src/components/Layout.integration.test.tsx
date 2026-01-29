/**
 * Integration test: Layout with router and providers.
 * Renders Layout and checks navigation and main content area.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SearchProvider } from "../contexts/SearchContext";
import { Layout } from "./Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SearchProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </SearchProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe("Layout (integration)", () => {
  it("renders header with app title or nav", () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    );
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders main content area", () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    );
    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
  });

  it("renders sidebar or nav links", () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>
    );
    const nav = document.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });
});
