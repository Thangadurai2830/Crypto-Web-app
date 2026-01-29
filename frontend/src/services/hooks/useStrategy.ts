import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StrategyRun, StrategyRunRequest } from "../../types/api";
import { strategyApi } from "../api";
import { queryKeys, staleTimes } from "../queryClient";

const DEFAULT_LIMIT = 10;

export function useStrategyResults(limit = DEFAULT_LIMIT) {
  const { data: runs, isLoading, error } = useQuery({
    queryKey: queryKeys.strategyResults(limit),
    queryFn: () => strategyApi.results(limit).then((r) => r.data),
    staleTime: staleTimes.strategyResults,
    retry: 1,
    throwOnError: false,
  });
  return { runs: runs ?? [], isLoading, error };
}

const strategyResultsKey = () => queryKeys.strategyResults(DEFAULT_LIMIT);

/** Run strategy with optimistic update: show new run immediately, rollback on error. */
export function useStrategyRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: StrategyRunRequest) => strategyApi.run(body).then((r) => r.data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: strategyResultsKey() });
      const previous = queryClient.getQueryData<StrategyRun[]>(strategyResultsKey());
      const optimisticRun: StrategyRun = {
        id: -Date.now(),
        run_at: new Date().toISOString(),
        strategy_name: variables.strategy_name ?? "ma_crossover",
        params_snapshot: JSON.stringify(variables),
        status: "running",
        signals: [],
      };
      queryClient.setQueryData<StrategyRun[]>(strategyResultsKey(), (old = []) => [
        optimisticRun,
        ...old.slice(0, DEFAULT_LIMIT - 1),
      ]);
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(strategyResultsKey(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: strategyResultsKey() });
    },
  });
}
