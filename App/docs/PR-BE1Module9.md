# Modulo 9 - Horarios

## Resumen de cambios

Se implementa el modulo de horarios para gestionar los horarios de las materias del instituto.

**Cambios principales:**
- Modelo `Horario` con campos: id, materia_id (FK), comision (default: 'Todas'), dia, horario, aula, profesor, activo, createdAt, updatedAt, deletedAt
- Endpoints publicos `GET /api/horarios` y `GET /api/horarios/:id` para consulta sin autenticacion
- Endpoints protegidos (solo admin) para CRUD completo
- Filtros por `materia_id`, `comision` y `dia` en el listado
- Soft delete habilitado (`paranoid: true`)
- Tests de integracion completos (28 tests)

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

## Endpoints disponibles

| Metodo | Endpoint | Descripcion | Auth requerida | Autorizacion |
|--------|----------|-------------|----------------|--------------|
| GET | `/api/horarios` | Listar horarios (filtros: materia_id, dia) | No | Publico |
| GET | `/api/horarios/:id` | Obtener detalle de un horario | No | Publico |
| POST | `/api/horarios` | Crear horario | Si | admin |
| PUT | `/api/horarios/:id` | Actualizar horario | Si | admin |
| DELETE | `/api/horarios/:id` | Eliminar horario | Si | admin |

## Filtros disponibles (GET /api/horarios)

- `?materia_id=1` - Filtrar por materia
- `?comision=A` - Filtrar por comision
- `?dia=Lunes` - Filtrar por dia de la semana

## Validaciones

### Crear horario (`createHorarioValidation`)
- `materia_id`: Requerido, entero valido (min 1)
- `comision`: Opcional, string (default: 'Todas'). Indica la comision/seccion de la materia
- `dia`: Requerido, minimo 3 caracteres
- `horario`: Requerido, minimo 5 caracteres (formato "HH:MM - HH:MM")
- `aula`: Requerido, minimo 1 caracter
- `profesor`: Opcional, string
- `activo`: Opcional, booleano

### Actualizar horario (`updateHorarioValidation`)
- Todos los campos opcionales (actualizacion parcial)

## Ejemplos de uso

### Crear horario - Comision especifica

```bash
POST /api/horarios
Authorization: Bearer <admin_token>

{
  "materia_id": 1,
  "comision": "A",
  "dia": "Lunes",
  "horario": "18:00 - 20:00",
  "aula": "Aula 5",
  "profesor": "Prof. Martinez"
}
```

Respuesta (201):
```json
{
  "success": true,
  "message": "Horario creado exitosamente",
  "data": {
    "id": 1,
    "materia_id": 1,
    "comision": "A",
    "dia": "Lunes",
    "horario": "18:00 - 20:00",
    "aula": "Aula 5",
    "profesor": "Prof. Martinez",
    "activo": true,
    "createdAt": "2026-05-31T...",
    "updatedAt": "2026-05-31T...",
    "materia": { "id": 1, "nombre": "Programacion I", "carrera_id": 1 }
  }
}
```

### Crear horario - Sin comision (default "Todas")

```bash
POST /api/horarios
Authorization: Bearer <admin_token>

{
  "materia_id": 1,
  "dia": "Miercoles",
  "horario": "18:00 - 20:00",
  "aula": "Aula 5",
  "profesor": "Prof. Martinez"
}
```

Respuesta (201):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "materia_id": 1,
    "comision": "Todas",
    "dia": "Miercoles",
    ...
  }
}
```

### Ejemplo real: Materia con multiples comisiones

**Programacion I - Comision A** (Lunes y Miercoles):
```json
{ "materia_id": 1, "comision": "A", "dia": "Lunes",     "horario": "18:00 - 20:00", "aula": "Aula 5", "profesor": "Prof. Martinez" }
{ "materia_id": 1, "comision": "A", "dia": "Miercoles", "horario": "18:00 - 20:00", "aula": "Aula 5", "profesor": "Prof. Martinez" }
```

**Programacion I - Comision B** (Martes y Jueves):
```json
{ "materia_id": 1, "comision": "B", "dia": "Martes",  "horario": "20:00 - 22:00", "aula": "Aula 7", "profesor": "Prof. Garcia" }
{ "materia_id": 1, "comision": "B", "dia": "Jueves",  "horario": "20:00 - 22:00", "aula": "Aula 7", "profesor": "Prof. Garcia" }
```

**Matematica - Unica comision** (usando default "Todas"):
```json
{ "materia_id": 2, "dia": "Lunes",     "horario": "20:00 - 22:00", "aula": "Aula 3", "profesor": "Prof. Rodriguez" }
{ "materia_id": 2, "dia": "Viernes",   "horario": "20:00 - 22:00", "aula": "Aula 3", "profesor": "Prof. Rodriguez" }
```

### Consultar horarios

```bash
# Todos los horarios
GET /api/horarios

