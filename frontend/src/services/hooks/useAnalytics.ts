import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { analyticsApi } from "../api";
import { queryKeys, staleTimes } from "../queryClient";

export function useAnalytics(windowHours = 24) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.analytics(windowHours),
    queryFn: () => analyticsApi.get(windowHours).then((r) => r.data),
    staleTime: staleTimes.analytics,
    retry: 1,
    throwOnError: false,
  });

  return {
    data,
    assets: data?.assets ?? [],
    windowHours: data?.window_hours ?? windowHours,
    isLoading,
    isError,
  };
}

/** Prefetch analytics for common windows (e.g. on app load or before navigating to analysis). */
export function usePrefetchAnalytics() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const windows = [24, 48];
    windows.forEach((windowHours) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.analytics(windowHours),
        queryFn: () => analyticsApi.get(windowHours).then((r) => r.data),
        staleTime: staleTimes.analytics,
      });
    });
  }, [queryClient]);
}
