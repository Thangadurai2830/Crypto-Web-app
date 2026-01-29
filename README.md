# Crypto Market Data & Analytics Application

Full-stack application for crypto market data ingestion, analytics, and trading strategy backtesting. Backend: **FastAPI** (Python). Frontend: **React + Vite + TypeScript**.

---

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "Crypto market website"
   ```

2. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if needed (defaults: SQLite, CoinGecko, no API key).

3. **Start with Docker Compose**

   ```bash
   docker compose up -d
   ```

4. **Access the application**
   - **Frontend:** http://localhost:80 (or http://localhost if port 80)
   - **Backend API:** http://localhost:8000
   - **API docs (Swagger):** http://localhost:8000/docs
   - **API docs (ReDoc):** http://localhost:8000/redoc

**Without Docker:** run backend and frontend in **two terminals** (see [CONNECTING.md](CONNECTING.md)): from repo root run `.\backend\run-backend.ps1` in one terminal and `cd frontend && npm run dev` in another; or run `.\run-dev.ps1` to start the backend (it reminds you to run the frontend in a second terminal). Frontend at http://localhost:3000 with Vite proxy to backend.

---

## Features

- **Real-time market data** — Ingestion from CoinGecko (top assets by market cap), optional Binance; scheduled and on-demand refresh.
- **Advanced analytics engine** — Price/volume change %, moving averages (SMA, EMA), momentum indicators (RSI, MACD), volume analysis, performance ranking.
- **Trading strategy module** — MA crossover, momentum (threshold), momentum RSI; backtesting with performance metrics; persisted runs and signals.
- **Professional dashboard** — React UI: market table, analytics cards, candlestick/volume/RSI charts, strategy panel, WebSocket live prices, dark/light theme, responsive layout.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Frontend (React/Vite)                       │
│  Dashboard │ Market Analysis │ Strategy Backtest │ Settings              │
│  Charts (Recharts) │ WebSocket live prices │ Zustand + React Query        │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ /api, /ws
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Nginx (production) or Vite proxy (dev)            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Backend (FastAPI)                                 │
│  /v1/markets │ /v1/analytics │ /v1/strategy │ /health │ /metrics         │
│  Rate limit │ CORS │ Request ID │ Structured logging │ Prometheus       │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   PostgreSQL    │      │   Redis         │      │   CoinGecko API  │
│   (SQLite dev)  │      │   (optional)    │      │   (data source)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│   APScheduler   │      │   Analytics     │
│   (ingest,      │      │   (Pandas,       │
│   analytics,    │      │   indicators)   │
│   cleanup)      │      │                 │
└─────────────────┘      └─────────────────┘
```

- **Data flow:** CoinGecko → Backend ingestion → DB; API serves markets, analytics, strategy; Frontend consumes API and WebSocket.
- **Stack:** Backend: FastAPI, SQLAlchemy (async), Pandas, APScheduler. Frontend: React, Vite, Tailwind, Recharts, React Query, Zustand.

---

## Configuration

### Environment variables

Copy `.env.example` to `.env` in the **project root**. Key variables:

| Variable                               | Description                            | Default                                          |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`                         | PostgreSQL or SQLite connection string | `sqlite+aiosqlite:///./crypto_analytics.db`      |
| `DATA_SOURCE`                          | `coingecko` \| `binance` \| `both`     | `coingecko`                                      |
| `TOP_N_ASSETS`                         | Number of top assets to ingest         | `10`                                             |
| `FETCH_INTERVAL_MINUTES`               | Ingestion interval                     | `5`                                              |
| `CORS_ORIGINS`                         | Allowed origins (comma-separated)      | `http://localhost:3000`, `http://127.0.0.1:3000` |
| `RATE_LIMIT_ENABLED`                   | Enable per-IP rate limiting            | `true`                                           |
| `RATE_LIMIT_REQUESTS_PER_MINUTE`       | Max requests per window                | `60`                                             |
| `API_KEY_ENABLED`                      | Require `X-API-Key` for `/v1`          | `false`                                          |
| `API_KEY_CURRENT` / `API_KEY_PREVIOUS` | API keys (rotation supported)          | —                                                |

See `.env.example` and `backend/SECURITY.md` for full list (CORS, rate limit, API key, Redis, Sentry, etc.).

### Running without Docker

**Backend**

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
# Set PYTHONPATH and DATABASE_URL (e.g. in .env)
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000 (proxies `/api` and `/api/ws` to backend). See **[CONNECTING.md](CONNECTING.md)** for how frontend and backend are wired and how to run both locally.

---

## Testing

### Backend (pytest)

```bash
cd backend
pip install -r requirements/dev.txt
pytest
pytest tests/unit tests/integration -m "not slow"
pytest --cov=src --cov-report=html
```

See `backend/TESTING.md` for unit, integration, DB transaction, and load tests.

### Frontend (Vitest, Cypress)

```bash
cd frontend
npm install
npm run test:run
npm run test:coverage
npm run e2e          # with dev server on :3000
```

See `frontend/TESTING.md` for component, integration, E2E, and Lighthouse.

### CI

```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

---

## Deployment

- **Docker Compose (production):** `docker compose up -d` — backend (Gunicorn + Uvicorn workers), frontend (Nginx), Postgres, Redis. See `backend/docker/DEPLOY.md` and `frontend/DEPLOY.md`.
- **CI/CD:** GitHub Actions workflow `.github/workflows/deploy.yml` — test on push to `main`, then deploy via SSH. See `.github/workflows/README.md` for secrets and server setup.
- **Monitoring:** `docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d` — Prometheus, Grafana, Alertmanager, ELK (Elasticsearch, Kibana, Filebeat). See `MONITORING.md`.
- **Production readiness:** See `PRODUCTION_CHECKLIST.md` for infrastructure (backups, SSL, CDN, load balancer, auto-scaling), application (health, graceful shutdown, circuit breakers, retry, rate limiting), and monitoring (uptime, errors, alerts, business metrics).

---

## API Documentation

- **Swagger UI (interactive):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/openapi.json

When `API_KEY_ENABLED=true`, use the **Authorize** button in Swagger and set the `X-API-Key` header. All `/v1` endpoints then require this header (current or previous key for rotation).

---

## Project structure

```
Crypto market website/
├── backend/
│   ├── src/           # API (v1), core (config, DB, logging, metrics, security), models, services, tasks
│   ├── tests/         # unit, integration, load
│   ├── alembic/       # migrations
│   ├── requirements/
│   └── docker/        # Dockerfile, Dockerfile.test, DEPLOY.md
├── frontend/
│   ├── src/           # components, pages, services, store, contexts, utils
│   ├── e2e/           # Cypress E2E
│   ├── Dockerfile
│   ├── nginx.conf
│   └── DEPLOY.md, TESTING.md, SECURITY.md
├── monitoring/        # Prometheus, Alertmanager, Grafana, Filebeat, ELK configs
├── .github/workflows/  # deploy.yml, README
├── docker-compose.yml
├── docker-compose.test.yml
├── docker-compose.monitoring.yml
├── .env.example
├── MONITORING.md
└── README.md
```

---

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Follow existing code style (backend: Black/isort optional; frontend: ESLint).
3. Add or update tests for new behavior (backend: pytest; frontend: Vitest/RTL).
4. Ensure CI passes: `docker compose -f docker-compose.test.yml up --abort-on-container-exit` and frontend `npm run test:run`.
5. Open a pull request with a short description of the change; reference any issues.

---

## License

See repository license file.
