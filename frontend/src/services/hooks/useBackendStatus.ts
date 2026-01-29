import { useQuery } from "@tanstack/react-query";
import { healthApi } from "../api";

const QUERY_KEY = ["backend-health"];
const STALE_MS = 60_000;

/**
 * Polls backend health and returns a status string for the footer/layout.
 * Keeps the app's "API connected" status in one place.
 */
export function useBackendStatus() {
  const { data, isError, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => healthApi.check().then((r) => r.data),
    retry: 1,
    staleTime: STALE_MS,
    refetchOnWindowFocus: true,
    throwOnError: false,
  });

  if (isLoading) return { status: "Checking…", isConnected: false, hint: undefined };
  if (isError || data?.status !== "ok")
    return {
      status: "Backend unreachable",
      isConnected: false,
      hint: "Start backend: from repo root run .\\backend\\run-backend.ps1 (see CONNECTING.md).",
    };
  return { status: "All systems operational", isConnected: true, hint: undefined };
}
