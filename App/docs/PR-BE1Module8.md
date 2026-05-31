# Modulo 8 - Consultas / Contactos

## Resumen de cambios

Se implementa el sistema de consultas/contactos para que los visitantes del sitio puedan enviar mensajes al instituto y el equipo de admin pueda gestionarlos.

**Cambios principales:**
- Modelo `Consulta` con campos: id, nombre, email, asunto, mensaje, respondido, respuesta, createdAt, updatedAt
- Endpoint público `POST /api/consultas` con rate limit de 5/min por IP para evitar spam
- Endpoints autenticados para listado con paginación y filtros, detalle, respuesta y eliminación
- Endpoint `GET /api/consultas/unread/count` para el badge de notificaciones del admin
- Rate limit desactivado automáticamente en entorno de test
- Tests de integración completos (32 tests)

## Actualizar localmente

1. **Git pull**
2. **Actualizar dependencias y reiniciar contenedores**
3. **Ejecutar migraciones**
   ```bash
   make migrate-dev
   ```

## Endpoints disponibles

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| POST | `/api/consultas` | Enviar consulta (rate limit: 5/min por IP) | No | Público |
| GET | `/api/consultas` | Listar consultas (paginación, filtros) | Sí | admin, profesor, tutor |
| GET | `/api/consultas/unread/count` | Conteo de consultas sin leer | Sí | admin, profesor, tutor |
| GET | `/api/consultas/:id` | Obtener detalle de una consulta | Sí | admin, profesor, tutor |
| PUT | `/api/consultas/:id` | Responder / marcar como leída | Sí | admin, profesor, tutor |
| DELETE | `/api/consultas/:id` | Eliminar consulta | Sí | admin |

## Filtros disponibles (GET /api/consultas)

- `?respondido=true` - Filtrar por estado de respuesta
- `?search=nombre` - Buscar en nombre, email y asunto
- `?page=1&limit=10` - Paginación

## Validaciones

### Crear consulta (`createConsultaValidation`)
- `nombre`: Requerido, mínimo 2 caracteres
- `email`: Requerido, formato email válido
- `asunto`: Requerido, mínimo 3 caracteres
- `mensaje`: Requerido, mínimo 10 caracteres

### Actualizar consulta (`updateConsultaValidation`)
- `respuesta`: Opcional, mínimo 10 caracteres
- `respondido`: Opcional, booleano

## Características implementadas

1. **Rate limit público**: `POST /api/consultas` tiene un límite de 5 solicitudes por minuto por IP usando `express-rate-limit`. En entorno de test se desactiva automáticamente.
2. **Paginación**: El listado retorna `{ data, total, page, limit, totalPages }`.
3. **Búsqueda**: Filtro `search` busca parcialmente en nombre, email y asunto usando `Op.like`.
4. **Conteo de no leídas**: Endpoint `GET /unread/count` retorna `{ count }` para el badge del AdminTopbar.
5. **Sin soft delete**: Las consultas se eliminan físicamente (no se usa `paranoid: true`).

## Para el equipo

### Frontend (Módulo FE 6)

- **Crear consulta (ContactoPage)**: `POST /api/consultas` sin token. Enviar `{ nombre, email, asunto, mensaje }`.
- **Listar consultas (ConsultasPage)**: `GET /api/consultas` con token. Soporta filtros y paginación.
- **Detalle de consulta**: `GET /api/consultas/:id` con token.
- **Responder**: `PUT /api/consultas/:id` con `{ respuesta, respondido: true }`.
- **Eliminar**: `DELETE /api/consultas/:id` con token de admin.
- **Badge de notificaciones**: `GET /api/consultas/unread/count` con token. Retorna `{ count }`.

#### Store sugerido (`consultasStore.js`)
```javascript
// Listar consultas con filtros
const fetchConsultas = async (filters) => {
  const { data } = await api.get('/consultas', { params: filters });
  return data.data; // { data: [...], total, page, totalPages }
};

// Obtener conteo de no leídas
const fetchUnreadCount = async () => {
  const { data } = await api.get('/consultas/unread/count');
  return data.data.count;
};

// Responder una consulta
const responderConsulta = async (id, respuesta) => {
  const { data } = await api.put(`/consultas/${id}`, {
    respuesta,
    respondido: true,
  });
  return data.data;
};
```

### Backend

#### Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/models/consulta.model.js` | Modelo Sequelize (sin paranoid, con timestamps) |
| `src/migrations/create-consultas-table.js` | Migración de la tabla consultas |
| `src/services/consulta.services.js` | Lógica de negocio con `handleDbErrors` |
| `src/controllers/consulta.controller.js` | Manejo HTTP con `asyncHandler` |
| `src/middlewares/validators/consulta.validator.js` | Validaciones con `express-validator` |
| `src/routes/consulta.routes.js` | Rutas con rate limit diferenciado |
| `tests/integration/consulta.test.js` | 32 tests de integración |

#### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/models/index.js` | Registro del modelo Consulta |
| `src/routes/index.js` | Registro de rutas `/api/consultas` |
| `Makefile` | `tests-back` acepta `arg=` para test específico |
| `backend/package.json` | Script `test:arg` para tests individuales |

#### Detalle de implementación

**Modelo** (`consulta.model.js`):
- Sin `paranoid: true` (eliminación física)
- `timestamps: true` genera `createdAt`/`updatedAt` automáticamente
- Índices en `email`, `respondido` y `createdAt`

**Rate limit** (`consulta.routes.js`):
```javascript
const consultaRateLimit = process.env.NODE_ENV === 'test'
  ? (_req, _res, next) => next()
  : rateLimit({ windowMs: 60000, max: 5, ... });
```

**Servicio** (`consulta.services.js`):
- `getAll`: Paginación con `findAndCountAll`, filtros por `respondido` y búsqueda con `Op.like`
- `getById`: Búsqueda por PK
- `create`: Inserción directa
- `update`: Para responder/marcar como leída
- `remove`: Eliminación física
- `getUnreadCount`: Conteo de consultas con `respondido: false`

**Tests** (`consulta.test.js`):
- POST: crear, validaciones, rate limit, acceso público
- GET: listado, filtros, paginación, búsqueda
- GET /unread/count: conteo, decremento al responder
- GET /:id: detalle, ID inválido, no existe
- PUT: responder, marcar leída, validaciones
- DELETE: eliminar, solo admin

## Tests

Ejecutar todos los tests: `make tests-back`

Ejecutar solo este módulo: `make tests-back arg=consulta`

Los tests cubren:
- CRUD completo de consultas
- Validaciones de entrada
- Control de acceso por roles
- Rate limit (verificación de desactivación en test)
- Paginación y filtros
- Endpoint de conteo de no leídas

## Archivos modificados/creados

### Nuevos archivos:
- `backend/src/models/consulta.model.js`
- `backend/src/migrations/create-consultas-table.js`
- `backend/src/services/consulta.services.js`
- `backend/src/controllers/consulta.controller.js`
- `backend/src/middlewares/validators/consulta.validator.js`
- `backend/src/routes/consulta.routes.js`
- `backend/tests/integration/consulta.test.js`

### Archivos modificados:
- `backend/src/models/index.js` (registro del modelo Consulta)
- `backend/src/routes/index.js` (registro de rutas de consultas)
- `Makefile` (tests-back con soporte de arg)
- `backend/package.json` (script test:arg)
