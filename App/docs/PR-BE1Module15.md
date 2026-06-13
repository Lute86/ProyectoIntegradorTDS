# PR — BE Dev 1 · Module 15: Comisiones + FK en Horarios

## Resumen

Se agrega el módulo **Comisiones** como entidad independiente y se reemplaza el campo string `comision` en horarios por una FK `comision_id` que referencia la nueva tabla. Esto permite gestionar comisiones de forma independiente, asignarlas a horarios y asociar un encargado opcional.

**Tests:** 521 pasan, 0 fallan.

---

## Cambios en Backend

### Nuevos archivos

| Archivo | Descripción |
|---|---|
| `src/models/comision.model.js` | Modelo Sequelize `Comision` |
| `src/migrations/14-create-comisiones-table.js` | Migración: crea tabla `comisiones` |
| `src/migrations/15-add-comision-id-to-horarios.js` | Migración: agrega `comision_id` FK, migra datos, elimina columna string |
| `src/middlewares/validators/comision.validator.js` | Validadores express-validator para create/update |
| `src/services/comision.services.js` | Lógica de negocio CRUD |
| `src/controllers/comision.controller.js` | Controladores HTTP |
| `src/routes/comision.routes.js` | Rutas Express |
| `src/seeders/09-comision-seeder.js` | Seeder de comisiones de ejemplo |
| `tests/integration/comision.test.js` | Tests de integración (27 tests) |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/models/index.js` | Se registra el modelo `Comision` |
| `src/routes/index.js` | Se registra la ruta `/api/comisiones` |
| `src/models/horario.model.js` | Se reemplaza `comision` (STRING) por `comision_id` (INTEGER FK), se agrega asociación `comisionInfo` |
| `src/services/horario.services.js` | Filtro por `comision_id`, include de `Comision` en queries, validación de existencia |
| `src/controllers/horario.controller.js` | Filtro `comision_id` desde query params |
| `src/middlewares/validators/horario.validator.js` | `comision_id` requerido (reemplaza `comision` string) |
| `src/seeders/09-comision-seeder.js` | Seeds con `carrera_materia_id` y `comision_id` |
| `tests/integration/horario.test.js` | Tests actualizados para usar `comision_id` |
| `tests/unit/services/horario.services.test.js` | Mock de `Comision`, tests de validación `comision_id` |

---

## Modelo Comision

```
Tabla: comisiones

| Campo              | Tipo         | Nullable | Default         |
|--------------------|--------------|----------|-----------------|
| id                 | INTEGER (PK) | no       | auto-increment  |
| carrera_materia_id | INTEGER (FK) | no       | -               |
| nombre             | VARCHAR(20)  | no       | -               |
| anio_lectivo       | INTEGER      | no       | año actual      |
| semestre           | INTEGER      | no       | 1               |
| encargado_id       | INTEGER (FK) | sí       | null            |
| activo             | BOOLEAN      | no       | true            |
| created_at         | DATETIME     | no       | now             |
| updated_at         | DATETIME     | no       | now             |
| deleted_at         | DATETIME     | sí       | null (paranoid) |
```

**Constraint único:** `(carrera_materia_id, nombre, anio_lectivo, semestre)`

**Asociaciones:**
- `belongsTo` CarreraMateria (as: `carreraMateria`)
- `belongsTo` User (as: `encargado`)
- `hasMany` Horario (as: `horarios`)

---

## API Comisiones - Base URL: `/api/comisiones`

### GET `/api/comisiones` (público)

Query params opcionales:
- `carrera_materia_id` (int)
- `carrera_id` (int)
- `anio_lectivo` (int)
- `semestre` (1|2)
- `encargado_id` (int)
- `activo` (true|false)

Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "carrera_materia_id": 1,
      "nombre": "A",
      "anio_lectivo": 2026,
      "semestre": 1,
      "encargado_id": null,
      "activo": true,
      "carreraMateria": {
        "id": 1,
        "cuatrimestre": 1,
        "carga_horaria_semanal": 6,
        "materia": { "id": 1, "nombre": "Programacion I" },
        "carrera": { "id": 1, "nombre": "Desarrollo de Software", "slug": "desarrollo-de-software" }
      },
      "encargado": null
    }
  ],
  "message": "Comisiones obtenidas exitosamente"
}
```

### GET `/api/comisiones/:id` (público)

Response 200: Objeto comision con `carreraMateria`, `encargado` y `horarios` (array).

### POST `/api/comisiones` (admin)

Body:
```json
{
  "carrera_materia_id": 1,
  "nombre": "A",
  "anio_lectivo": 2026,
  "semestre": 1,
  "encargado_id": null,
  "activo": true
}
```

