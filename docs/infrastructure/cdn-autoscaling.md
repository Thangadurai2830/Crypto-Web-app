# CDN and auto-scaling

## CDN for static assets

- **Purpose:** Serve frontend static files (JS, CSS, images, fonts) from edge locations to reduce latency and origin load.
- **Setup:** Point your CDN (CloudFront, Cloudflare, Fastly, etc.) to the frontend origin (Nginx or object storage). Use the same host as the API or a subdomain (e.g. `cdn.example.com`).
- **Cache:** Set long cache for hashed assets (e.g. `*.js`, `*.css` with content hash); short or no cache for `index.html` so users get new builds.
- **CORS:** If assets are on a different origin, ensure CORS and CSP allow the CDN domain.

## Auto-scaling

- **Backend:** Scale horizontally (more replicas) when CPU or request rate exceeds a threshold. Ensure:
  - **Database:** Connection pool size × replicas does not exceed DB max connections.
  - **Rate limiting:** Use Redis (or shared store) so limits are per client across replicas (`REDIS_URL`).
  - **Scheduler:** Only one replica should run APScheduler jobs, or use a distributed lock (e.g. Redis) to avoid duplicate ingest/cleanup.
- **Frontend:** Scale Nginx (or static hosting) replicas behind a load balancer; no shared state.
- **Example (K8s HPA):** Scale backend deployment when CPU > 70% or custom metric (e.g. request rate). Example: `kubectl autoscale deployment backend --min=2 --max=10 --cpu-percent=70`.
