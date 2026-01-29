import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";
import { useSearch } from "../../../contexts/SearchContext";
import { useDebouncedValue } from "../../../services/hooks";
import { cn } from "../../../utils/cn";

const SEARCH_DEBOUNCE_MS = 300;

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { query, setQuery } = useSearch();
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const [inputValue, setInputValue] = useState(query);
  const debouncedSearch = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setQuery(debouncedSearch);
  }, [debouncedSearch, setQuery]);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-lg font-semibold text-crypto-primary transition-colors hover:text-blue-600"
        >
          Crypto Analytics
        </Link>

        {isDashboard && (
          <div className="relative hidden flex-1 max-w-md sm:block">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="search"
              placeholder="Search symbols…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Search crypto symbols"
              className={cn(
                "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
                "focus:border-crypto-primary focus:outline-none focus:ring-1 focus:ring-crypto-primary"
              )}
            />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <motion.button
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              "text-[var(--color-text-muted)] hover:bg-crypto-primary/10 hover:text-crypto-primary focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
            )}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </motion.button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="User menu"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                "text-[var(--color-text-muted)] hover:bg-crypto-primary/10 hover:text-crypto-primary focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
              )}
            >
              <UserIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
