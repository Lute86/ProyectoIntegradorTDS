# 💻 INSTALACIÓN COMPLETA

**Guía paso a paso para instalar y configurar el proyecto**

---

## 🐳 INSTALACIÓN CON DOCKER (Recomendado)

### Paso 1: Requisitos Previos

```bash
docker --version          # 24.x o superior
docker compose --version  # 2.x o superior
git --version            # 2.x o superior
make --version           # Linux/macOS
```

### Paso 2: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PI/BASE
```

### Paso 3: Configurar Entorno

```bash
cp .env.example .env
# En desarrollo NO necesitas editar nada
```

### Paso 4: Iniciar Desarrollo

**Linux/macOS/WSL:**
```bash
make dev
```

**Windows (PowerShell):**
```bash
docker compose -f docker-compose.dev.yml up --build
```

Espera a que veas:
```
✓ Migraciones completadas
✓ Seeders cargados
✓ Frontend en http://localhost:5173
✓ Backend en http://localhost:3000
```

### Paso 5: Verificar

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000/api/health

---

## 🔧 INSTALACIÓN MANUAL (Sin Docker)

### Requisitos

```bash
node --version    # v22.x
npm --version     # 10.x
git --version     # 2.x
```

### Backend

```bash
cd App/backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### Frontend (otra terminal)

```bash
cd App/frontend
npm install
npm run dev
```

---

## ⚙️ Variables de Entorno

### Desarrollo (.env)

```bash
NODE_ENV=development
PORT=3000
DB_STORAGE=./data/dev.sqlite
JWT_SECRET=dev_secret
FRONTEND_URL=http://localhost:5173
```

### Producción

```bash
NODE_ENV=production
DB_HOST=postgres.server.com
DB_PORT=5432
DB_NAME=ifts29
JWT_SECRET=produccion_secret_32chars
FRONTEND_URL=https://ifts29.edu.ar
```

---

## 🆘 Problemas Comunes

### Puerto en uso

```bash
lsof -i :5173
lsof -i :3000
kill -9 <PID>
```

### BD corrupta

```bash
make dev-reset && make dev
```

### Dependencias rotas

```bash
rm -rf node_modules
npm install
```

---

## 📚 Ver También

- [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- [DOCKER.md](./DOCKER.md)
- [COMANDOS_MAKEFILE.md](./COMANDOS_MAKEFILE.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
