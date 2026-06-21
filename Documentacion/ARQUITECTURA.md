# 🏗️ ARQUITECTURA DEL SISTEMA

**Descripción de cómo está construido el sistema**

---

## 📊 Modelo de Arquitectura

### Por Capas (3-Layer Architecture)

```
┌─────────────────────────────┐
│   PRESENTACIÓN (Frontend)   │
│  React + Vite + TailwindCSS │
│     (http://localhost:5173) │
└────────────┬────────────────┘
             │ HTTP REST / JSON
┌────────────▼────────────────┐
│  LÓGICA DE NEGOCIO (Backend)│
│  Express.js + Sequelize ORM │
│     (http://localhost:3000) │
└────────────┬────────────────┘
             │ SQL Query
┌────────────▼────────────────┐
│    PERSISTENCIA (Database)  │
│   SQLite (dev) / PostgreSQL │
│           (prod)            │
└─────────────────────────────┘
```

---

## 🎯 Capa de Presentación (Frontend)

### Stack

- **React 19** - Framework UI
- **Vite 6** - Build tool y dev server
- **TailwindCSS 4** - Estilos
- **Zustand** - State management global
- **React Router 7** - Navegación
- **Axios** - HTTP client

### Estructura

```
frontend/
├── public/              (assets estáticos)
├── src/
│   ├── pages/          (rutas principales)
│   │   ├── public/     (vistas públicas)
│   │   └── admin/      (vistas admin)
│   ├── components/     (componentes reutilizables)
│   │   ├── ui/         (botones, modales, etc)
│   │   ├── public/     (específicos públicos)
│   │   └── admin/      (específicos admin)
│   ├── stores/         (Zustand state)
│   ├── services/       (API calls)
│   ├── contexts/       (React Context)
│   ├── hooks/          (custom hooks)
│   └── styles/         (estilos globales)
├── vite.config.js      (configuración build)
└── package.json
```

### Flujo de Datos

```
Usuario interactúa
     ↓
React Component render
     ↓
Llama Service (API call)
     ↓
Axios GET/POST/PUT/DELETE
     ↓
Backend API
     ↓
Zustand Store actualiza estado
     ↓
Component re-render con datos nuevos
```

---

## 🔌 Capa de Lógica de Negocio (Backend)

### Stack

- **Node.js 22** - Runtime
- **Express 5** - Framework web
- **Sequelize** - ORM
- **JWT** - Autenticación
- **Multer** - Subida de archivos
- **Winston** - Logging

### Estructura

```
backend/
├── src/
│   ├── app.js              (configuración Express)
│   ├── server.js           (entry point)
│   ├── config/
│   │   └── database.js     (config BD)
│   ├── controllers/        (lógica de endpoints)
│   ├── services/           (lógica de negocio)
│   ├── models/             (Sequelize models)
│   ├── migrations/         (schema changes)
│   ├── seeders/            (datos iniciales)
│   ├── middlewares/        (auth, validación, errores)
│   └── utils/              (helpers, logging)
└── package.json
```

### Flujo de Petición

```
1. Cliente: POST /api/noticias
                   ↓
2. Express Route: detecta endpoint
                   ↓
3. Middlewares: 
   - Autenticación (JWT)
   - Validación (express-validator)
   - Error handling
                   ↓
4. Controller: extrae datos de request
                   ↓
5. Service: aplica lógica de negocio
                   ↓
6. Model: ejecuta query SQL
                   ↓
7. Database: retorna resultado
                   ↓
8. Controller: formatea respuesta
                   ↓
9. Cliente: recibe JSON
```

---

## 🗄️ Capa de Persistencia (Database)

### Arquitectura

```
Aplicación (Sequelize)
         ↓
    SQLite (Dev)
    o
    PostgreSQL (Prod)
         ↓
    Tablas y relaciones
    (14 tablas principales)
```

### Características

- **14 tablas** con relaciones N:M
- **Soft deletes** (paranoid mode)
- **Timestamps** automáticos
- **Índices** en campos de búsqueda
- **Migraciones versionadas**
- **Seeders** para datos iniciales

