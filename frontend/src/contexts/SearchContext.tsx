import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useAppStore } from "../store/useAppStore";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/** Provides search query from Zustand store so filter state is persisted. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setQuery = useCallback((q: string) => setSearchQuery(q ?? ""), [setSearchQuery]);
  const clearQuery = useCallback(() => setSearchQuery(""), [setSearchQuery]);
  const value = useMemo(
    () => ({ query: searchQuery, setQuery, clearQuery }),
    [searchQuery, setQuery, clearQuery]
  );
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
