# Modulo 13 - Configuración Backend Producción

## Resumen de cambios

Se configura el entorno de producción completo: conexión segura a PostgreSQL, Dockerfiles optimizados, nginx con HTTPS/TLS 1.2+, health check con verificación de base de datos, scripts de generación de secrets y certificados SSL, y despliegue con un solo comando.

**Cambios principales:**
- Habilitar SSL en la conexión a PostgreSQL en producción (`database.js`)
- Crear archivo `.env.prod` (template de variables de entorno — **se commitea**, los secrets se generan automáticamente)
- Crear `Dockerfile.frontend` (nginx:alpine) y `Dockerfile.backend` (Node 22 Alpine)
- Crear configuraciones nginx: `ssl.conf`, `frontend.conf`, `backend.conf`
- Crear `docker-compose.yml` para producción (PostgreSQL + Node + Nginx en HTTPS)
- Crear scripts: `generate-secrets.sh` (genera `.env` desde `.env.prod`) y `generate-ssl.sh` (certificado auto-firmado)
- Health check `/api/health` ahora valida la conexión a la base de datos
- Frontend API URL usa `window.location.origin` (funciona en dev y prod)
- Security headers en nginx (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- HTTP→HTTPS redirect en nginx
- Makefile: `make prod-first` (setup completo), `make prod`, `make prod-down`, `make prod-reset`

## Detalle de implementación

### 1. PostgreSQL SSL en producción (`database.js`)

```js
// ANTES
production: {
  dialect: 'postgres',
  dialectOptions: { ssl: false },
}

// DESPUÉS
production: {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}
```

Las queries viajan encriptadas entre Node y PostgreSQL. Solo aplica en producción (dev usa SQLite).

### 2. Health check con DB (`app.js`)

```js
// ANTES
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// DESPUÉS
app.get('/api/health', async (_req, res) => {
  try {
    await models.sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected', env: process.env.NODE_ENV });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected', env: process.env.NODE_ENV });
  }
});
```

Permite a load balancers y monitoreo verificar que la aplicación tiene conexión a la base de datos.

### 3. `.env.prod` (template)

```env
NODE_ENV=production
PORT=3000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ifts29_prod
DB_USER=
DB_PASSWORD=

# Frontend
FRONTEND_URL=https://tu-dominio.com

# JWT
JWT_SECRET=generar_clave_secreta_64_chars_minimo
JWT_EXPIRES_IN=8h

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Logs
LOG_LEVEL=warn
```

### 4. CORS env var (`backend/.env`)

```env
# ANTES
CORS=http://localhost:5173

# DESPUÉS
FRONTEND_URL=http://localhost:5173
```

La variable `CORS` nunca era leída por `app.js` (que usa `FRONTEND_URL`). Se eliminó la inconsistencia.

### 5. `.gitignore`

```
# AGREGADO
.env              # secrets generados (nunca commitear)
docker/ssl/       # certificados generados
docker-compose.dev.yml  # compose de desarrollo

# .env.prod SÍ se commitea (es el template)
```

### 6. Docker + Nginx (producción)

**`docker/Dockerfile.frontend`** — nginx:alpine sirve el SPA con HTTPS.
**`docker/Dockerfile.backend`** — Node 22 Alpine ejecuta Express.
**`docker/nginx/ssl.conf`** — TLS 1.2/1.3, ciphers fuertes, HSTS, CSP.
**`docker/nginx/frontend.conf`** — SPA + proxy_pass al backend.
**`docker/nginx/backend.conf`** — Reverse proxy a ifts29-backend:3000.
**`docker-compose.yml`** — Stack completo: postgres (con healthcheck), backend, frontend nginx.

### 7. Scripts de configuración

**`scripts/generate-secrets.sh`** — Copia `.env.prod` → `.env`, genera `JWT_SECRET` y `DB_PASSWORD` con `openssl rand`.
**`scripts/generate-ssl.sh`** — Genera certificado auto-firmado en `docker/ssl/` (365 días, RSA 2048).

### 8. Makefile — Targets de producción

```bash
make prod-first    # Primera vez: setup-prod + ssl-selfsigned + prod
make setup-prod    # Genera .env desde .env.prod con secrets aleatorios
make ssl-selfsigned # Genera certificado SSL auto-firmado
make prod          # Levanta producción (HTTPS en puerto 443)
make prod-down     # Detiene producción
make prod-reset    # Detiene y borra volúmenes (⚠ borra la BD)
```

## Variables de entorno necesarias (producción)

El template `.env.prod` en la raíz del proyecto contiene todas las variables. Al ejecutar `make setup-prod`, se genera `.env` con secrets aleatorios para `JWT_SECRET` y `DB_PASSWORD`.

## Tests

Ejecutar todos los tests: `make tests-back`

## Archivos creados/modificados

### Nuevos:
- `.env.prod` (template de entorno — commiteado)
- `docker/Dockerfile.frontend`
- `docker/Dockerfile.backend`
- `docker/nginx/ssl.conf`
- `docker/nginx/frontend.conf`
- `docker/nginx/backend.conf`
- `docker-compose.yml` (producción)
- `scripts/generate-secrets.sh`
- `scripts/generate-ssl.sh`

### Modificados:
- `backend/src/config/database.js` (SSL en producción)
- `backend/src/app.js` (health check con DB)
- `backend/src/index.js` (ESM imports, swagger.json)
- `backend/src/config/db.js` (ESM imports)
- `backend/tests/helpers/app.js` (ESM imports)
- `backend/package.json` (ESM `"type": "module"`, jest.config.cjs)
- `frontend/src/services/api.js` (API URL con window.location.origin)
- `Makefile` (targets de producción)
- `.gitignore` (`.env`, `docker/ssl/`, `docker-compose.dev.yml`)
