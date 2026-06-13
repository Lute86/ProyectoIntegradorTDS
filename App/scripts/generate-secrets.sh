#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-secrets.sh — Genera .env a partir de .env.prod con secrets aleatorios
# Uso: bash scripts/generate-secrets.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
cd "$APP_DIR"

TEMPLATE=".env.prod"
ENV_FILE=".env"

if [ ! -f "$TEMPLATE" ]; then
  echo "✗ No se encontró $TEMPLATE"
  exit 1
fi

if [ -f "$ENV_FILE" ]; then
  echo "⚠  $ENV_FILE ya existe. No se sobreescribe."
  echo "   Si querés regenerarlo, eliminá el archivo primero."
  exit 0
fi

cp "$TEMPLATE" "$ENV_FILE"

JWT_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)

sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" "$ENV_FILE"

echo "✔ $ENV_FILE generado con secrets aleatorios."
echo "  JWT_SECRET: ${JWT_SECRET:0:8}...${JWT_SECRET: -8}"
echo "  DB_PASSWORD: ${DB_PASSWORD:0:4}****"