# Solo comision A de Programacion I
GET /api/horarios?materia_id=1&comision=A

# Todos los horarios del martes
GET /api/horarios?dia=Martes

# Solo comisiones generales (sin division por comision)
GET /api/horarios?comision=Todas
```

### Ejemplo de respuesta GET /api/horarios

```json
{
  "success": true,
  "message": "Horarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "materia_id": 1,
      "comision": "A",
      "dia": "Lunes",
      "horario": "18:00 - 20:00",
      "aula": "Aula 5",
      "profesor": "Prof. Martinez",
      "activo": true,
      "materia": { "id": 1, "nombre": "Programacion I", "carrera_id": 1 }
    },
    {
      "id": 3,
      "materia_id": 1,
      "comision": "B",
      "dia": "Martes",
      "horario": "20:00 - 22:00",
      "aula": "Aula 7",
      "profesor": "Prof. Garcia",
      "activo": true,
      "materia": { "id": 1, "nombre": "Programacion I", "carrera_id": 1 }
    }
  ]
}
```

## Caracteristicas implementadas

1. **Relacion por materia**: Cada horario pertenece a una materia via `materia_id` (FK). Las carreras obtienen sus horarios a traves de las materias.
2. **Comisiones**: Una misma materia puede tener multiples comisiones (A, B, etc.). El campo `comision` tiene valor por defecto `'Todas'` para horarios generales de la materia. Permite filtrar por comision especifica.
3. **Campos**: `comision` (string, default: 'Todas'), `dia` (string, ej: "Lunes"), `horario` (string, ej: "18:00 - 20:00"), `aula` (string), `profesor` (string, opcional), `activo` (boolean, default true).
3. **Soft delete**: Los horarios se eliminan logicamente via `deletedAt`.
4. **Eager loading**: Las respuestas incluyen datos de la materia asociada (`id`, `nombre`, `carrera_id`).

## Para el equipo

### Frontend (Modulo FE 2)

- **Listar horarios**: `GET /api/horarios` sin token. Acepta filtros `materia_id`, `comision` y `dia`.
- **Detalle de horario**: `GET /api/horarios/:id` sin token.
- **Crear horario**: `POST /api/horarios` con token de admin.
- **Actualizar horario**: `PUT /api/horarios/:id` con token de admin.
- **Eliminar horario**: `DELETE /api/horarios/:id` con token de admin.

#### Uso en CarreraDetailPage
La tabla `HorariosTable` ya existe y acepta un array de objetos `{ dia, horario, aula }`. Para mostrar los horarios de una carrera:
1. Obtener las materias de la carrera (`GET /api/carreras/:id` incluye `materias`)
2. Para cada materia, filtrar horarios: `GET /api/horarios?materia_id=X`
3. Pasar los horarios al componente `HorariosTable`

## Tests

Ejecutar todos los tests: `make tests-back`

Ejecutar solo este modulo: `make tests-back arg=horario`

Los tests cubren:
- CRUD completo de horarios
- Validaciones de entrada
- Control de acceso por roles (admin, profesor, tutor)
- Acceso publico a endpoints GET
- Filtrado por materia_id, comision y dia
- Relacion con materia (FK existente/inexistente)

## Archivos creados

| Archivo | Descripcion |
|---------|-------------|
| `src/models/horario.model.js` | Modelo Sequelize (paranoid, timestamps) |
| `src/migrations/create-horarios-table.js` | Migracion de la tabla horarios |
| `src/services/horario.services.js` | Logica de negocio con `handleDbErrors` |
| `src/controllers/horario.controller.js` | Manejo HTTP con `asyncHandler` |
| `src/middlewares/validators/horario.validator.js` | Validaciones con `express-validator` |
| `src/routes/horario.routes.js` | Rutas RESTful |
| `src/seeders/07-horario-seeder.js` | Seeder de horarios de ejemplo |
| `tests/integration/horario.test.js` | 28 tests de integracion |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/models/index.js` | Registro del modelo Horario |
| `src/routes/index.js` | Registro de rutas `/api/horarios` |
| `Tasks.md` | Agregado Modulo 9 con tareas completadas |
