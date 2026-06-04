# Modulo 12 - Refactorización Carrera-Materia (Tabla Intermedia)

## Resumen de cambios

Se refactoriza el modelo de datos para permitir que una materia pertenezca a múltiples carreras, con cuatrimestre y carga horaria independientes por cada asignación.

**Cambios principales:**
- Nuevo modelo `CarreraMateria` como tabla intermedia entre Carrera y Materia (relación M:N)
- Campo `carrera_id` eliminado de `materias` (ya no pertenece a una sola carrera)
- Campo `cuatrimestre` y `carga_horaria_semanal` movidos de `materias` a `carrera_materias`
- Campo `materia_id` en `horarios` reemplazado por `carrera_materia_id`
- Nuevos endpoints RESTful como sub-recurso de carrera: `/api/carreras/:carreraId/materias`
- Migración de datos existentes a la nueva estructura
- Tests actualizados y nuevos tests agregados

## Diagrama de modelos

```
Carrera (1) ──→ (N) carrera_materia (N) ←── (1) Materia
                         │
                         │ 1:N
                         ▼
                     Horario
```

## Actualizar localmente

1. **Git pull**
2. **Ejecutar migraciones**
   ```bash
   make migrate-dev
   ```
3. **Ejecutar seeders** (ya corre automaticamente al iniciar)
   ```bash
   make seed-dev
   ```

> La migración crea la tabla `carrera_materias`, copia los datos de `materias.carrera_id`, `cuatrimestre` y `carga_horaria_semanal` a la nueva tabla, y reemplaza `materia_id` por `carrera_materia_id` en `horarios`.

## Endpoints nuevos

| Metodo | Endpoint | Descripcion | Auth requerida | Autorizacion |
|--------|----------|-------------|----------------|--------------|
| GET | `/api/carreras/:carreraId/materias` | Listar materias de una carrera | No | Publico |
| GET | `/api/carreras/:carreraId/materias/:id` | Detalle de una asignación | Si | admin |
| POST | `/api/carreras/:carreraId/materias` | Asignar materia a carrera | Si | admin |
| PUT | `/api/carreras/:carreraId/materias/:id` | Actualizar cuatrimestre/carga | Si | admin |
| DELETE | `/api/carreras/:carreraId/materias/:id` | Desasignar materia de carrera | Si | admin |

## Endpoints modificados

### GET /api/materias

**Antes:** Filtraba por `carrera_id` y `cuatrimestre`
**Ahora:** Filtra por `nombre`. Incluye todas las asignaciones (`carrerasMateria`) con datos de carrera

### GET /api/horarios

**Antes:** Filtraba por `materia_id`
**Ahora:** Filtra por `carrera_materia_id` o `carrera_id`. Incluye `carreraMateria` con materia y carrera

### POST /api/horarios

**Antes:** Requería `materia_id`
**Ahora:** Requiere `carrera_materia_id`

### GET /api/carreras/:id y /api/carreras/slug/:slug

**Antes:** Incluía `materias` directamente
**Ahora:** Incluye `carreraMaterias` con `materia` anidada, mostrando `cuatrimestre` y `carga_horaria_semanal`

## Ejemplos de uso

### Asignar materia a carrera

```bash
POST /api/carreras/1/materias
Authorization: Bearer <admin_token>

{
  "materia_id": 3,
  "cuatrimestre": 2,
  "carga_horaria_semanal": 6
}
```

Respuesta (201):
```json
{
  "success": true,
  "message": "Asignación creada exitosamente",
  "data": {
    "id": 1,
    "carrera_id": 1,
    "materia_id": 3,
    "cuatrimestre": 2,
    "carga_horaria_semanal": 6,
    "createdAt": "2026-06-04T..."
  }
}
```

### Consultar materias de una carrera

```bash
GET /api/carreras/1/materias
```

Respuesta (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "carrera_id": 1,
      "materia_id": 1,
      "cuatrimestre": 1,
      "carga_horaria_semanal": 6,
      "materia": { "id": 1, "nombre": "Programacion I", "descripcion": "..." }
    },
    {
      "id": 2,
      "carrera_id": 1,
      "materia_id": 2,
      "cuatrimestre": 1,
      "carga_horaria_semanal": 4,
      "materia": { "id": 2, "nombre": "Matematica", "descripcion": "..." }
    }
  ]
}
```

### Crear horario (con carrera_materia_id)

```bash
POST /api/horarios
Authorization: Bearer <admin_token>

{
  "carrera_materia_id": 1,
  "comision": "A",
  "dia": "Lunes",
  "horario": "18:00 - 20:00",
  "aula": "Aula 5",
  "profesor": "Prof. Martinez"
}
```

### Consultar horarios por carrera

```bash
GET /api/horarios?carrera_id=1
```

Respuesta (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "carrera_materia_id": 1,
      "comision": "A",
      "dia": "Lunes",
      "horario": "18:00 - 20:00",
      "aula": "Aula 5",
      "profesor": "Prof. Martinez",
      "carreraMateria": {
        "id": 1,
        "cuatrimestre": 1,
        "materia": { "id": 1, "nombre": "Programacion I" },
        "carrera": { "id": 1, "nombre": "Desarrollo de Software" }
      }
    }
  ]
}
```

## Validaciones

### Asignar materia a carrera (`createCarreraMateriaValidation`)
- `materia_id`: Requerido, entero valido (min 1)
- `cuatrimestre`: Opcional, entero (1-12)
- `carga_horaria_semanal`: Opcional, entero positivo

### Actualizar asignación (`updateCarreraMateriaValidation`)
- Todos los campos opcionales (actualizacion parcial)

