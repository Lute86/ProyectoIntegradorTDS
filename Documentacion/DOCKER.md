# 🐳 DOCKER

**Guía completa de Docker en este proyecto**

---

## ¿Qué es Docker?

Docker empaqueta la aplicación con todas sus dependencias en contenedores aislados. Así todos tienen el mismo entorno sin importar su máquina.

```
Sin Docker                Con Docker
═══════════════════════════════════════
Instalar Node 22          docker compose up
Instalar PostgreSQL       ✓ Listo
Instalar Nginx            No conflictos
Versiones diferentes      Siempre igual
"En mi máquina funciona"  Funciona en todas
```

---

## 📁 Archivos Docker

### `docker-compose.dev.yml`
**Para desarrollo**

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend.dev   # imagen construida, no node:22 directo
    environment:
      NODE_ENV: development
      DB_DIALECT: sqlite
      DB_STORAGE: /app/data/dev.sqlite             # SQLite embebido (no hay servicio aparte)
    volumes:
      - ./backend:/app
      - /app/node_modules
      - backend_dev_data:/app/data                 # BD SQLite persistente
      - backend_dev_uploads:/app/uploads
    ports:
      - "3000:3000"

  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend.dev
    volumes:
      - ./frontend/src:/app/src                    # Hot-reload (Vite HMR)
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

**Características:**
- Hot-reload habilitado (Vite HMR + Nodemon)
- Imágenes construidas con `Dockerfile.backend.dev` / `Dockerfile.frontend.dev`
- SQLite embebido en el contenedor backend (**no hay servicio `db` aparte**)
- Volúmenes nombrados para persistir BD y uploads entre reinicios
- Logs visibles

### `docker-compose.yml`
**Para producción**

```yaml
services:
  frontend:                       # Nginx (build con Dockerfile.frontend)
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "80:80"                   # redirect HTTP → HTTPS
      - "443:443"
    volumes:
      - ./docker/ssl:/etc/nginx/ssl:ro

  backend:                        # Node/Express (build con Dockerfile.backend)
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    environment:                  # las vars vienen del .env (DB_*, JWT_SECRET, etc.)
      NODE_ENV: production
    volumes:
      - backend_uploads:/app/uploads
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Características:**
- Nginx sirve el build de React y proxea `/api` y `/uploads`
- PostgreSQL 16 (alpine) para la BD
- HTTPS en 443 + redirect desde 80
- **Volúmenes nombrados** para datos permanentes: `postgres_data` (BD) y `backend_uploads` (imágenes)

### `Dockerfile.backend`
**Imagen del backend**

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
# Corre migraciones y luego arranca el servidor
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node src/server.js"]
```

### `Dockerfile.frontend`
**Imagen del frontend**

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🚀 Comandos Docker

### Iniciar desarrollo

```bash
# Opción 1: Con Make
make dev

# Opción 2: Con Docker Compose
docker compose -f docker-compose.dev.yml up --build
```

**Qué pasa:**
1. Descarga/construye imágenes
2. Crea contenedores
3. Inicia servicios
4. Ejecuta migraciones (al arrancar el backend)
5. Muestra las URLs de acceso

> (Prod) Los **seeders no son automáticos**: cargá los datos de ejemplo con `make seed`.

### Detener

```bash
# Con Make
make dev-down

# Con Docker Compose
docker compose -f docker-compose.dev.yml down
```

**Qué pasa:**
- Detiene contenedores
- Preserva datos
- Pueden reiniciarse

### Ver logs

```bash
# Con Make
make logs-dev

# Con Docker Compose
docker compose -f docker-compose.dev.yml logs -f
```

### Acceder a contenedor

```bash
# Con Make
make shell-be-dev

# Con Docker Compose
docker compose -f docker-compose.dev.yml exec backend sh
```

---

## 🔄 Hot-Reload en Desarrollo

Los cambios en tu código se reflejan automáticamente:

```
Tu máquina          Contenedor Docker
═══════════════════════════════════════════
Editas archivo  →   se detecta automático
Guardas (Ctrl+S) →   Vite/Nodemon recarga
Ver en navegador →   Cambios aplicados
```

**Funciona porque:**
- Carpetas están mapeadas como volúmenes
- Vite detecta cambios en tiempo real
- Nodemon reinicia backend al detectar cambios

**No funciona para:**
- Cambios en `package.json` (reinicia Docker)
- Cambios en `.env` (reinicia Docker)
- Cambios en migraciones (ejecuta migrations)

---

## 📦 Imágenes y Capas

### Frontend

