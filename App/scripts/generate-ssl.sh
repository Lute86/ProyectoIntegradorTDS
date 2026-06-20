#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-ssl.sh — Genera certificado SSL auto-firmado con openssl
# Uso: bash scripts/generate-ssl.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
cd "$APP_DIR"

SSL_DIR="./docker/ssl"
mkdir -p "$SSL_DIR"

if [ -f "$SSL_DIR/cert.pem" ]; then
  echo "⚠  Certificados ya existen en $SSL_DIR/"
  echo "   Si querés regenerarlos, eliminá la carpeta $SSL_DIR/ primero."
  exit 0
fi

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$SSL_DIR/key.pem" \
  -out "$SSL_DIR/cert.pem" \
  -subj "/C=AR/ST=Buenos Aires/L=CABA/O=IFTS29/CN=localhost" \
  2>/dev/null

echo "✔ Certificado auto-firmado generado en $SSL_DIR/"
echo "  Cert: $SSL_DIR/cert.pem"
echo "  Key:  $SSL_DIR/key.pem"
echo "  Válido por 365 días."
