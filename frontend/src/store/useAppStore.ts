import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChartViewType } from "../components/common/Chart";

// ——— UI preferences ———
interface UIState {
  sidebarCollapsed: boolean;
  compactMode: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  setCompactMode: (v: boolean) => void;
  toggleSidebar: () => void;
}

// ——— Chart configurations ———
interface ChartState {
  chartType: ChartViewType;
  showSma: boolean;
  showEma: boolean;
  showRsi: boolean;
  showBrush: boolean;
  realTimeEnabled: boolean;
  chartHeight: number;
  setChartType: (v: ChartViewType) => void;
  setShowSma: (v: boolean) => void;
  setShowEma: (v: boolean) => void;
  setShowRsi: (v: boolean) => void;
  setShowBrush: (v: boolean) => void;
  setRealTimeEnabled: (v: boolean) => void;
  setChartHeight: (v: number) => void;
}

// ——— Filter states ———
interface FiltersState {
  searchQuery: string;
  selectedSymbol: string | null;
  analyticsWindowHours: number;
  strategyResultsLimit: number;
  setSearchQuery: (v: string) => void;
  setSelectedSymbol: (v: string | null) => void;
  setAnalyticsWindowHours: (v: number) => void;
  setStrategyResultsLimit: (v: number) => void;
}

// ——— User settings ———
interface UserSettingsState {
  apiBaseUrl: string;
  preferredRefreshIntervalMs: number;
  setApiBaseUrl: (v: string) => void;
  setPreferredRefreshIntervalMs: (v: number) => void;
}

// ——— Combined store (slices) ———
interface AppStore
  extends UIState,
    ChartState,
    FiltersState,
    UserSettingsState {}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // UI
      sidebarCollapsed: false,
      compactMode: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setCompactMode: (v) => set({ compactMode: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Chart
      chartType: "candlestick",
      showSma: true,
      showEma: false,
      showRsi: true,
      showBrush: true,
      realTimeEnabled: true,
      chartHeight: 320,
      setChartType: (v) => set({ chartType: v }),
      setShowSma: (v) => set({ showSma: v }),
      setShowEma: (v) => set({ showEma: v }),
      setShowRsi: (v) => set({ showRsi: v }),
      setShowBrush: (v) => set({ showBrush: v }),
      setRealTimeEnabled: (v) => set({ realTimeEnabled: v }),
      setChartHeight: (v) => set({ chartHeight: v }),

      // Filters
      searchQuery: "",
      selectedSymbol: null as string | null,
      analyticsWindowHours: 24,
      strategyResultsLimit: 10,
      setSearchQuery: (v) => set({ searchQuery: v }),
      setSelectedSymbol: (v) => set({ selectedSymbol: v }),
      setAnalyticsWindowHours: (v) => set({ analyticsWindowHours: v }),
      setStrategyResultsLimit: (v) => set({ strategyResultsLimit: v }),

      // User settings
      apiBaseUrl: "",
      preferredRefreshIntervalMs: 60_000,
      setApiBaseUrl: (v) => set({ apiBaseUrl: v }),
      setPreferredRefreshIntervalMs: (v) => set({ preferredRefreshIntervalMs: v }),
    }),
    {
      name: "crypto-analytics-app",
      partialize: (s) => ({
        chartType: s.chartType,
        showSma: s.showSma,
        showEma: s.showEma,
        showRsi: s.showRsi,
        showBrush: s.showBrush,
        realTimeEnabled: s.realTimeEnabled,
        chartHeight: s.chartHeight,
        analyticsWindowHours: s.analyticsWindowHours,
        strategyResultsLimit: s.strategyResultsLimit,
        sidebarCollapsed: s.sidebarCollapsed,
        compactMode: s.compactMode,
        preferredRefreshIntervalMs: s.preferredRefreshIntervalMs,
      }),
    }
  )
);
