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

Cuando ejecutás `make dev`, Docker monta las carpetas de código como
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

### Flujo diario normal

No es necesario acceder a los contenedores ni ejecutar comandos extra.

### Cuándo SÍ necesitás un paso extra

Hay tres situaciones donde Docker requiere intervención:

#### a) Alguien agregó una dependencia npm

```bash
# Después de git pull, reconstruir las imágenes (ejecuta npm install adentro)
make dev-down
make dev
```

Los `node_modules` no están montados como volumen (son pesados y específicos
de cada plataforma). Reconstruir la imagen instala las nuevas dependencias
dentro del contenedor.

#### b) Hay una migración nueva de base de datos

```bash
make migrate-dev
```

Las migraciones no se ejecutan solas al guardar el archivo. Hay que
correrlas explícitamente, o bien hacer `make dev-down && make dev` (el
contenedor corre `db:migrate` automáticamente al arrancar).

#### c) Debuggear o explorar el servidor

```bash
make logs-dev       # ver logs en tiempo real
make shell-be-dev   # abrir una shell dentro del contenedor del backend
```

### Resumen

| Situación | Qué hacer |
|---|---|
| Cambié código fuente | Nada — hot-reload automático |
| Alguien agregó una dependencia | `make dev-down && make dev` |
| Hay una migración nueva | `make migrate-dev` |
| Quiero ver los logs | `make logs-dev` |

---

## 3. Inicio rápido

```bash
# 1. Clonar el repositorio
git clone <url-del-repo> && cd PI

# 2. Crear el archivo de entorno (en dev no hace falta editar nada)
cp .env.example .env

# 3. Levantar desarrollo
make dev
```

Al primer arranque el backend ejecuta automáticamente:
- `sequelize db:migrate`  — crea las 9 tablas en SQLite
- `sequelize db:seed:all` — carga datos de prueba

**URLs disponibles:**
- Frontend: http://localhost:5173
- Backend:  http://localhost:3000/api

### Credenciales del admin (seed de dev)

| Campo    | Valor               |
|----------|---------------------|
| Email    | admin@ifts29.edu.ar |
| Password | admin1234           |


---

## 4. Producción y HTTPS

```bash
cp .env.example .env
# Editar: DOMAIN, POSTGRES_PASSWORD, JWT_SECRET

make check-env   # verifica que el .env esté completo
make ssl         # obtiene el certificado (solo la primera vez)
make prod        # levanta todo en background
```

El sitio queda disponible en `https://<DOMAIN>`.

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

### El problema que resuelve

HTTPS requiere un certificado SSL: un archivo que le demuestra al
navegador que el servidor es legítimo. Esos certificados los emiten
entidades llamadas **autoridades de certificación**. Históricamente
costaban dinero y se renovaban manualmente. **Let's Encrypt** es una
autoridad gratuita y automática.

### El desafío ACME — cómo se verifica que el dominio es tuyo

Para emitir un certificado para `ifts29.edu.ar`, Let's Encrypt necesita
verificar que vos controlás ese dominio. Lo hace así:

```
1. Certbot le pide a Let's Encrypt un certificado para ifts29.edu.ar

2. Let's Encrypt responde: "poné este archivo en
   http://ifts29.edu.ar/.well-known/acme-challenge/<TOKEN>"

3. Certbot crea ese archivo en /var/www/certbot/

4. Nginx sirve esa carpeta en /.well-known/acme-challenge/ sin redirigir a HTTPS
   (por eso el bloque HTTP tiene esa excepción — si redirigiera todo a HTTPS
   antes de tener el certificado, el desafío fallaría)

5. Let's Encrypt visita la URL, verifica el archivo y emite el certificado

6. Certbot guarda el certificado en /etc/letsencrypt/

7. Nginx lee ese certificado para servir HTTPS
```

### Renovación automática

Los certificados de Let's Encrypt duran 90 días. El servicio `certbot`
del `docker-compose.yml` corre en background y ejecuta `certbot renew`
cada 12 horas. Si el certificado está a menos de 30 días de vencer,
lo renueva solo. No hay que hacer nada.

```
Primera vez:    make ssl   →  obtiene el certificado
Cada 90 días:   certbot (servicio Docker) lo renueva automáticamente
```

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
# 1. Siempre partir desde dev actualizado
git checkout dev
git pull origin dev

# 2. Crear una rama para lo que vas a hacer
git checkout -b feature/pagina-noticias

# 3. Trabajar y commitear seguido
git add .
git commit -m "feat: agrega listado de noticias con filtros"

# 4. Antes de abrir el PR, traer los últimos cambios de dev
git pull origin dev --rebase

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
make dev-down
make dev          # reconstruye la imagen y ejecuta npm install
```

### Caso 2: error de columna o tabla que no existe — nueva migración

Alguien agregó una migración nueva.

```bash
make migrate-dev
# Si sigue fallando, reconstruir todo:
make dev-reset && make dev
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
make logs-dev     # ver el error exacto
make dev-down
make dev
```

### Checklist general

```
1. git pull origin dev
2. make dev-down && make dev
3. make migrate-dev              (si hay migraciones nuevas)
4. make logs-dev                 (si sigue fallando)
```

---

## 9. Referencia de comandos

```bash
make help    # lista todos los comandos
```

| Comando | Descripción |
|---|---|
| `make scaffold` | Genera toda la estructura de carpetas y archivos vacíos. Ya realizado - No disponible |
| `make install` | Instala dependencias de frontend y backend |
| `make dev` | Levanta entorno de desarrollo con hot-reload |
| `make dev-down` | Detiene el entorno de desarrollo |
| `make dev-reset` | Detiene y borra la BD de desarrollo |
| `make prod` | Construye y levanta producción en background |
| `make prod-down` | Detiene producción |
| `make ssl` | Obtiene certificado SSL con Let's Encrypt |
| `make logs-dev` | Logs en tiempo real (desarrollo) |
| `make logs-be` | Logs solo del backend (producción) |
| `make shell-be-dev` | Shell dentro del contenedor backend (dev) |
| `make migrate-dev` | Ejecuta migraciones en desarrollo |
| `make seed-dev` | Carga los seeders en desarrollo |

---

## 10. Variables de entorno

| Variable            | Descripción                         | Default / Requerido |
|---------------------|-------------------------------------|---------------------|
| `DOMAIN`            | Dominio del sitio (para SSL)        | `ifts29.edu.ar` (*) |
| `JWT_SECRET`        | Secret para firmar tokens JWT       | **obligatorio**     |
| `JWT_EXPIRES_IN`    | Expiración del token                | `7d`                |
| `POSTGRES_DB`       | Nombre de la BD (prod)              | `ifts29`            |
| `POSTGRES_USER`     | Usuario de PostgreSQL (prod)        | `ifts29user`        |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL (prod)     | **obligatorio**     |
| `MAX_FILE_SIZE`     | Tamaño máximo de upload (bytes)     | `20971520` (20 MB)  |