Validaciones: `nombre` requerido (1-20 chars), `anio_lectivo` (2020-2030), `semestre` (1|2), `encargado_id` opcional.

### PUT `/api/comisiones/:id` (admin)

Body: parcial, todos los campos opcionales.

### DELETE `/api/comisiones/:id` (admin)

No se puede eliminar si tiene horarios asociados (409 Conflict).

---

## Cambios en Horarios - Breaking Change

### Campo eliminado

`comision` (STRING) — **ELIMINADO**

### Campo nuevo

`comision_id` (INTEGER FK → `comisiones.id`) — **REQUERIDO**

### Migración automática

La migración `15-add-comision-id-to-horarios.js`:
1. Agrega columna `comision_id`
2. Intenta resolver cada valor string de `comision` con un LIKE en la tabla `comisiones`
3. Si no encuentra match, asigna comision_id = 1 (fallback)
4. Elimina la columna `comision`

### GET `/api/horarios` - Response modificado

**Antes:**
```json
{
  "comision": "A"
}
```

**Ahora:**
```json
{
  "comision_id": 1,
  "comisionInfo": {
    "id": 1,
    "nombre": "A",
    "anio_lectivo": 2026,
    "semestre": 1
  }
}
```

El query param `?comision=A` ahora es `?comision_id=1`.

---

## Modificaciones Frontend Requeridas

### 1. Tabla de Horarios

**Archivo afectado:** componente que renderiza la grilla/tabla de horarios.

| Cambio | Descripción |
|---|---|
| Columna `comision` | Reemplazar por `comisionInfo.nombre` o mostrar `comision_id` |
| Filtro por comisión | Cambiar de filtro string a filtro por `comision_id` (select/autocomplete con opciones de la API de comisiones) |
| Datos del horario | Ahora incluye `comisionInfo` (objeto) además de `comision_id` |

**Ejemplo de acceso:**
```jsx
// Antes
horario.comision

// Ahora
horario.comisionInfo?.nombre
horario.comision_id
```

### 2. Formulario de Crear/Editar Horario

**Archivo afectado:** componente de formulario de horarios.

| Cambio | Descripción |
|---|---|
| Campo comisión | Reemplazar input string por `<select>` o `<Combobox>` con opciones de `GET /api/comisiones` |
| Campo requerido | `comision_id` es **requerido** (no opcional) |
| Validación frontend | Debe enviar `comision_id` (integer), no string |

**Ejemplo:**
```jsx
// Antes
<input name="comision" value={horario.comision} />

// Ahora
<select name="comision_id" value={horario.comision_id} required>
  {comisiones.map(c => (
    <option key={c.id} value={c.id}>{c.nombre}</option>
  ))}
</select>
```

### 3. Nuevo Módulo de Comisiones (CRUD)

Crear vista `/admin/comisiones` con:

| Componente | Descripción |
|---|---|
| Lista de comisiones | Tabla con filtros por carrera, año lectivo, semestre |
| Formulario crear/editar | Campos: carrera_materia_id, nombre, anio_lectivo, semestre, encargado_id (select de usuarios) |
| Detalle de comisión | Muestra horarios asociados |

**Permisos:** Solo admin puede crear/editar/eliminar. Lectura pública.

### 4. Select de Comisiones (Componente compartido)

Se recomienda crear un componente `ComisionSelect` reutilizable:

```jsx
// Props: carreraMateriaId, value, onChange
// Fetch: GET /api/comisiones?carrera_materia_id={carreraMateriaId}&activo=true
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
```

### 6. Filtros de Horarios

Actualizar los filtros del componente de horarios:

```jsx
// Antes
<input name="comision" placeholder="Comisión" />

// Ahora
<ComisionSelect
  value={filters.comision_id}
  onChange={(id) => setFilters({ ...filters, comision_id: id })}
/>
```

### 7. Seeders

Se crearon comisiones de ejemplo. Ejecutar:
```bash
make seed-dev
```

---

## Resumen de Breaking Changes para Frontend

| Antes | Ahora | Acción |
|---|---|---|
| `horario.comision` (string) | `horario.comisionInfo.nombre` (object) | Actualizar accesos |
| `?comision=A` | `?comision_id=1` | Actualizar filtros |
| Input string en formulario | Select/Combobox de comisiones | Reemplazar componente |
| No existía módulo comisiones | CRUD completo en `/admin/comisiones` | Crear vistas nuevas |
| `comision` opcional en horario | `comision_id` requerido | Ajustar validación |
