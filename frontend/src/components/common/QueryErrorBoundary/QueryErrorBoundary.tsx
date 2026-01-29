import { useState, type ReactNode } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "../ErrorBoundary";
import { Button } from "../Button";

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/** Error boundary that resets React Query when user clicks "Try again". */
export function QueryErrorBoundary({ children, fallback }: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();
  const [key, setKey] = useState(0);

  const handleRetry = () => {
    reset();
    setKey((k) => k + 1);
  };

  const defaultFallback = (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">Something went wrong</h3>
      <p className="max-w-md text-center text-sm text-[var(--color-text-muted)]">
        A request failed. You can try again.
      </p>
      <Button variant="ghost" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );

  return (
    <ErrorBoundary key={key} fallback={fallback ?? defaultFallback}>
      {children}
    </ErrorBoundary>
  );
}
