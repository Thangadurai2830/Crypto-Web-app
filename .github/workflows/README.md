# CI/CD

## deploy.yml

- **Trigger:** Push to `main`.
- **Job `test`:** Runs `docker compose -f docker-compose.test.yml up --build --abort-on-container-exit` (backend unit + integration tests).
- **Job `deploy`:** Runs after `test` succeeds; SSHs to the server and runs `git pull && docker compose up -d --build`.

## Required secrets

Set these in the repo **Settings → Secrets and variables → Actions**:

| Secret            | Description                          |
|-------------------|--------------------------------------|
| `DEPLOY_HOST`     | Production server hostname or IP     |
| `DEPLOY_USER`     | SSH user (e.g. `deploy` or `ubuntu`) |
| `DEPLOY_SSH_KEY`  | Private SSH key for that user        |

## Server setup

On the production server:

1. Clone the repo (e.g. `/opt/crypto-app`).
2. Install Docker and Docker Compose (plugin).
3. Add the deploy key to `~/.ssh/authorized_keys` for `DEPLOY_USER`.
4. Ensure `docker compose` runs without sudo if needed (user in `docker` group).

## Test locally

```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```