## Características implementadas

1. **Relación M:N**: Una materia puede pertenecer a múltiples carreras. Cada asignación tiene su propio `cuatrimestre` y `carga_horaria_semanal`.
2. **Sub-recurso RESTful**: Las asignaciones se gestionan como sub-recurso de carrera (`/api/carreras/:carreraId/materias`).
3. **Soft delete**: La tabla `carrera_materias` tiene `deletedAt` (paranoid).
4. **Eager loading**: Las respuestas incluyen datos de materia y carrera asociadas.
5. **Integridad referencial**: No se puede eliminar una carrera con asignaciones, ni una asignación con horarios.

## Para el equipo

### Frontend (Modulo FE 2)

- **Listar materias de carrera**: `GET /api/carreras/:carreraId/materias` sin token. La respuesta incluye `materia` anidada con `cuatrimestre` y `carga_horaria_semanal`.
- **Detalle de carrera**: `GET /api/carreras/:id` incluye `carreraMaterias` con materia anidada.
- **Detalle por slug**: `GET /api/carreras/slug/:slug` incluye `carreraMaterias`.
- **Crear horario**: `POST /api/horarios` ahora requiere `carrera_materia_id` en vez de `materia_id`.
- **Filtrar horarios**: `GET /api/horarios?carrera_id=X` para ver horarios de una carrera.

### Cambios en la API que afectan al frontend

| Antes | Ahora |
|-------|-------|
| `GET /api/materias?carrera_id=1` | `GET /api/carreras/1/materias` |
| `POST /api/materias` con `carrera_id` | `POST /api/carreras/:id/materias` con `materia_id` |
| `GET /api/horarios?materia_id=1` | `GET /api/horarios?carrera_materia_id=1` |
| `POST /api/horarios` con `materia_id` | `POST /api/horarios` con `carrera_materia_id` |
| `carrera` en respuesta de materia | `carrerasMateria[].carrera` |
| `materia` en respuesta de horario | `carreraMateria.materia` |

## Tests

Ejecutar todos los tests: `make tests-back`

Ejecutar tests especificos:
```bash
make tests-back arg=carreraMateria
make tests-back arg=materia
make tests-back arg=horario
make tests-back arg=carrera
make tests-back arg=stats
```

Los tests cubren:
- CRUD completo de asignaciones carrera-materia
- Validaciones de entrada
- Control de acceso por roles (admin, profesor, tutor)
- Acceso publico a endpoints GET de materias
- Filtrado por materia_id y carrera_id
- Relaciones FK existentes/inexistentes
- Bloqueo de eliminación con dependencias

## Archivos creados

| Archivo | Descripcion |
|---------|-------------|
| `src/models/carreraMateria.model.js` | Modelo Sequelize de la tabla intermedia |
| `src/migrations/create-carrera-materias-table.js` | Migración con migración de datos |
| `src/services/carreraMateria.services.js` | Logica de negocio para asignaciones |
| `src/controllers/carreraMateria.controller.js` | Manejo HTTP con asyncHandler |
| `src/middlewares/validators/carreraMateria.validator.js` | Validaciones con express-validator |
| `src/routes/carreraMateria.routes.js` | Rutas como sub-recurso de carrera |
| `src/seeders/08-carreraMateria-seeder.js` | Seeder de asignaciones de ejemplo |
| `tests/unit/services/carreraMateria.services.test.js` | Tests unitarios del servicio |
| `tests/integration/carreraMateria.test.js` | Tests de integracion de endpoints |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/models/materia.model.js` | Eliminados carrera_id, cuatrimestre, carga_horaria_semanal. Nueva asociación con CarreraMateria |
| `src/models/horario.model.js` | materia_id → carrera_materia_id. Nueva asociación con CarreraMateria |
| `src/models/carrera.model.js` | hasMany(CarreraMateria) en vez de hasMany(Materia) |
| `src/models/index.js` | Registro del modelo CarreraMateria |
| `src/services/materia.services.js` | CRUD adaptado sin carrera_id. Verificación de asignaciones en remove |
| `src/services/horario.services.js` | FK carrera_materia_id. Eager loading con carreraMateria |
| `src/services/carrera.services.js` | Eager loading con carreraMaterias. Conteo de CarreraMateria en remove |
| `src/services/stats.services.js` | CarreraMateria.count() en vez de Materia.count() |
| `src/controllers/materia.controller.js` | Filtros actualizados |
| `src/controllers/horario.controller.js` | Filtro carrera_materia_id y carrera_id |
| `src/middlewares/validators/materia.validator.js` | Eliminados campos carrera_id, cuatrimestre, carga_horaria |
| `src/middlewares/validators/horario.validator.js` | materia_id → carrera_materia_id |
| `src/routes/carrera.routes.js` | Montaje de carreraMateriaRoutes |
| `src/seeders/06-materia-seeder.js` | Solo nombre y descripcion |
| `src/seeders/07-horario-seeder.js` | Usa carrera_materia_id |
| `tests/unit/services/materia.services.test.js` | Adaptado a nuevo modelo |
| `tests/unit/services/horario.services.test.js` | Adaptado a carrera_materia_id |
| `tests/unit/services/carrera.services.test.js` | Adaptado a CarreraMateria |
| `tests/unit/services/stats.services.test.js` | Adaptado a CarreraMateria |
| `tests/integration/materia.test.js` | Adaptado sin carrera_id |
| `tests/integration/horario.test.js` | Adaptado con carrera_materia_id |
| `Tasks.md` | Agregado Modulo 12 |
