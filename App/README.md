# IFTS 29 — Nueva Web · GoSoftware

---

## Índice

1. [¿Qué es Docker y por qué lo usamos?](#1-qué-es-docker-y-por-qué-lo-usamos)
2. [Cómo trabajar con Docker corriendo](#2-cómo-trabajar-con-docker-corriendo)
3. [Inicio rápido](#3-inicio-rápido)
4. [Producción y HTTPS](#4-producción-y-https)
5. [Cómo funciona Nginx en este proyecto](#5-cómo-funciona-nginx-en-este-proyecto)
6. [Cómo funciona Certbot / Let's Encrypt](#6-cómo-funciona-certbot--lets-encrypt)
7. [Git workflow del equipo](#7-git-workflow-del-equipo)
8. [Qué hacer cuando algo se rompe después de un pull](#8-qué-hacer-cuando-algo-se-rompe-después-de-un-pull)
9. [Referencia de comandos](#9-referencia-de-comandos)
10. [Variables de entorno](#10-variables-de-entorno)

---

## 1. ¿Qué es Docker y por qué lo usamos?

Docker empaqueta cada parte del sistema en un **contenedor**: un entorno
aislado que incluye el código, el runtime exacto (Node 22, PostgreSQL 16,
Nginx 1.27) y todas las dependencias, sin importar qué versiones tenga
instaladas la máquina donde corra.

### Docker vs. instalación manual

| Situación | Sin Docker | Con Docker |
|---|---|---|
| Setup inicial | Instalar Node, PostgreSQL y Nginx por separado, cada uno con su versión exacta | `make dev` y listo |
| Incorporar un integrante nuevo | ~1-2 horas instalando y configurando | ~5 minutos |
| "En mi máquina funciona" | Versiones distintas entre devs causan bugs difíciles de reproducir | Todos corren exactamente el mismo entorno |
| Cambiar de máquina o servidor | Reinstalar y reconfigurar todo | Copiar el repo y el `.env` |
| Dev vs. producción | Configuración manual diferente en cada lado | Dos archivos compose, mismas imágenes base |

**Para este proyecto:** son 4 personas en máquinas distintas. Docker garantiza
que todos compilan con Node 22 y corren la misma versión de PostgreSQL, sin
conflictos con otras versiones instaladas localmente.

---

## 2. Cómo trabajar con Docker corriendo

> **Respuesta corta:** en desarrollo, exactamente igual que siempre.
> Editás archivos en tu editor, guardás, y los cambios se aplican solos.
> No tenés que hacer nada dentro de los contenedores.

### Cómo funciona el hot-reload

Cuando levantás el entorno (`docker compose -f docker-compose.dev.yml up --build`,
o `make dev`), Docker monta las carpetas de código como
**volúmenes** dentro de los contenedores:

```
Tu máquina              Contenedor Docker
─────────────────────   ──────────────────────────────────────
./frontend/src/    ───▶  /app/src/   (Vite detecta cambios al instante)
./backend/src/     ───▶  /app/src/   (Nodemon reinicia el servidor solo)
```

El contenedor ejecuta tu código local en tiempo real. Guardás un archivo,
Vite o Nodemon lo detectan, y el browser o el servidor se actualiza solo.
Igual que `npm run dev`, pero dentro de Docker.

> En desarrollo se usa el compose `docker-compose.dev.yml`. Todos los comandos
> de esta sección lo referencian con `-f docker-compose.dev.yml`; el `make <algo>`
> equivalente está entre paréntesis como atajo (Linux/macOS/WSL).

### Flujo diario normal

No es necesario acceder a los contenedores ni ejecutar comandos extra.

### Cuándo SÍ necesitás un paso extra

Hay tres situaciones donde Docker requiere intervención:

#### a) Alguien agregó una dependencia npm

```bash
# Después de git pull, reconstruir las imágenes (ejecuta npm install adentro)
docker compose -f docker-compose.dev.yml down            # (make dev-down)
docker compose -f docker-compose.dev.yml up --build      # (make dev)
```

Los `node_modules` no están montados como volumen (son pesados y específicos
de cada plataforma). Reconstruir la imagen instala las nuevas dependencias
dentro del contenedor.

#### b) Hay una migración nueva de base de datos

```bash
docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate   # (make migrate-dev)
```

Las migraciones no se ejecutan solas al guardar el archivo. Hay que
correrlas explícitamente, o bien reconstruir el entorno con
`docker compose -f docker-compose.dev.yml down` y `... up --build`
(`make dev-down && make dev`); el contenedor corre `db:migrate`
automáticamente al arrancar.

#### c) Debuggear o explorar el servidor

```bash
docker compose -f docker-compose.dev.yml logs -f            # (make logs-dev)      ver logs en tiempo real
docker compose -f docker-compose.dev.yml exec backend sh    # (make shell-be-dev)  shell dentro del backend
```

### Resumen

| Situación | Comando Docker | Atajo make |
|---|---|---|
| Cambié código fuente | Nada — hot-reload automático | — |
| Alguien agregó una dependencia | `docker compose -f docker-compose.dev.yml down` + `... up --build` | `make dev-down && make dev` |
| Hay una migración nueva | `docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate` | `make migrate-dev` |
| Quiero ver los logs | `docker compose -f docker-compose.dev.yml logs -f` | `make logs-dev` |

---

## 3. Inicio rápido

### En Windows (sin WSL)
Windows no puede usar `make` de forma nativa. Usá la terminal de Docker (Docker Desktop) o PowerShell con el siguiente flujo:

```powershell
# 1. Clonar el repositorio
git clone <url-del-repo> && cd PI

# 2. Crear el archivo de entorno (en dev no hace falta editar nada)
cp .env.example .env

# 3. Levantar desarrollo (PowerShell en Windows)
docker compose -f docker-compose.dev.yml up --build
```

Para detener: `docker compose -f docker-compose.dev.yml down`

### En Linux/macOS (o WSL con Makefile)
```bash
# 1. Clonar el repositorio
git clone <url-del-repo> && cd PI

# 2. Crear el archivo de entorno (en dev no hace falta editar nada)
cp .env.example .env

# 3. Levantar desarrollo
make dev
```

Al primer arranque (dev) el backend ejecuta automáticamente las **migraciones**
(`npx sequelize-cli db:migrate`), creando las tablas en SQLite y **seeds** (equivale a `npx sequelize-cli db:seed:all` dentro del contenedor).

**URLs disponibles:**
- Frontend: http://localhost:5173
- Backend:  http://localhost:3000/api

### Credenciales del admin (seed de dev — `make seed-dev` / `01-user-seeder.js`)

El seeder crea el admin con contraseña fija `admin1234` para ingreso fácil en desarrollo:

| Campo    | Valor               |
|----------|---------------------|
| Email    | admin@ifts29.edu.ar |
| Password | admin1234           |


---

## 4. Producción y HTTPS

```bash
bash scripts/generate-secrets.sh   # (make setup-prod)  genera .env con secrets (JWT_SECRET, DB_PASSWORD)
# Editar .env: DOMAIN y FRONTEND_URL

# verificar que el .env esté completo  (make check-env)
bash scripts/generate-ssl.sh        # (make ssl-selfsigned) genera el cert auto-firmado
docker compose up --build -d        # (make prod)  levanta todo en background
```

> El target `make prod` encadena `check-env` + `ssl-selfsigned` + `docker compose up --build -d`.
> Si lo corrés a mano, generá el certificado auto-firmado antes de levantar.

El sitio queda disponible en `https://<DOMAIN>` (con **certificado auto-firmado**,
el navegador mostrará un aviso de seguridad).

### Carga de datos en producción

**No hay seeders automáticos en producción.** El arranque corre las migraciones
(crea las tablas), pero la base queda vacía. Los datos se cargan a mano:

```bash
# Crear/actualizar un usuario (admin por defecto, o pasando EMAIL/PASSWORD/ROL)
docker compose exec backend node scripts/create-user.js              # (make seed-user)
docker compose exec backend env EMAIL=otro@ifts29.edu.ar PASSWORD=... ROL=admin \
  node scripts/create-user.js

# Cargar el resto de los datos de ejemplo (carreras, noticias, etc.) con los seeders
docker compose exec backend npx sequelize-cli db:seed:all            # (make seed)
```

> ⚠️ **Let's Encrypt (`make ssl`) todavía NO está implementado**: el servicio
> `certbot` referenciado no existe en `docker-compose.yml`. Para producción hoy
> se usa el certificado auto-firmado. Ver sección 6.

---

## 5. Cómo funciona Nginx en este proyecto

Nginx es el servidor que hace de intermediario entre Internet y los servicios
internos. Tiene tres responsabilidades:

### a) Redirect HTTP → HTTPS

```
Usuario → http://ifts29.edu.ar   →   Nginx: redirect 301 a https://
Usuario → https://ifts29.edu.ar  →   Nginx sirve el sitio
```

### b) Sirve el build de React

React no es un servidor — genera archivos estáticos (HTML, JS, CSS).
Nginx es quien los entrega al navegador.

**¿Por qué cache de un año en los assets?**

Vite genera los archivos con un hash en el nombre:
`main-3f8a1c2d.js`, `styles-a1b2c3d4.css`. Ese hash cambia cada vez
que el código cambia. Como el nombre del archivo ya identifica
unívocamente su contenido, le decimos al navegador que lo guarde un año.
En la próxima visita, el navegador usa su copia local sin hacer ninguna
petición al servidor — la página carga casi instantáneamente. Si el código
cambia, Vite genera un nombre distinto y el navegador lo descarga de nuevo.

### c) Proxy /api → backend (sin exponer el backend a Internet)

El backend nunca tiene puerto público. Solo Nginx lo alcanza por la red
interna de Docker:

```
Navegador → https://ifts29.edu.ar/api/noticias
                ↓  (red interna Docker, nunca sale a Internet)
            Nginx → http://backend:3000/api/noticias
```

---

## 6. Cómo funciona Certbot / Let's Encrypt

> 🚧 **Estado: PENDIENTE / NO IMPLEMENTADO.** El servicio `certbot` y el
> `--profile ssl` que usa `make ssl` **no existen** en `docker-compose.yml`.
> Hoy producción usa **certificado auto-firmado** (`make ssl-selfsigned`,
> incluido en `make prod`).

**Idea (a futuro).** Let's Encrypt es una autoridad de certificación gratuita
y automática. Para emitir el certificado verifica que controlás el dominio con
el desafío ACME: Certbot deja un archivo en `/.well-known/acme-challenge/`,
Nginx lo sirve por HTTP sin redirigir, Let's Encrypt lo lee y emite el cert
(válido 90 días, renovable automáticamente con `certbot renew`).

**Para habilitarlo** habría que agregar el servicio `certbot` al compose,
publicar el puerto 80 y apuntar Nginx a `/etc/letsencrypt/`.

---

## 7. Git workflow del equipo

La idea es que `main` siempre tenga código que funciona, y que cada
cambio pase por revisión antes de integrarse.

### Estructura de ramas

```
main     → producción. Nadie pushea directo acá, nunca.
└── dev  → integración del equipo. Acá se juntan todos los cambios.
    ├── feature/nombre-de-la-feature   → funcionalidad nueva
    ├── fix/descripcion-del-bug        → corrección de bug
    └── chore/tarea-tecnica            → refactor, deps, config
```

### Ciclo de trabajo

```bash
# 1. Siempre partir desde develop actualizado
git checkout develop
git pull origin develop

# 2. Crear una rama para lo que vas a hacer
git checkout -b feature/pagina-noticias

# 3. Trabajar y commitear seguido
git add .
git commit -m "feat: agrega listado de noticias con filtros"

# 4. Antes de abrir el PR, traer los últimos cambios de develop
git pull origin develop --rebase

# 5. Pushear
git push origin feature/pagina-noticias

# 6. Abrir un Pull Request en GitHub: feature/pagina-noticias → dev
#    El CI corre los tests automáticamente.
#    Un integrante revisa y aprueba.
#    Recién ahí se mergea.
```

### Convención de commits

| Prefijo | Cuándo |
|---|---|
| `feat:` | Funcionalidad nueva |
| `fix:` | Corrección de bug |
| `chore:` | Dependencias, config, refactor sin cambio visible |
| `docs:` | Documentación |
| `test:` | Tests nuevos o modificados |
| `style:` | Formato/estilo sin cambio de lógica |

---

## 8. Qué hacer cuando algo se rompe después de un pull

### Caso 1: error "Cannot find module" — nueva dependencia

Alguien hizo `npm install algo` y pusheó el `package.json` actualizado,
pero los `node_modules` dentro del contenedor no tienen ese paquete.

```bash
docker compose -f docker-compose.dev.yml down            # (make dev-down)
docker compose -f docker-compose.dev.yml up --build      # (make dev)  reconstruye la imagen y ejecuta npm install
```

### Caso 2: error de columna o tabla que no existe — nueva migración

Alguien agregó una migración nueva.

```bash
docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate   # (make migrate-dev)
# Si sigue fallando, reconstruir todo (⚠ borra la BD):
docker compose -f docker-compose.dev.yml down -v         # (make dev-reset)
docker compose -f docker-compose.dev.yml up --build      # (make dev)
```

### Caso 3: conflicto de merge al hacer pull

```bash
git status                        # ver qué archivos tienen conflictos
# resolver cada conflicto en el editor, luego:
git add <archivo-resuelto>
git rebase --continue             # si usaste rebase
# o
git commit                        # si usaste merge
```

Si hay dudas sobre cómo resolver un conflicto, coordinarlo con quien
hizo los cambios antes de forzar una resolución.

### Caso 4: el contenedor no arranca

```bash
docker compose -f docker-compose.dev.yml logs -f         # (make logs-dev)  ver el error exacto
docker compose -f docker-compose.dev.yml down            # (make dev-down)
docker compose -f docker-compose.dev.yml up --build      # (make dev)
```

### Checklist general

```
1. git pull origin develop
2. docker compose -f docker-compose.dev.yml down && ... up --build   (make dev-down && make dev)
3. docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate
                                            (make migrate-dev — si hay migraciones nuevas)
4. docker compose -f docker-compose.dev.yml logs -f                  (make logs-dev — si sigue fallando)
```

---

## 9. Referencia de comandos

### En Windows (sin WSL)
Usá Docker Desktop (PowerShell o CMD):

```powershell
docker compose -f docker-compose.dev.yml up --build      # iniciar (reconstruye imágenes)
docker compose -f docker-compose.dev.yml up              # levantar (sin reconstruir)
docker compose -f docker-compose.dev.yml down            # detener
docker compose -f docker-compose.dev.yml exec backend sh # shell en backend
docker compose -f docker-compose.dev.yml logs -f         # logs en tiempo real
```

> **Hot-reload en Windows:** para que los cambios se detecten en tiempo real,
> agregá en `docker-compose.dev.yml`, dentro de `environment` de **frontend** y
> **backend**: `CHOKIDAR_USEPOLLING: "true"`.

### En Linux/macOS (o WSL con Makefile)

`make` es sólo un atajo de los comandos `docker compose` de arriba.

```bash
make help    # lista todos los comandos
```

| Comando make | Equivale a (docker)                                                        | Descripción |
|---|---|---|
| `make install`     | `npm install` en `frontend/` y `backend/`                            | Instala dependencias (sin Docker) |
| `make dev`         | `docker compose -f docker-compose.dev.yml up --build`                | Levanta desarrollo con hot-reload |
| `make dev-down`    | `docker compose -f docker-compose.dev.yml down`                      | Detiene el entorno de desarrollo |
| `make dev-reset`   | `docker compose -f docker-compose.dev.yml down -v`                   | Detiene y borra la BD de desarrollo |
| `make migrate-dev` | `... exec backend npx sequelize-cli db:migrate`                      | Ejecuta migraciones (dev) |
| `make seed-dev`    | `... exec backend npx sequelize-cli db:seed:all`                     | Carga los seeders (dev) |
| `make logs-dev`    | `docker compose -f docker-compose.dev.yml logs -f`                   | Logs en tiempo real (dev) |
| `make shell-be-dev`| `... exec backend sh`                                                | Shell dentro del backend (dev) |
| `make prod`        | `check-env` + cert auto-firmado + `docker compose up --build -d`     | Construye y levanta producción |
| `make prod-down`   | `docker compose down`                                                | Detiene producción |
| `make seed`        | `docker compose exec backend npx sequelize-cli db:seed:all`          | Carga los seeders (prod) |
| `make seed-user`   | `docker compose exec backend node scripts/create-user.js`            | Crea/actualiza un usuario (prod) |
| `make logs-be`     | `docker compose logs -f backend`                                     | Logs sólo del backend (prod) |
| `make ssl`         | (🚧 pendiente — Let's Encrypt no implementado, ver sección 6)        | — |

---

## 10. Variables de entorno

**Desarrollo:** `cp .env.example .env` y listo (usa SQLite, no hace falta editar nada).

**Producción:** el template es `.env.prod` (commiteado). `make setup-prod`
(`bash scripts/generate-secrets.sh`) lo copia a `.env` y completa `JWT_SECRET`
y `DB_PASSWORD` con secrets aleatorios. Después editás `DOMAIN` y `FRONTEND_URL`.

| Variable          | Descripción                                  | Default / Requerido        |
|-------------------|----------------------------------------------|----------------------------|
| `DOMAIN`          | Dominio del sitio (SSL y CORS)               | `localhost` (*)            |
| `JWT_SECRET`      | Secret para firmar tokens JWT                | **obligatorio** (autogen.) |
| `JWT_EXPIRES_IN`  | Expiración del token                         | `7d`                       |
| `DB_HOST`         | Host de PostgreSQL (prod)                    | `postgres`                 |
| `DB_PORT`         | Puerto de PostgreSQL (prod)                  | `5432`                     |
| `DB_NAME`         | Nombre de la BD (prod)                       | `ifts29`                   |
| `DB_USER`         | Usuario de PostgreSQL (prod)                 | `ifts29user`               |
| `DB_PASSWORD`     | Contraseña de PostgreSQL (prod)              | **obligatorio** (autogen.) |
| `FRONTEND_URL`    | Origen permitido por CORS (prod)             | `https://localhost`        |
| `MAX_FILE_SIZE`   | Tamaño máximo de upload (bytes)              | `20971520` (20 MB)         |
| `LOG_LEVEL`       | Nivel de logueo del backend                  | `info`                     |

> Los nombres `POSTGRES_DB / POSTGRES_USER / POSTGRES_PASSWORD` aparecen sólo
> dentro del contenedor de PostgreSQL; en `docker-compose.yml` se derivan de
> `DB_NAME / DB_USER / DB_PASSWORD`. En tu `.env` configurás siempre las `DB_*`.
