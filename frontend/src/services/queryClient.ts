import { QueryClient } from "@tanstack/react-query";

const ONE_MINUTE_MS = 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

/** Default retry: 2 retries with exponential backoff (1s, 2s) */
function retryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}

/** Retry only on network/5xx, not on 4xx */
function shouldRetry(_failureCount: number, error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status != null && status >= 400 && status < 500) return false;
  }
  return true;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE_MS,
      gcTime: FIVE_MINUTES_MS,
      retry: (failureCount, error) => shouldRetry(failureCount, error) && failureCount < 2,
      retryDelay,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/** Query key factories for consistency and prefetch */
export const queryKeys = {
  markets: () => ["markets"] as const,
  history: (symbol: string | null, limit?: number) => ["history", symbol, limit] as const,
  analytics: (windowHours: number) => ["analytics", windowHours] as const,
  strategyResults: (limit?: number) => ["strategy", "results", limit] as const,
};

/** Stale times per resource (overrides default) */
export const staleTimes = {
  markets: ONE_MINUTE_MS,
  history: ONE_MINUTE_MS,
  analytics: ONE_MINUTE_MS,
  strategyResults: 30 * 1000,
} as const;
