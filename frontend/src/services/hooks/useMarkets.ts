import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketsApi, historyApi } from "../api";
import { queryKeys, staleTimes } from "../queryClient";

export function useMarkets() {
  const queryClient = useQueryClient();
  const { data: assets = [], isLoading, isError: marketsError, refetch: refetchMarkets } = useQuery({
    queryKey: queryKeys.markets(),
    queryFn: () => marketsApi.list().then((r) => r.data),
    staleTime: staleTimes.markets,
    retry: 1,
    throwOnError: false,
  });

  const ingestMutation = useMutation({
    mutationFn: () => marketsApi.ingest(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.markets() });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics(24) });
      queryClient.invalidateQueries({ queryKey: queryKeys.strategyResults() });
    },
  });

  return {
    assets,
    isLoading,
    isError: marketsError,
    refetchMarkets,
    ingest: ingestMutation.mutate,
    isIngesting: ingestMutation.isPending,
  };
}

export function useHistory(symbol: string | null, limit = 100) {
  const {
    data: history = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: queryKeys.history(symbol, limit),
    queryFn: () =>
      symbol ? historyApi.get(symbol, limit).then((r) => r.data) : Promise.resolve([]),
    enabled: !!symbol,
    staleTime: staleTimes.history,
    retry: 1,
    throwOnError: false,
  });
  return { history, isLoading, isError, refetch, isRefetching };
}
