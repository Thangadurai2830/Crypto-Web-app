# Load balancer setup

## Purpose

- Distribute traffic across multiple backend/frontend instances.
- Single entry point (and SSL termination) for clients.
- Health checks so unhealthy instances are not sent traffic.

## Options

### 1. Nginx as load balancer

Upstream multiple backend instances:

```nginx
upstream backend {
    least_conn;
    server backend1:8000 max_fails=3 fail_timeout=30s;
    server backend2:8000 max_fails=3 fail_timeout=30s;
}
server {
    location /api/ {
        proxy_pass http://backend;
        proxy_next_upstream error timeout http_502 http_503;
    }
}
```

Use `GET /health` or `GET /health/detailed` for health checks (e.g. with `health_check` in NGINX Plus or a custom check script).

### 2. Cloud load balancers

- **AWS:** ALB in front of ECS/EKS or EC2; target group health check to `GET /health`.
- **GCP:** Load balancer with backend service; health check to `/health`.
- **Azure:** Application Gateway or Load Balancer; probe to `/health`.

### 3. Docker Compose scale

```bash
docker compose up -d --scale backend=3
```

Put a reverse proxy (e.g. Nginx or Traefik) in front that balances to `backend:8000` (Compose’s internal DNS round-robins across replicas).

## Considerations

- **Rate limiting:** With multiple backend replicas, use a shared store (e.g. Redis) for rate limits so limits are per client across instances (already supported when `REDIS_URL` is set).
- **Sessions:** This API is stateless; no sticky sessions required.
- **Health:** Use `/health` for liveness and `/health/detailed` for readiness (DB must be up).
