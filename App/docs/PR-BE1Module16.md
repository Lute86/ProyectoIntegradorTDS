# PR — BE Dev 1 · Module 16: Refactor Comisiones — N:M con CarreraMaterias

## Resumen

Se refactoriza el módulo de Comisiones para permitir que una comisión tenga **múltiples materias**. Se elimina la FK directa `carrera_materia_id` y se crea una tabla intermedia `comision_carrera_materias` (relación N:M). Se agrega `carrera_id` a comisiones para scopear por carrera. Una comisión puede crearse sin materias y asignarlas después.

**Tests:** 533 pasan, 0 fallan.

---

## Cambios en Backend

### Nuevos archivos

| Archivo | Descripción |
|---|---|
| `src/migrations/16-refactor-comisiones-many-materias.js` | Migración: recrea tabla `comisiones` con `carrera_id`, crea tabla intermedia `comision_carrera_materias`, migra datos |
| `src/models/comisionCarreraMateria.model.js` | Modelo Sequelize `ComisionCarreraMateria` (tabla intermedia) |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/models/comision.model.js` | Reemplaza `carrera_materia_id` por `carrera_id`, agrega `belongsToMany CarreraMateria` through junction |
| `src/models/index.js` | Registra modelo `ComisionCarreraMateria` |
| `src/services/comision.services.js` | CRUD con N:M, nuevo `assignMaterias()`, nuevo `removeMateria()` |
| `src/controllers/comision.controller.js` | Handlers para assignMaterias y removeMateria, filtro `carrera_id` directo |
| `src/middlewares/validators/comision.validator.js` | `carrera_id` requerido, `carrera_materias_ids` array opcional, nuevos validators para assign/remove |
| `src/routes/comision.routes.js` | Nuevas rutas `POST /:id/materias` y `DELETE /:id/materias/:carreraMateriaId` |
| `src/services/horario.services.js` | Valida que el par `(comision_id, carrera_materia_id)` exista en la tabla intermedia |
| `src/seeders/07-horario-seeder.js` | Usa `comision_id` en vez de `comision` string |
| `src/seeders/09-comision-seeder.js` | Usa `carrera_id` en vez de `carrera_materia_id`, crea registros en junction |
| `tests/integration/comision.test.js` | Tests actualizados + nuevos tests para N:M (35 tests) |
| `tests/integration/horario.test.js` | Setup actualizado: crea comisiones con `carrera_id` + asigna materias |
| `tests/unit/services/horario.services.test.js` | Mock de `ComisionCarreraMateria`, test de validación de par |
| `Tasks.md` | Módulo 16 agregado |

---

## Modelo de datos

### Tabla `comisiones` (cambios)

```
| Campo            | Tipo         | Notas                              |
|------------------|--------------|------------------------------------|
| id               | INTEGER (PK) | auto-increment                     |
| carrera_id       | INTEGER (FK) | NOT NULL → carreras.id             |
| nombre           | VARCHAR(20)  | NOT NULL                           |
| anio_lectivo     | INTEGER      | NOT NULL                           |
| semestre         | INTEGER      | NOT NULL, default 1                |
| encargado_id     | INTEGER (FK) | nullable → users.id                |
| activo           | BOOLEAN      | default true                       |
```

**Constraint único:** `(carrera_id, nombre, anio_lectivo, semestre)`

**Eliminado:** `carrera_materia_id` (FK directa a carrera_materias)

### Tabla `comision_carrera_materias` (nueva)

```
| Campo              | Tipo         | Notas                         |
|--------------------|--------------|-------------------------------|
| id                 | INTEGER (PK) | auto-increment                |
| comision_id        | INTEGER (FK) | NOT NULL → comisiones.id      |
| carrera_materia_id | INTEGER (FK) | NOT NULL → carrera_materias.id|
```

**Constraint único:** `(comision_id, carrera_materia_id)`

### Asociaciones actualizadas

```
Carrera ──1:N──> Comision ──N:M──> CarreraMateria
                           ↑ junction: comision_carrera_materias

