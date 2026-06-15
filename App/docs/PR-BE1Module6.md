# Modulo 6 - Galeria (Imagenes)

## Resumen de cambios

Se implementa el módulo de galería de imágenes para el backend de la aplicación, permitiendo la gestión de imágenes organizadas por categorías y asociadas a distintas entidades del sistema.

**Cambios principales:**
- Modelo `Imagen` con campos: id, titulo, url, alt_text, categoria, entidad_id, timestamps
- Endpoints CRUD para Imagenes: `/api/imagenes` (GET, POST, PUT, DELETE) con filtros por categoría y entidad
- Endpoint de subida de archivos: `POST /api/imagenes/upload-imagen`
- Soporte para subida por archivo (Multer) o URL directa
- Migración de creación de tabla imagenes
- Tests de integración completos

## Actualizar localmente

1. **Git pull**
2. **Actualizar dependencias y reiniciar contenedores**
3. **Ejecutar migraciones**

## Endpoints disponibles

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/imagenes` | Listar imagenes (con filtros) | No | Público |
| GET | `/api/imagenes/:id` | Obtener imagen por ID | No | Público |
| POST | `/api/imagenes/upload-imagen` | Subir archivo de imagen | Sí | admin, profesor |
| POST | `/api/imagenes` | Crear nuevo registro de imagen | Sí | admin, profesor |
| PUT | `/api/imagenes/:id` | Actualizar imagen | Sí | admin, profesor |
| DELETE | `/api/imagenes/:id` | Eliminar imagen | Sí | admin |

## Filtros disponibles

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `categoria` | string | Filtrar por categoria (ej: Instalaciones, Eventos, Alumnos) |
| `entidad_id` | integer | Filtrar por ID de entidad asociada |

## Validaciones

### Creación de imagen (`createImagenValidation`)
- `titulo`: Opcional
- `url`: Opcional (si no se adjunta archivo)
- `alt_text`: Opcional
- `categoria`: Opcional
- `entidad_id`: Opcional, entero válido

### Actualización de imagen (`updateImagenValidation`)
- Todos los campos son opcionales
- Mismas reglas que creación

## Características implementadas

1. **Doble modalidad de carga**: Las imágenes pueden subirse mediante archivo (Multer) o especificando una URL directa
2. **Categorización**: Campo `categoria` para agrupar imágenes (Instalaciones, Eventos, Alumnos, etc.)
3. **Asociación flexible**: Campo `entidad_id` para vincular imágenes a cualquier entidad del sistema (noticias, eventos, etc.)
4. **Filtros**: Listado filtrable por categoría y entidad_id
5. **Acceso público**: GET públicos para mostrar la galería en el sitio

## Para el equipo

### Frontend
- **Galeria pública**: Usar `GET /api/imagenes?categoria=Instalaciones` para filtrar por sección
- **Subida de imágenes**: Usar `POST /api/imagenes/upload-imagen` con FormData (campo `imagen`) para subir archivo
- **URL directa**: Usar `POST /api/imagenes` con JSON `{ url: "https://..." }` para imágenes externas
- **Estructura de respuesta**: `{ success: boolean, message: string, data: any }`

### Backend
Se detalla el uso de los componentes creados siguiendo el patrón de módulos anteriores:

#### 1. Modelo (`src/models/imagen.model.js`)
- Campos: titulo, url (obligatorio), alt_text, categoria, entidad_id
- Timestamps (createdAt, updatedAt) - sin soft delete
- Índices en categoria y entidad_id

#### 2. Migración (`src/migrations/06-create-imagenes-table.js`)
- Creación de tabla imagenes con índices en categoria y entidad_id

#### 3. Servicio (`src/services/imagen.services.js`)
- `getAll` (con filtros: categoria, entidad_id)
- `getById` (con validación de existencia)
- `create` (creación directa)
- `update` (con validación de URL única)
- `remove` (eliminación directa)

#### 4. Controlador (`src/controllers/imagen.controller.js`)
- Envuelto en `asyncHandler`
- Validación con `express-validator`
- Uso de `response.js`: `success`, `created`, `deleted`
- Maneja `req.file` de Multer para asignar URL automática al crear/actualizar

#### 5. Validadores (`src/middlewares/validators/imagen.validator.js`)
- `createImagenValidation`: titulo, url, alt_text, categoria (opcionales), entidad_id (opcional, entero)
- `updateImagenValidation`: mismos campos opcionales
- `idParamValidation`: ID entero válido

#### 6. Rutas (`src/routes/imagen.routes.js`)
- `GET /`, `GET /:id` públicos
- `POST /upload-imagen`, `POST /`, `PUT /:id` protegidos con `authenticate` + `authorize('admin', 'profesor')` + `upload.single('imagen')`
- `DELETE /:id` protegido con `authenticate` + `authorize('admin')`

## Tests

Los tests cubren (24 tests):

**Creación de imagen (5 tests):**
- Creación con archivo (admin y profesor)
- Creación con URL directa
- Fallo sin token y con tutor (no autorizado)

**Listar imágenes (4 tests):**
- Acceso con profesor y público
- Filtro por categoria
- Filtro por entidad_id

**Obtener imagen por ID (4 tests):**
- Acceso con profesor y público
- ID inválido y no existente

**Actualizar imagen (4 tests):**
- Actualización con admin y profesor
- Imagen no existente
- Fallo con tutor

**Eliminar imagen (4 tests):**
- Eliminación con admin
- Imagen no existente
- Fallo con profesor y tutor

**Subida de imágenes (3 tests):**
- Subida con admin y profesor
- Fallo sin archivo
- Fallo sin token
- Fallo con tutor

**Total:** 24 tests

Ejecutar: `make tests-back` (desde `BASE/App/`)

## Archivos modificados/creados

### Nuevos archivos:
- `backend/src/models/imagen.model.js`
- `backend/src/services/imagen.services.js`
- `backend/src/controllers/imagen.controller.js`
- `backend/src/middlewares/validators/imagen.validator.js`
- `backend/src/routes/imagen.routes.js`
- `backend/src/migrations/06-create-imagenes-table.js`
- `backend/tests/integration/galeria.test.js`

### Archivos modificados:
- `backend/src/models/index.js` (registrado modelo Imagen)
- `backend/src/routes/index.js` (registradas rutas de /imagenes)