```dockerfile
1. node:22-alpine       (Base - build)
2. npm ci               (Dependencias)
3. npm run build        (Compilar Vite → dist/)
4. nginx:1.27-alpine    (Servidor web)
5. copiar dist/ + nginx.conf
```

**Tamaño final:** ~50 MB

### Backend

```dockerfile
1. node:22-alpine       (Base - Node compacto)
2. npm ci --omit=dev    (Dependencias de producción)
3. copiar código        (Source)
4. db:migrate && node src/server.js   (Migra y arranca)
```

**Tamaño final:** ~200 MB

---

## 🔐 Volúmenes

### Qué es un volumen

Un volumen es una carpeta compartida entre tu máquina y el contenedor:

```
Tu máquina              Contenedor
═════════════════════════════════════
./frontend/src    ←→    /app/src
./backend/src     ←→    /app/src
./data/sqlite     ←→    /app/data
```

### Volúmenes en desarrollo

```bash
# frontend
volumes:
  - ./frontend/src:/app/src       # Hot-reload
  
# backend
volumes:
  - ./backend/src:/app/src        # Hot-reload
  - ./data:/app/data              # BD persistente
```

### Volúmenes en producción

```bash
# postgres
volumes:
  - postgres_data:/var/lib/postgresql  # BD permanente

# Nombres de volumen:
# docker volume ls
# docker volume inspect postgres_data
```

---

## 🌐 Networking

### En desarrollo

```
Contenedor Frontend  ←→  Contenedor Backend
      :5173              :3000
      (Vite)             (Express)

Vite proxy detecta /api y redirige:
http://localhost:5173/api/noticias
     ↓ (detección de /api)
http://backend:3000/api/noticias
```

### En producción

```
Usuario → Nginx (puerto 443)
       → Redirige /api
       → Backend (red interna)
       → PostgreSQL (red interna)
```

---

## 🛠️ Mantenimiento

### Limpiar sistema

```bash
# Eliminar contenedores parados
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar volúmenes sin usar
docker volume prune

# Todo lo anterior
docker system prune -a
```

### Ver estado

```bash
# Contenedores en ejecución
docker ps

# Todas las imágenes
docker images

# Volúmenes
docker volume ls

# Logs específicos
docker logs <container_id>
```

---

## 📋 Troubleshooting Docker

### "docker: command not found"

Docker Desktop no está instalado o iniciado.

```bash
# macOS/Windows: Abre Docker Desktop
# Linux: instala docker
sudo apt install docker.io docker-compose
```

### "Cannot connect to Docker daemon"

Docker no está corriendo.

```bash
# Linux
sudo systemctl start docker

# macOS
open /Applications/Docker.app
```

### "Port already allocated"

Otro contenedor usa ese puerto.

```bash
docker ps     # Ver qué usa el puerto
docker stop <id>  # Detener
```

### "No space left on device"

Disco lleno.

```bash
docker system prune -a    # Libera espacio
docker image prune
docker volume prune
```

---

## 🚀 Producción con Docker

### Build de producción

```bash
# Construir imágenes
docker compose build

# Subir a registry (ej: Docker Hub)
docker tag ifts29-backend:latest usuario/ifts29-backend:latest
docker push usuario/ifts29-backend:latest
```

### Deploy

```bash
# Descargar imágenes
docker pull usuario/ifts29-backend:latest

# Iniciar
docker compose -f docker-compose.yml up -d

# Ver logs
docker compose logs -f
```

> ⚠️ **Conflicto de puertos al levantar producción.** El compose de producción
> publica los puertos **80** y **443** (Nginx) y, según el host, **5432**
> (PostgreSQL). Si la máquina ya tiene otro servicio escuchando ahí
> (p. ej. **Apache/`httpd` en el 80**, o un **PostgreSQL local en el 5432**),
> el arranque falla con `Bind for 0.0.0.0:80 failed: port is already allocated`.
>
> ```bash
> sudo ss -ltnp | grep -E ':80|:443|:5432'   # ver qué ocupa el puerto
> sudo systemctl stop apache2                 # liberar el 80 (Debian/Ubuntu)
> sudo systemctl stop postgresql              # liberar el 5432
> ```
>
> Como alternativa, cambiá el mapeo de puertos en `docker-compose.yml`
> (ej. `"8080:80"`). Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → *Puerto ya en uso*.

### SSL/HTTPS

El `docker-compose.yml` incluye certificados en:
- `docker/ssl/cert.pem`
- `docker/ssl/key.pem`

Nginx redirige HTTP → HTTPS automáticamente.

---

## 📚 Ver También

- [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- [INSTALACION_COMPLETA.md](./INSTALACION_COMPLETA.md)
- [COMANDOS_MAKEFILE.md](./COMANDOS_MAKEFILE.md)
