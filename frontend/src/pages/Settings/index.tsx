import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, healthApi } from "../../services/api";

export function Settings() {
  const { data: health, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => healthApi.check().then((r) => r.data),
    retry: 1,
    staleTime: 30_000,
    throwOnError: false,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[var(--color-text)]">Settings</h1>

      <section className="card space-y-4 p-6" aria-labelledby="api-heading">
        <h2 id="api-heading" className="text-lg font-medium text-[var(--color-text)]">
          API &amp; Backend
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          API base URL is set via{" "}
          <code className="rounded bg-[var(--color-border)] px-1.5 py-0.5 font-mono text-sm">
            VITE_API_URL
          </code>{" "}
          (default: <code className="rounded bg-[var(--color-border)] px-1.5 py-0.5 font-mono text-sm">/api</code> with
          Vite proxy in dev).
        </p>
        <dl className="grid gap-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <dt className="text-[var(--color-text-muted)]">REST base:</dt>
            <dd className="font-mono text-[var(--color-text)]">{apiBaseURL}</dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <dt className="text-[var(--color-text-muted)]">Backend status:</dt>
            <dd>
              {isLoading ? (
                <span className="text-[var(--color-text-muted)]">Checking…</span>
              ) : isError ? (
                <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                  Unreachable — start the backend (e.g. <code className="rounded bg-[var(--color-border)] px-1 font-mono text-xs">.\backend\run-backend.ps1</code>)
                </span>
              ) : health?.status === "ok" ? (
                <span className="inline-flex items-center gap-1.5 text-[var(--color-success)] dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" aria-hidden />
                  Connected
                </span>
              ) : (
                <span className="text-[var(--color-text-muted)]">{health?.status ?? "Unknown"}</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card space-y-2 p-6" aria-labelledby="prefs-heading">
        <h2 id="prefs-heading" className="text-lg font-medium text-[var(--color-text)]">
          Preferences
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Theme (light/dark) and chart options are in the Dashboard. Data source is configured on the backend (e.g.
          CoinGecko).
        </p>
      </section>
    </div>
  );
}
