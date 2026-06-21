# 🆘 TROUBLESHOOTING - Solución de Problemas

**Problemas comunes y cómo resolverlos**

---

## 🚀 Problemas de Inicio

### "make: comando no encontrado"

**Problema:** En Windows sin WSL

**Solución:**
```bash
# Usa Docker Compose directamente
docker compose -f docker-compose.dev.yml up --build
```

---

### Puerto 5173 o 3000 ya en uso

**Problema:** Otro proceso ocupa el puerto

**Solución:**

```bash
# Buscar qué proceso ocupa el puerto
lsof -i :5173    # Frontend
lsof -i :3000    # Backend

# Matar el proceso (Linux/macOS)
kill -9 <PID>

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### "Cannot find module" después de git pull

**Problema:** Alguien agregó una dependencia npm

**Solución:**
```bash
docker compose -f docker-compose.dev.yml down         # (make dev-down)
docker compose -f docker-compose.dev.yml up --build   # (make dev)  reconstruye e instala
```

---

## 🗄️ Problemas de Base de Datos

### "database is locked"

**Problema:** Múltiples procesos accediendo a SQLite

**Solución:**
```bash
# Resetea la BD (⚠ borra los datos)
docker compose -f docker-compose.dev.yml down -v      # (make dev-reset)
docker compose -f docker-compose.dev.yml up --build   # (make dev)

# O detén y vuelve a iniciar (sin borrar datos)
docker compose -f docker-compose.dev.yml down         # (make dev-down)
docker compose -f docker-compose.dev.yml up --build   # (make dev)
```

---

### BD corrupta / datos extraños

**Problema:** Datos inconsistentes

**Solución:**
```bash
# Resetea completamente (⚠ borra los datos)
docker compose -f docker-compose.dev.yml down -v                                   # (make dev-reset)

# Espera a que se cree nueva BD
docker compose -f docker-compose.dev.yml up --build                                # (make dev)

# Ejecuta seeders
docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:seed:all # (make seed-dev)
```

---

### "relation does not exist" (PostgreSQL en prod)

**Problema:** Migración no se ejecutó

**Solución:**
```bash
# En producción
docker compose exec backend npx sequelize-cli db:migrate   # (make migrate)
```

---

## 🖥️ Problemas del Frontend

### Página en blanco / errores en consola

**Problema:** Error de React

**Solución:**
```bash
# 1. Abre consola (F12)
# 2. Mira el error exacto
# 3. Busca en [EJEMPLOS_API_REST.md](./EJEMPLOS_API_REST.md)

# 4. Si error de API:
docker compose -f docker-compose.dev.yml logs -f   # (make logs-dev)  ver logs del backend
```

---

### Cambios no se reflejan

**Problema:** Hot-reload no funciona

**Solución:**
```bash
# 1. Revisa que Docker esté corriendo
docker ps

# 2. Si no:
docker compose -f docker-compose.dev.yml down         # (make dev-down)
docker compose -f docker-compose.dev.yml up --build    # (make dev)

# 3. Si sigue sin funcionar:
# Elimina node_modules y cache
rm -rf frontend/node_modules
docker compose -f docker-compose.dev.yml down
docker system prune
docker compose -f docker-compose.dev.yml up --build    # (make dev)
```

---

### CORS error al llamar API

**Problema:** "Access-Control-Allow-Origin" error

**Solución:**

El proxy en Vite maneja esto, pero:

```bash
# 1. Verifica que API esté corriendo
curl http://localhost:3000/api/health

# 2. Si no:
docker compose -f docker-compose.dev.yml logs -f   # (make logs-dev)  ver logs del backend

# 3. En desarrollo, los CORS deben estar habilitados
# Verificar: backend/src/app.js (CORS config)
```

---

## 🔧 Problemas del Backend

### Error en logs: "EADDRINUSE"

**Problema:** Puerto 3000 ya en uso

**Solución:**
```bash
# Matar proceso
lsof -i :3000
kill -9 <PID>

# O reiniciar Docker
docker compose -f docker-compose.dev.yml down && docker compose -f docker-compose.dev.yml up --build   # (make dev-down && make dev)
```

---

### "Connection refused" a base de datos

**Problema:** BD no inicia

**Solución:**
```bash
# Espera más tiempo
sleep 10

# Ver logs
docker compose -f docker-compose.dev.yml logs -f   # (make logs-dev)

# Resetea (⚠ borra los datos)
docker compose -f docker-compose.dev.yml down -v && docker compose -f docker-compose.dev.yml up --build   # (make dev-reset && make dev)
```

---

### Tests fallando

**Problema:** Tests rojos

**Solución:**
```bash
# 1. Leer el error exacto
docker compose -f docker-compose.dev.yml exec backend npm test   # (make tests-back)

# 2. Si es de BD:
# Los tests usan SQLite en memoria, debe funcionar siempre

# 3. Si es de API:
# Verifica que la lógica sea correcta

