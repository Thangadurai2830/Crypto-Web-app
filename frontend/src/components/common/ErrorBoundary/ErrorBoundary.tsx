import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../Button";

interface Props {
  children: ReactNode;
  /** Optional fallback UI */
  fallback?: ReactNode;
  /** Called when error is caught (e.g. log to service) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Something went wrong</h3>
          <p className="max-w-md text-center text-sm text-[var(--color-text-muted)]">
            {this.state.error.message}
          </p>
          <Button
            variant="ghost"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
