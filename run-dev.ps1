# Local dev: run backend and frontend (two terminals required).
# From repo root:
#   .\run-dev.ps1
#
# This script starts the backend. In a second terminal, run the frontend:
#   cd frontend; npm run dev
# Then open http://localhost:3000

$Root = $PSScriptRoot
if (-not $Root) { $Root = "." }

Write-Host "Starting backend (keep this terminal open)." -ForegroundColor Cyan
Write-Host "In another terminal run:  cd frontend; npm run dev" -ForegroundColor Yellow
Write-Host "Then open http://localhost:3000" -ForegroundColor Green
Write-Host ""

& "$Root\backend\run-backend.ps1"