### Por Entorno

**Desarrollo (SQLite):**
```
./data/dev.sqlite        (1 archivo)
Rápido de configurar
Sin servidor
Perfecto para testing
```

**Producción (PostgreSQL):**
```
Host: postgres.prod.com
DB: ifts29_prod
User: ifts29user
Escalable
Multi-usuario
Respaldos automáticos
```

---

## 🔐 Componentes de Seguridad

### Autenticación

```
1. Usuario ingresa credenciales
                ↓
2. Backend verifica en BD
                ↓
3. Genera JWT (JSON Web Token)
                ↓
4. Cliente almacena en localStorage
                ↓
5. En cada petición, envía token
                ↓
6. Backend valida token
```

### Autorización (RBAC)

```
Admin       Profesor      Tutor
├─ Todo    ├─ Noticias  ├─ Lectura
├─ Usuarios  ├─ Horarios │
└─ Config  └─ Comisiones
```

### Validación

```
Nivel 1: Frontend
  - React Hook Form
  - Zod schemas
  - Validación en tiempo real

Nivel 2: Backend
  - express-validator
  - Zod server-side
  - Validación SQL (constraints)
```

---

## 📡 Comunicación Cliente-Servidor

### API REST

**Endpoints:** 13+ rutas principales
**Formato:** JSON
**Autenticación:** JWT Bearer token
**Validación:** Content-Type: application/json

### Estructura de Petición

```bash
POST /api/noticias HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "titulo": "Mi noticia",
  "contenido": "...",
  "categoria_id": 1
}
```

### Estructura de Respuesta

```json
{
  "success": true,
  "status": 201,
  "message": "Noticia creada",
  "data": {
    "noticia": {
      "id": 1,
      "titulo": "Mi noticia",
      ...
    }
  }
}
```

---

## 🔄 Flujo Completo de Usuario

```
1. Usuario abre http://localhost:5173
                ↓
2. Vite sirve React SPA
                ↓
3. Usuario navega (sin reload)
                ↓
4. Hace clic en "Admin"
                ↓
5. Ingresa email y contraseña
                ↓
6. Frontend: POST /api/auth/login
                ↓
7. Backend: valida credenciales
                ↓
8. Genera JWT y retorna
                ↓
9. Frontend: almacena en localStorage
                ↓
10. Redirige a dashboard
                ↓
11. Ver noticias: GET /api/noticias
                ↓
12. Crear noticia: POST /api/noticias
                ↓
13. Actualizar: PUT /api/noticias/:id
                ↓
14. Eliminar: DELETE /api/noticias/:id
```

---

## 🏢 Componentes Transversales

### Autenticación

- **Frontend:** AuthContext + authStore
- **Backend:** middleware authenticate
- **Storage:** localStorage (frontend) + BD (backend)

### Manejo de Errores

- **Frontend:** ToastContext para notificaciones
- **Backend:** AppError class + middleware global
- **HTTP:** Códigos estándar (400, 401, 403, 404, 500)

### Logging

- **Frontend:** console logs (dev)
- **Backend:** Winston (archivos rotativos)
- **Nivel:** info, warn, error, debug

### Validación

- **Frontend:** React Hook Form + Zod
- **Backend:** express-validator + Zod
- **DB:** Constraints SQL

---

## 📈 Escalabilidad

### Base de Datos

```
SQLite (Dev)  →  PostgreSQL (Prod)
1 archivo     →  Servidor dedicado
Para testing  →  Replicas y backups
```

### Frontend

```
SPA (React)   →  Nginx (Prod)
Hot-reload    →  Comprimido (dist/)
Dev mode      →  Cache headers
```

### Backend

```
Single Node   →  Múltiples instancias
Express       →  Load balancer
SQLite        →  PostgreSQL cluster
```

---

## 📚 Ver También

- [BASE_DE_DATOS.md](./BASE_DE_DATOS.md)
- [EJEMPLOS_API_REST.md](./EJEMPLOS_API_REST.md)
- [INSTALACION_COMPLETA.md](./INSTALACION_COMPLETA.md)
