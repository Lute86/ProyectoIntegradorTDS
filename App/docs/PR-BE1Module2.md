# Modulo 2 - Carreras y Materias

## Resumen de cambios

Se implementa el sistema de gestión de carreras y materias para el backend de la aplicación.

**Cambios principales:**
- Modelo `Carrera` con campos: id, nombre, slug, descripcion, duracion, modalidad, icono, color, activa (paranoid: true)
- Modelo `Materia` con campos: id, nombre, carrera_id, cuatrimestre, carga_horaria_semanal, descripcion (paranoid: true)
- Relación: Una Carrera tiene muchas Materias (hasMany), una Materia pertenece a una Carrera (belongsTo)
- Endpoints CRUD para Carreras: `/api/carreras` (GET, POST, PUT, DELETE) con filtros por modalidad/estado
- Endpoints CRUD para Materias: `/api/materias` (GET, POST, PUT, DELETE) con filtros por carrera/cuatrimestre
- Migraciones de creación de tablas carreras y materias
- Seeder con carrera de ejemplo: "Desarrollo de Software (a distancia)"
- Tests de integración para ambos módulos (37 tests en total)

## Actualizar localmente

1. **Git pull**
2. **Actualizar dependencias y reiniciar contenedores**
3. **Ejecutar migraciones**
4. **Cargar seeders**

## Endpoints disponibles

### Carreras

| Método | Endpoint | Descripción | Auth requerida |
|--------|----------|-------------|----------------|
| GET | `/api/carreras` | Listar carreras (filtros: `?modalidad=virtual&activa=true`) | No |
| POST | `/api/carreras` | Crear nueva carrera | No* |
| GET | `/api/carreras/:id` | Obtener carrera por ID (incluye materias) | No |
| PUT | `/api/carreras/:id` | Actualizar carrera | No* |
| DELETE | `/api/carreras/:id` | Eliminar carrera (requiere sin materias asociadas) | No* |

*En producción deberían estar protegidas con autenticación y roles.

### Materias

| Método | Endpoint | Descripción | Auth requerida |
|--------|----------|-------------|----------------|
| GET | `/api/materias` | Listar materias (filtros: `?carrera_id=1&cuatrimestre=1`) | No |
| POST | `/api/materias` | Crear nueva materia | No* |
| GET | `/api/materias/:id` | Obtener materia por ID (incluye carrera) | No |
| PUT | `/api/materias/:id` | Actualizar materia | No* |
| DELETE | `/api/materias/:id` | Eliminar materia | No* |

*En producción deberían estar protegidas con autenticación y roles.

## Variables de entorno necesarias

No se requieren variables adicionales para este módulo. Usa la configuración existente en `/backend/.env`.

## Para el equipo

### Frontend
- **Carreras**: Usar endpoints `/api/carreras` para listar, crear, actualizar y eliminar carreras
- **Materias**: Usar endpoints `/api/materias` para gestionar materias asociadas a carreras
- **Filtros disponibles**:
  - Carreras: `modalidad` (presencial/virtual/hibrida), `activa` (true/false)
  - Materias: `carrera_id`, `cuatrimestre`
- **Estructura de respuesta**: `{ success: boolean, message: string, data: any }`

### Backend
Se detalla el uso de los componentes creados siguiendo el patrón del módulo 1:

#### 1. Modelos (`src/models/carrera.model.js`, `src/models/materia.model.js`)
- Definición de tablas con Sequelize
- Relaciones: `Carrera.hasMany(Materia)`, `Materia.belongsTo(Carrera)`
- Soft delete habilitado con `paranoid: true`
- Índices: slug único en carreras, carrera_id en materias

#### 2. Migraciones (`src/migrations/create-carreras-table.js`, `create-materias-table.js`)
- Creación de tablas con todos los campos definidos
- Clave foránea en materias referenciando carreras
- Campos de timestamps y soft delete (createdAt, updatedAt, deletedAt)

#### 3. Seeder (`src/seeders/carrera-seeder.js`)
- Carrera por defecto: "Desarrollo de Software (a distancia)"
- Slug: `desarrollo-de-software-a-distancia`
- Modalidad: `virtual`, duración: 3 años

#### 4. Servicios (`src/services/carrera.services.js`, `materia.services.js`)
- Envueltos en `handleDbErrors` para manejo automático de errores de Sequelize
- **Carrera**: `getAll` (con filtros), `getById`, `getBySlug`, `create`, `update`, `remove`
- **Materia**: `getAll` (con filtros), `getById`, `create`, `update`, `remove`
- Validaciones de negocio (ej: no eliminar carrera con materias asociadas)

#### 5. Controladores (`src/controllers/carrera.controller.js`, `materia.controller.js`)
- Envueltos en `asyncHandler` para captura de errores
- Validación de parámetros con `express-validator`
- Uso de funciones de `response.js`: `success`, `created`, `deleted`

#### 6. Validadores (`src/middlewares/validators/carrera.validator.js`, `materia.validator.js`)
- **Carrera**: `createCarreraValidation`, `updateCarreraValidation`, `idParamValidation`
- **Materia**: `createMateriaValidation`, `updateMateriaValidation`, `idParamValidation`
- Validaciones: campos requeridos, formato de slug, valores permitidos (modalidad), tipos de datos

#### 7. Rutas (`src/routes/carrera.routes.js`, `materia.routes.js`)
- Registradas en `src/routes/index.js`
- Prefijos: `/api/carreras`, `/api/materias`
- Middlewares de validación aplicados antes de los controladores

#### 8. Tests (`tests/integration/carrera.test.js`, `materia.test.js`)
- **Carrera**: 22 tests (CRUD, validaciones, filtros)
- **Materia**: 15 tests (CRUD, validaciones, filtros, relación con carrera)
- Configuración en `tests/setup.js`: SQLite en memoria, `NODE_ENV=test`

## Archivos modificados

**Nuevos archivos:**
- Modelos: `src/models/carrera.model.js`, `src/models/materia.model.js`
- Migraciones: `src/migrations/create-carreras-table.js`, `src/migrations/create-materias-table.js`
- Seeders: `src/seeders/carrera-seeder.js`
- Servicios: `src/services/carrera.services.js`, `src/services/materia.services.js`
- Controladores: `src/controllers/carrera.controller.js`, `src/controllers/materia.controller.js`
- Validadores: `src/middlewares/validators/carrera.validator.js`, `src/middlewares/validators/materia.validator.js`
- Rutas: `src/routes/carrera.routes.js`, `src/routes/materia.routes.js`
- Tests: `tests/integration/carrera.test.js`, `tests/integration/materia.test.js`
- Utils: `src/utils/response.js` (agregada función `deleted`)

**Archivos modificados:**
- `src/models/index.js` (registrados modelos Carrera y Materia)
- `src/routes/index.js` (registradas rutas de carreras y materias)
- `src/utils/response.js` (agregada exportación `deleted`)
