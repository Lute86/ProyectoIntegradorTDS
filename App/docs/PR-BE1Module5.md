# Modulo 5 - Eventos y Testimonios

## Resumen de cambios

Se implementan los módulos de gestión de eventos y testimonios para el backend de la aplicación.

**Cambios principales:**
- Modelo `Evento` con campos: id, nombre, descripcion, fecha, ubicacion, estado (pendiente/confirmado/finalizado/cancelado), soft delete
- Modelo `Testimonio` con campos: id, autor_nombre, autor_carrera, texto, visible (booleano), soft delete
- Endpoints CRUD para Eventos: `/api/eventos` (GET, POST, PUT, DELETE) con filtros por fecha y estado
- Endpoints CRUD para Testimonios: `/api/testimonios` (GET, POST, PUT, DELETE) con filtro por visibilidad
- Migraciones de creación de tablas eventos y testimonios
- Seeders con datos de ejemplo para eventos y testimonios
- Tests de integración para cada módulo

## Actualizar localmente

1. **Git pull**
2. **Actualizar dependencias y reiniciar contenedores**
3. **Ejecutar migraciones**
4. **Cargar seeders**

## Endpoints disponibles

### Eventos

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/eventos` | Listar eventos (con filtros) | No | Público |
| GET | `/api/eventos/:id` | Obtener evento por ID | No | Público |
| POST | `/api/eventos` | Crear nuevo evento | Sí | admin, profesor |
| PUT | `/api/eventos/:id` | Actualizar evento | Sí | admin, profesor |
| DELETE | `/api/eventos/:id` | Eliminar evento | Sí | admin |

### Testimonios

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/testimonios` | Listar testimonios (con filtros) | No | Público |
| GET | `/api/testimonios/:id` | Obtener testimonio por ID | No | Público |
| POST | `/api/testimonios` | Crear nuevo testimonio | Sí | admin, profesor |
| PUT | `/api/testimonios/:id` | Actualizar testimonio | Sí | admin, profesor |
| DELETE | `/api/testimonios/:id` | Eliminar testimonio | Sí | admin |

## Filtros disponibles

### Eventos

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `estado` | string | Filtrar por estado (`pendiente`, `confirmado`, `finalizado`, `cancelado`) |
| `fecha_desde` | string (ISO date) | Filtrar eventos desde una fecha |
| `fecha_hasta` | string (ISO date) | Filtrar eventos hasta una fecha |

### Testimonios

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `visible` | boolean | Filtrar por visibilidad (`true`/`false`) |

## Validaciones

### Creación de evento (`createEventoValidation`)
- `nombre`: Requerido, mínimo 2 caracteres
- `fecha`: Requerido, formato ISO8601 (YYYY-MM-DD)
- `descripcion`: Opcional
- `ubicacion`: Opcional
- `estado`: Opcional (`pendiente`, `confirmado`, `finalizado`, `cancelado`)

### Creación de testimonio (`createTestimonioValidation`)
- `autor_nombre`: Requerido, mínimo 2 caracteres
- `texto`: Requerido, mínimo 10 caracteres
- `autor_carrera`: Opcional
- `visible`: Opcional, booleano

## Características implementadas

1. **Filtros por rango de fechas**: Eventos aceptan `fecha_desde` y `fecha_hasta` para filtrar por período
2. **Estados de evento**: Máquina de estados (pendiente → confirmado → finalizado / cancelado)
3. **Control de visibilidad**: Testimonios pueden ocultarse sin eliminar (`visible: false`)

## Seeders

### Eventos (evento-seeder.js)
5 eventos de ejemplo con fechas entre Julio y Noviembre 2026:

| Nombre | Fecha | Estado |
|--------|-------|--------|
| Charla: Inteligencia Artificial en la Educacion | 2026-07-15 | confirmado |
| Taller de Programacion Web Avanzada | 2026-08-10 | confirmado |
| Jornada de Puertas Abiertas | 2026-09-05 | pendiente |
| Seminario: Etica y Tecnologia | 2026-10-20 | pendiente |
| Hackathon IFTS 29 | 2026-11-12 | pendiente |