Comision ──N:1──> Carrera (via carrera_id)
Comision ──N:1──> User (via encargado_id)
Comision ──1:N──> Horario (via comision_id)
```

---

## API Comisiones - Base URL: `/api/comisiones`

### GET `/api/comisiones` (público)

Query params opcionales:
- `carrera_id` (int) — filtra por carrera
- `anio_lectivo` (int)
- `semestre` (1|2)
- `encargado_id` (int)
- `activo` (true|false)

**Eliminado:** `?carrera_materia_id=` ya no es un filtro válido.

Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "carrera_id": 1,
      "nombre": "A",
      "anio_lectivo": 2026,
      "semestre": 1,
      "encargado_id": null,
      "activo": true,
      "carrera": { "id": 1, "nombre": "Desarrollo de Software", "slug": "desarrollo-de-software" },
      "carrerasMaterias": [
        {
          "id": 1,
          "cuatrimestre": 1,
          "materia": { "id": 1, "nombre": "Programacion I" },
          "carrera": { "id": 1, "nombre": "Desarrollo de Software", "slug": "desarrollo-de-software" }
        }
      ],
      "encargado": null
    }
  ]
}
```

### GET `/api/comisiones/:id` (público)

Response 200: Objeto comision con `carrerasMaterias` (array), `carrera`, `encargado` y `horarios` (array).

### POST `/api/comisiones` (admin)

Body:
```json
{
  "carrera_id": 1,
  "nombre": "A",
  "anio_lectivo": 2026,
  "semestre": 1,
  "carrera_materias_ids": [1, 2, 3],
  "encargado_id": null,
  "activo": true
}
```

- `carrera_id`: **requerido** (entero)
- `carrera_materias_ids`: **opcional** (array de enteros, puede estar vacío o omitirse para crear comisión sin materias)

### PUT `/api/comisiones/:id` (admin)

Body: parcial. `carrera_materias_ids` reemplaza completamente la lista de materias si se provee.

### DELETE `/api/comisiones/:id` (admin)

No se puede eliminar si tiene horarios asociados (409 Conflict).

### POST `/api/comisiones/:id/materias` (admin) — NUEVO

Asigna materias a una comisión (agrega, no reemplaza).

Body:
```json
{
  "carrera_materias_ids": [1, 2, 3]
}
```

### DELETE `/api/comisiones/:id/materias/:carreraMateriaId` (admin) — NUEVO

Remueve una materia de una comisión.

No se puede remover si existen horarios para ese par comision+materia (409 Conflict).

---

## Cambios en Horarios

### Validación de par comision+materia

Al crear un horario con `comision_id` + `carrera_materia_id`, el backend ahora valida que ese par exista en la tabla intermedia `comision_carrera_materias`. Si no existe, retorna 409:

```json
{
  "success": false,
  "message": "La materia no está asignada a esta comisión. Asignala primero desde POST /api/comisiones/:id/materias"
}
```

Esto asegura que solo se creen horarios para materias que están asignadas a la comisión.

---

## Modificaciones Frontend Requeridas

### 1. CRUD de Comisiones (admin)

Crear vista `/admin/comisiones` con:

| Componente | Descripción |
|---|---|
| Lista de comisiones | Tabla con filtros por carrera, año lectivo, semestre |
| Formulario crear/editar | Campos: `carrera_id` (select de carreras), `nombre`, `anio_lectivo`, `semestre`, `encargado_id` (select de usuarios) |
| Gestión de materias | Panel lateral o modal que muestra las materias asignadas, con botones para agregar/quitar materias |
| Detalle de comisión | Muestra horarios asociados + carrerasMaterias |

**Permisos:** Solo admin puede crear/editar/eliminar. Lectura pública.

### 2. Formulario de Crear/Editar Comisión

**Archivo afectado:** componente de formulario de comisiones.

| Cambio | Descripción |
|---|---|
| Campo carrera | Reemplazar `carrera_materia_id` (select de una materia) por `carrera_id` (select de carreras) |
| Campo materias | Agregar multi-select o checklist de materias (cargadas de `GET /api/carreras/:id/materias`) |
| Crear sin materias | Permitir crear comisión con `carrera_materias_ids` vacío o ausente |

