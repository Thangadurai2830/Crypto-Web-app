#!/usr/bin/env bash
# Database backup example (PostgreSQL). Schedule with cron, e.g. daily:
# 0 2 * * * /opt/crypto-app/scripts/backup-db.example.sh
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/crypto-app}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
# From env or .env: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
PGDATABASE="${PGDATABASE:-crypto_db}"
PGUSER="${PGUSER:-crypto_user}"

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/crypto_db_$TIMESTAMP.sql.gz"

pg_dump -U "$PGUSER" -d "$PGDATABASE" --no-owner --no-acl | gzip > "$FILE"
echo "Backup written: $FILE"

# Remove backups older than RETENTION_DAYS
find "$BACKUP_DIR" -name "crypto_db_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
