import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryErrorBoundary } from "./components/common/QueryErrorBoundary/QueryErrorBoundary";
import { Layout } from "./components/Layout";

const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const MarketAnalysis = lazy(() =>
  import("./pages/MarketAnalysis").then((m) => ({ default: m.MarketAnalysis }))
);
const StrategyBacktest = lazy(() =>
  import("./pages/StrategyBacktest").then((m) => ({ default: m.StrategyBacktest }))
);
const CryptoDetail = lazy(() =>
  import("./pages/CryptoDetail").then((m) => ({ default: m.CryptoDetail }))
);
const Settings = lazy(() => import("./pages/Settings").then((m) => ({ default: m.Settings })));

function PageFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center text-[var(--color-text-muted)]">
      Loading…
    </div>
  );
}

function App() {
  return (
    <QueryErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="analysis"
            element={
              <Suspense fallback={<PageFallback />}>
                <MarketAnalysis />
              </Suspense>
            }
          />
          <Route
            path="strategy"
            element={
              <Suspense fallback={<PageFallback />}>
                <StrategyBacktest />
              </Suspense>
            }
          />
          <Route
            path="crypto/:symbol"
            element={
              <Suspense fallback={<PageFallback />}>
                <CryptoDetail />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryErrorBoundary>
  );
}

export default App;