# 4. Ejecutar test específico (filtra por palabra clave)
docker compose -f docker-compose.dev.yml exec backend npm run test:arg -- auth   # (make tests-back arg=auth)
```

---

## 🔐 Problemas de Autenticación

### "Token invalid" o "Unauthorized"

**Problema:** Token expirado o inválido

**Solución:**
```bash
# 1. Logueate de nuevo
# 2. El token se almacena en localStorage
# 3. Si persiste: limpiar navegador
#    - F12 → Application → Clear Storage

# 4. Verificar JWT_SECRET es el mismo
# En .env debe estar configurado
```

---

### No puedo hacer login

**Problema:** Credenciales no funcionan.

**Causa real:** el seeder de usuarios (`01-user-seeder.js`) crea `admin`,
`profesor` y `tutor` con **contraseñas aleatorias** (no existe un `admin1234`
por defecto). Para tener un login conocido hay que ejecutar el **script de
creación de usuario**, que sí define email/contraseña.

**Solución:**
```bash
# 1. Crear/actualizar el usuario admin con credenciales conocidas
docker compose -f docker-compose.dev.yml exec backend node scripts/create-user.js   # (make seed-user-dev)
# → admin@ifts29.edu.ar / admin1234 (rol admin)

# 2. Loguearte con:
#    Email:    admin@ifts29.edu.ar
#    Password: admin1234

# 3. ¿Querés otro email/contraseña? Pasalos como variables de entorno
docker compose -f docker-compose.dev.yml exec backend \
  env EMAIL=tu@mail.com PASSWORD=TuPassword ROL=admin node scripts/create-user.js
```

> El script usa `findOrCreate`: si el email ya existe, **actualiza** su
> contraseña y rol; si no, lo crea. Recordá que la contraseña debe tener
> **mínimo 8 caracteres** (única regla que valida el backend).

---

## 📊 Problemas de Performance

### API responde lento

**Problema:** Latencia alta

**Solución:**
```bash
# 1. Ver logs
docker compose -f docker-compose.dev.yml logs -f   # (make logs-dev)

# 2. Si hay muchos logs, probablemente hay query lenta
# Agregar índices en BD

# 3. Verificar:
curl -X GET http://localhost:3000/api/health
# Debe responder al instante

# 4. Si lento:
# - Base de datos corrupta: docker compose -f docker-compose.dev.yml down -v   (make dev-reset)
# - Muchos registros: agregar paginación
```

---

### Frontend lento

**Problema:** Página carga lentamente

**Solución:**
```bash
# 1. Abre DevTools (F12)
# 2. Network tab
# 3. Ver qué recurso es lento
# 4. Si API: ver logs backend
# 5. Si JS: refactor componentes
```

---

## 🐳 Problemas con Docker

### "Docker daemon is not running"

**Problema:** Docker Desktop no está abierto

**Solución:**
```bash
# Linux
sudo systemctl start docker

# macOS
# Abre Docker Desktop desde Applications

# Windows
# Abre Docker Desktop
```

---

### "No space left on device"

**Problema:** Disco lleno

**Solución:**
```bash
# Limpia Docker
docker system prune -a
docker volume prune

# Libera espacio del disco
# Elimina archivos innecesarios
```

---

### Contenedor no inicia

**Problema:** Error al compilar

**Solución:**
```bash
# 1. Ver logs
docker compose -f docker-compose.dev.yml up

# 2. Leer error exacto
# 3. Típicamente:
#    - npm install falló
#    - Sintaxis error en código
#    - Puerto en uso

# 4. Resetea
docker compose -f docker-compose.dev.yml down         # (make dev-down)
docker system prune
docker compose -f docker-compose.dev.yml up --build    # (make dev)
```

---

## 🔗 Git / Control de Versiones

### "fatal: not a git repository"

**Problema:** No estás en el repo

**Solución:**
```bash
cd /path/al/repo
git status
```

---

### Merge conflicts

**Problema:** Conflicto al hacer pull

**Solución:**
```bash
# 1. Ver estado
git status

# 2. Editar archivos con conflictos
# Buscar: <<<<<<<, =======, >>>>>>>

# 3. Resolver manualmente o:
git checkout --theirs <archivo>   # Usar versión remota
git checkout --ours <archivo>     # Usar versión local

# 4. Agregar y hacer commit
git add .
git commit -m "Merge resuelto"
```

---

## 📚 Más Recursos

- [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- [INSTALACION_COMPLETA.md](./INSTALACION_COMPLETA.md)
- [COMANDOS_MAKEFILE.md](./COMANDOS_MAKEFILE.md)
- [DOCKER.md](./DOCKER.md)

---

## 💬 Si Nada Funciona

1. **Resetea todo:**
   ```bash
   docker compose -f docker-compose.dev.yml down        # (make dev-down)
   docker system prune -a
   rm -rf backend/node_modules frontend/node_modules
   docker compose -f docker-compose.dev.yml up --build  # (make dev)
   ```

2. **Lee los logs:**
   ```bash
   docker compose -f docker-compose.dev.yml logs -f     # (make logs-dev)
   ```

3. **Verifica requisitos:**
   ```bash
   docker --version
   docker compose --version
   make --version
   ```

4. **Pide ayuda** con el mensaje exacto de error