**Ejemplo:**
```jsx
// Antes
<select name="carrera_materia_id">
  {carrerasMaterias.map(cm => (
    <option key={cm.id} value={cm.id}>{cm.materia.nombre}</option>
  ))}
</select>

// Ahora
<select name="carrera_id">
  {carreras.map(c => (
    <option key={c.id} value={c.id}>{c.nombre}</option>
  ))}
</select>

<MateriasSelector
  carreraId={selectedCarreraId}
  value={carreraMateriasIds}
  onChange={setCarreraMateriasIds}
/>
```

### 3. Tabla de Horarios

**Archivo afectado:** componente que renderiza la grilla/tabla de horarios.

| Cambio | Descripción |
|---|---|
| Filtro por comisión | Se mantiene, pero las comisiones ahora se cargan por `carrera_id` en vez de `carrera_materia_id` |
| Crear horario | Antes de crear un horario, verificar que la materia esté asignada a la comisión (usar `GET /api/comisiones/:id` para ver `carrerasMaterias`) |

### 4. Select de Comisiones (Componente compartido)

Crear componente `ComisionSelect` que filtre por carrera:

```jsx
// Props: carreraId, value, onChange
// Fetch: GET /api/comisiones?carrera_id={carreraId}&activo=true
// Render: <select> con opciones {id, nombre, anio_lectivo, semestre}
```

### 5. Servicios API (Frontend)

Agregar al servicio de API:

```javascript
// comisiones.js
export const getComisiones = (filters) => api.get('/comisiones', { params: filters });
export const getComisionById = (id) => api.get(`/comisiones/${id}`);
export const createComision = (data) => api.post('/comisiones', data);
export const updateComision = (id, data) => api.put(`/comisiones/${id}`, data);
export const deleteComision = (id) => api.delete(`/comisiones/${id}`);
export const assignMaterias = (id, carrera_materias_ids) =>
  api.post(`/comisiones/${id}/materias`, { carrera_materias_ids });
export const removeMateria = (comisionId, carreraMateriaId) =>
  api.delete(`/comisiones/${comisionId}/materias/${carreraMateriaId}`);
```

### 6. Seeders

Ejecutar para datos de ejemplo:
```bash
make seed-dev
```

---

## Resumen de Breaking Changes para Frontend

| Antes | Ahora | Acción |
|---|---|---|
| `comision.carrera_materia_id` (FK directa) | `comision.carrera_id` + `comision.carrerasMaterias[]` (N:M) | Actualizar modelo/formulario |
| `?carrera_materia_id=X` en GET /comisiones | `?carrera_id=X` | Actualizar filtros |
| `carrera_materia_id` requerido al crear | `carrera_id` requerido, `carrera_materias_ids` opcional | Actualizar formulario |
| Sin endpoint de assign/remove materias | `POST /:id/materias` y `DELETE /:id/materias/:cmId` | Usar nuevos endpoints |
| `carreraMateria` (objeto único) en respuesta | `carrerasMaterias` (array de objetos) | Actualizar accesos |
| Crear horario sin validar assignación | Par `(comision_id, carrera_materia_id)` debe existir en junction | Validar antes de crear horario |

---

## Archivos creados

- `src/migrations/16-refactor-comisiones-many-materias.js`
- `src/models/comisionCarreraMateria.model.js`
- `docs/PR-BE1Module16.md`

## Archivos modificados

- `src/models/comision.model.js`
- `src/models/index.js`
- `src/services/comision.services.js`
- `src/controllers/comision.controller.js`
- `src/middlewares/validators/comision.validator.js`
- `src/routes/comision.routes.js`
- `src/services/horario.services.js`
- `src/seeders/07-horario-seeder.js`
- `src/seeders/09-comision-seeder.js`
- `tests/integration/comision.test.js`
- `tests/integration/horario.test.js`
- `tests/unit/services/horario.services.test.js`
- `Tasks.md`