### Testimonios (testimonio-seeder.js)
4 testimonios de ejemplo (3 visibles, 1 oculto):

| Autor | Carrera | Visible |
|-------|---------|---------|
| Maria Gonzalez | Desarrollo de Software | true |
| Carlos Perez | Administracion de Empresas | true |
| Lucia Martinez | Diseño Grafico | true |
| Juan Romero | Desarrollo de Software | false |

## Para el equipo

### Frontend
- **Eventos**: Usar `GET /api/eventos` con filtros `?estado=confirmado&fecha_desde=2026-07-01` para calendario
- **Testimonios**: Usar `GET /api/testimonios?visible=true` para mostrar solo testimonios visibles al público
- **Estructura de respuesta**: `{ success: boolean, message: string, data: any }`

### Backend
Se detalla el uso de los componentes creados siguiendo el patrón de módulos anteriores:

#### 1. Modelos
- **Evento** (`src/models/evento.model.js`): nombre, descripcion, fecha (DATEONLY), ubicacion, estado con validate isIn
- **Testimonio** (`src/models/testimonio.model.js`): autor_nombre, autor_carrera, texto, visible (booleano)
- Soft delete en Evento y Testimonio (`paranoid: true`)

#### 2. Migraciones
- `05-create-eventos-table.js`: Tabla eventos con índices en fecha y estado
- `08-create-testimonios-table.js`: Tabla testimonios con índice en visible

#### 3. Seeders
- `evento-seeder.js`: Eventos de ejemplo
- `testimonio-seeder.js`: Testimonios de ejemplo

#### 4. Servicios
- **Evento** (`src/services/evento.services.js`): `getAll` (con filtros por estado y rango de fechas), `getById`, `create`, `update` (con validación de nombre único), `remove`
- **Testimonio** (`src/services/testimonio.services.js`): `getAll` (con filtro visible), `getById`, `create`, `update`, `remove`

#### 5. Controladores
- Envueltos en `asyncHandler`
- Validación con `express-validator`
- Uso de `response.js`: `success`, `created`, `deleted`

#### 6. Rutas
- Prefijos: `/api/eventos`, `/api/testimonios`
- GET público, POST/PUT con autenticación (admin/profesor), DELETE solo admin

## Tests

Los tests cubren:

**Eventos (19 tests):**
- Creación con admin y profesor (éxito y validaciones)
- Acceso sin token y con roles no autorizados (tutor)
- Listar con filtros (estado, fecha_desde)
- Obtener por ID
- Actualizar (admin, profesor)
- Eliminar (admin, roles no autorizados)

**Testimonios (18 tests):**
- Creación con admin y profesor (éxito y validaciones)
- Acceso sin token y con roles no autorizados (tutor)
- Listar con filtro visible
- Obtener por ID
- Actualizar (admin, profesor)
- Eliminar (admin, roles no autorizados)

**Total:** 37 tests

Ejecutar: `make tests-back` (desde `BASE/App/`)

## Archivos modificados/creados

### Nuevos archivos:
- `backend/src/models/evento.model.js`
- `backend/src/models/testimonio.model.js`
- `backend/src/services/evento.services.js`
- `backend/src/services/testimonio.services.js`
- `backend/src/controllers/evento.controller.js`
- `backend/src/controllers/testimonio.controller.js`
- `backend/src/middlewares/validators/evento.validator.js`
- `backend/src/middlewares/validators/testimonio.validator.js`
- `backend/src/routes/evento.routes.js`
- `backend/src/routes/testimonio.routes.js`
- `backend/src/migrations/05-create-eventos-table.js`
- `backend/src/migrations/08-create-testimonios-table.js`
- `backend/src/seeders/evento-seeder.js`
- `backend/src/seeders/testimonio-seeder.js`
- `backend/tests/integration/evento.test.js`
- `backend/tests/integration/testimonio.test.js`

### Archivos modificados:
- `backend/src/models/index.js` (registrados modelos Evento, Testimonio)
- `backend/src/routes/index.js` (registradas rutas de /eventos, /testimonios)
