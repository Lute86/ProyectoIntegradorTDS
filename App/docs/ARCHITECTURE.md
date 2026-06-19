# Arquitectura - IFTS 29 Nueva Web

## Visión General

La aplicación utiliza una arquitectura de **frontend y backend separados**, containerizada con **Docker** y orquestada con **Docker Compose**. En producción, **Nginx** actúa como reverse proxy y servidor web.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO (Browser)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │      Nginx :80/443    │  (Producción)
                    │  - Redirect HTTP→HTTPS│
                    │  - Sirve React build  │
                    │  - Proxy /api,/uploads│
                    └───────────┬───────────┘
                                │
            ┌───────────────────┴───────────────────┐
            │                                       │
    ┌───────▼────────┐                    ┌───────▼────────┐
    │  Frontend       │                    │   Backend       │
    │  (React/Vite)   │◄──── API ────────►│  (Express)      │
    │  Puerto: 5173   │                    │  Puerto: 3000   │
    └────────────────┘                    └───────┬────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │   Base de Datos    │
                                        │  SQLite (dev)     │
                                        │  PostgreSQL (prod) │
                                        └───────────────────┘
```

## Servicios Docker

### 1. Frontend (React + Vite)

| Ambiente | Imagen | Funcionalidad |
|----------|--------|---------------|
| Desarrollo | `node:22-alpine` | Vite dev server con HMR (Hot Module Replacement) en puerto 5173 |
| Producción | `nginx:1.27-alpine` | Sirve el build estático generado por Vite |

**Desarrollo** (`Dockerfile.frontend.dev`):
- Monta `frontend/src` como volumen para live-reload
- Ejecuta `npm run dev -- --host 0.0.0.0`

**Producción** (`Dockerfile.frontend`):
- Multi-stage build: Stage 1 compila con `npm run build`, Stage 2 copia a Nginx
- El build se sirve desde `/usr/share/nginx/html`

### 2. Backend (Express + Sequelize)

| Ambiente | Imagen | Base de Datos |
|----------|--------|---------------|
| Desarrollo | `node:22-alpine` + nodemon | SQLite (archivo `dev.sqlite`) |
| Producción | `node:22-alpine` (multi-stage) | PostgreSQL |

**Desarrollo** (`Dockerfile.backend.dev`):
- Nodemon para hot-reload al modificar `src/`
- Ejecuta migraciones y seeders automáticamente al iniciar
- Base de datos SQLite persistente vía volumen `backend_dev_data`

**Producción** (`Dockerfile.backend`):
- Multi-stage build: instala solo `dependencies` (omite devDependencies)
- Usuario no-root (`appuser`) por seguridad
- Ejecuta migraciones antes de iniciar el servidor

### 3. Nginx (Solo Producción)

**Archivo**: `docker/nginx.conf`

Funcionalidades:
- **Puerto 80**: Redirige todo el tráfico HTTP a HTTPS (excepto challenge de Let's Encrypt)
- **Puerto 443**: Sirve la aplicación con SSL/TLS
- **Proxy inverso `/api/`**: se reenvía al backend en `http://backend:3000`
- **Proxy `/uploads/`**: bloque `location ^~ /uploads/` que reenvía los archivos subidos al backend (el `^~` evita que la regex de assets los capture y devuelva 404)
- **SPA Fallback**: Rutas de React Router devuelven `index.html`
- **Cache**: Assets estáticos con hash tienen cache de 1 año
- **SSL**: Actualmente certificado **auto-firmado** (Let's Encrypt previsto - no implementado)

## Docker Compose

### Desarrollo (`docker-compose.dev.yml`)

```yaml
services:
  backend:
    build: docker/Dockerfile.backend.dev
    ports: "3000:3000"
    volumes: ./backend:/app (código), backend_dev_data (SQLite)
    
  frontend:
    build: docker/Dockerfile.frontend.dev
    ports: "5173:5173"
    volumes: ./frontend/src:/app/src (live-reload)
```

**Red**: `dev-net` (bridge) para comunicación entre contenedores.

### Producción

El `Makefile` usa `docker compose up` (sin archivo `-f` específico, busca `docker-compose.yml` o `compose.yml`). La producción incluye:
- Frontend con Nginx
- Backend con Node.js
- Base de datos PostgreSQL
- Volúmenes para uploads y certificados SSL

## Flujo de una Petición (Producción)

1. Usuario accede a `https://dominio.com`
2. Nginx recibe la petición en puerto 443
3. Si es `/api/*` o `/uploads/*`: Nginx hace proxy a `backend:3000` en la red interna de Docker
4. Si es cualquier otra ruta: Nginx sirve `index.html` (SPA fallback)
5. React Router maneja el enrutamiento del lado del cliente

## Variables de Entorno

Archivo base: `.env.example`

**Backend**:
- `NODE_ENV`: development | production
- `PORT`: 3000
- `DB_DIALECT`: sqlite | postgres
- `DB_STORAGE`: ruta al archivo SQLite (dev)
- `JWT_SECRET`: clave secreta para tokens
- `JWT_EXPIRES_IN`: tiempo de expiración (ej: 7d)

**Frontend**:
- `VITE_API_URL`: URL del backend para peticiones API

## Volúmenes Persistentes

| Volumen | Propósito |
|---------|-----------|
| `backend_dev_data` | Base de datos SQLite en desarrollo |
| `backend_dev_uploads` | Archivos subidos en desarrollo |
| `certbot_conf` | Certificados SSL (producción) |
| `certbot_www` | Challenge de Let's Encrypt (producción) |
