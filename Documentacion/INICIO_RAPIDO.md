# 🚀 INICIO RÁPIDO - 5 MINUTOS

**Para empezar a desarrollar en este proyecto en 5 minutos**

---

## ✅ Requisitos Previos

```bash
docker --version      # Debe ser 24.x o superior
docker compose --version  # Debe ser 2.x o superior
git --version         # Debe ser 2.x o superior
make --version        # Linux/macOS (opcional en Windows)
```

---

## 🎯 5 Pasos para Empezar

### Paso 1: Clonar (1 min)
```bash
git clone <URL>
cd PI/BASE/App
```

### Paso 2: Configurar (30 seg)
```bash
cp .env.example .env
# No necesitas editar nada para desarrollo local
```

### Paso 3: Iniciar Docker (2 min)
**Linux/macOS/WSL:**
```bash
make dev
```

**Windows (PowerShell):**
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Paso 4: Verificar (30 seg)
Abre en navegador:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000/api

### Paso 5: Ingresar al panel

El seed de usuarios (`01-user-seeder.js`) ya crea el **admin con una contraseña
fija y conocida** (`admin1234`), así que podés ingresar directo sin pasos extra.
Hacé clic en **"Admin"** y usá:
```
Email:    admin@ifts29.edu.ar
Password: admin1234
```

> Nota: los usuarios `profesor` y `tutor` se siembran con contraseñas aleatorias.
> Si necesitás credenciales conocidas para ellos (u otro email/contraseña),
> usá el script de creación de usuario:
> ```bash
> docker compose -f docker-compose.dev.yml exec backend \
>   env EMAIL=tu@mail.com PASSWORD=TuPassword ROL=admin node scripts/create-user.js
> ```

✅ **¡LISTO!** Estás dentro del panel de administración.

---

## 📋 Comandos Principales

```bash
make dev              # Iniciar desarrollo
make dev-down         # Detener
make logs-dev         # Ver logs
make tests-back       # Tests backend
make tests-frontend   # Tests frontend
```

Ver más en: [COMANDOS_MAKEFILE.md](./COMANDOS_MAKEFILE.md)

---

## 📍 URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Sitio público | http://localhost:5173 |
| Panel admin | http://localhost:5173/admin |
| API REST | http://localhost:3000/api |
| Health check | http://localhost:3000/api/health |

---

## 🆘 Si Algo No Funciona

Consulta: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Próximos Pasos

1. Lee: [ARQUITECTURA.md](./ARQUITECTURA.md) (entender cómo funciona)
2. Lee: [BASE_DE_DATOS.md](./BASE_DE_DATOS.md) (entender la BD)
3. Lee: [GUIA_DESARROLLO.md](./GUIA_DESARROLLO.md) (agregar funcionalidades)
