#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/oracle_seed_checks.sql"

ORACLE_CONTAINER="${ORACLE_CONTAINER:-oracledb}"
ORACLE_USER="${ORACLE_USER:-Adolfo}"
ORACLE_PASSWORD="${ORACLE_PASSWORD:-password}"
ORACLE_SERVICE="${ORACLE_SERVICE:-XEPDB1}"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "ERROR: SQL validation file not found: $SQL_FILE"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed or not available in PATH."
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$ORACLE_CONTAINER"; then
  echo "ERROR: Oracle container '$ORACLE_CONTAINER' is not running."
  echo "Start it first with Docker Compose before running this verification."
  exit 1
fi

echo "Checking Oracle seed data in container '$ORACLE_CONTAINER'..."

OUTPUT="$({
  docker exec -i "$ORACLE_CONTAINER" sh -lc "sqlplus -s ${ORACLE_USER}/${ORACLE_PASSWORD}@//localhost:1521/${ORACLE_SERVICE}" < "$SQL_FILE"
} 2>&1)" || {
  echo "ERROR: could not execute sqlplus validation against ${ORACLE_SERVICE}."
  echo "$OUTPUT"
  exit 1
}

FAILURES=0

while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  echo "$line"
  if [[ "$line" == CHECK\|* ]] && [[ "$line" == *"|status=FAIL" ]]; then
    FAILURES=$((FAILURES + 1))
  fi
done <<< "$OUTPUT"

if (( FAILURES > 0 )); then
  echo
  echo "Seed verification failed with ${FAILURES} failing check(s)."
  echo "Re-run V1__init_schema.sql and V2__seed_data.sql, then execute this script again."
  exit 1
fi

echo
echo "Oracle seed verification passed. Students can continue with the application startup steps."