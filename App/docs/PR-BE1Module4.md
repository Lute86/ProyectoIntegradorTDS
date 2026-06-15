# Modulo 4 - Categorias y Noticias

## Resumen de cambios

Se implementa el sistema de gestión de contenido con categorías y noticias para el backend de la aplicación.

**Cambios principales:**
- Modelo `Categoria` con campos: id, nombre, slug (único), color (hexadecimal), soft delete
- Modelo `Noticia` con campos: id, titulo, slug (único), contenido, imagen_destacada_url, categoria_id, autor_id, estado (borrador/publicado/archivado), fecha_publicacion, soft delete
- Relación: Noticia pertenece a Categoria (belongsTo), Noticia pertenece a User (autor)
- Endpoints CRUD para Categorias: `/api/categorias` (GET, POST, PUT, DELETE) con acceso público a GET y admin para mutaciones
- Endpoints CRUD para Noticias: `/api/noticias` (GET, POST, PUT, DELETE) con paginación, búsqueda y filtros
- Endpoint de subida de imágenes para noticias: `POST /api/noticias/upload-imagen`
- Middleware `requireNoticiaOwnership` para autorizar solo al autor o admin
- Migraciones de creación de tablas categorías y noticias
- Seeder con 5 categorías por defecto y 5 noticias de ejemplo
- Tests de integración para ambos módulos

## Actualizar localmente

1. **Git pull**
2. **Actualizar dependencias y reiniciar contenedores**
3. **Ejecutar migraciones**
4. **Cargar seeders**

## Endpoints disponibles

### Categorias

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/categorias` | Listar todas las categorias | No | Público |
| POST | `/api/categorias` | Crear nueva categoria | Sí | admin |
| GET | `/api/categorias/:id` | Obtener categoria por ID | No | Público |
| PUT | `/api/categorias/:id` | Actualizar categoria | Sí | admin |
| DELETE | `/api/categorias/:id` | Eliminar categoria | Sí | admin |

### Noticias

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/noticias` | Listar noticias (paginado) | No | Público |
| GET | `/api/noticias/slug/:slug` | Obtener noticia por slug | No | Público |
| GET | `/api/noticias/:id` | Obtener noticia por ID | No | Público |
| POST | `/api/noticias/upload-imagen` | Subir imagen destacada | Sí | admin, profesor, tutor |
| POST | `/api/noticias` | Crear nueva noticia | Sí | admin, profesor, tutor |
| PUT | `/api/noticias/:id` | Actualizar noticia | Sí | Propietario o admin |
| DELETE | `/api/noticias/:id` | Eliminar noticia | Sí | Propietario o admin |

## Filtros disponibles

### Noticias

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `categoria_id` | integer | Filtrar por categoria |
| `estado` | string | Filtrar por estado (`borrador`, `publicado`, `archivado`) |
| `search` | string | Buscar por titulo o contenido |
| `page` | integer | Número de página (default: 1) |
| `limit` | integer | Resultados por página (default: 10) |

## Validaciones

### Creación de categoria (`createCategoriaValidation`)
- `nombre`: Requerido, mínimo 2 caracteres
- `slug`: Requerido, solo minúsculas, números y guiones
- `color`: Opcional, formato hexadecimal (`#3B82F6`)

### Creación de noticia (`createNoticiaValidation`)
- `titulo`: Requerido, mínimo 3 caracteres
- `slug`: Requerido, solo minúsculas, números y guiones
- `contenido`: Opcional
- `imagen_destacada_url`: Opcional
- `categoria_id`: Opcional, entero válido
- `autor_id`: Opcional, entero válido (default: usuario autenticado)
- `estado`: Opcional (`borrador`, `publicado`, `archivado`)
- `fecha_publicacion`: Opcional, formato ISO8601

## Características implementadas

1. **Paginación en noticias**: Respuesta incluye `data`, `total`, `page`, `limit`, `totalPages`
2. **Búsqueda por texto**: Filtro `search` busca en titulo y contenido
3. **Estados de noticia**: Máquina de estados simple (borrador → publicado → archivado)
4. **Propietario de noticia**: Middleware `requireNoticiaOwnership` que permite modificar solo al autor o admin
5. **Inclusión de relaciones**: Noticias devuelven categoria (nombre, slug, color) y autor (nombre, apellido, avatar)
6. **Subida de imágenes**: Endpoint separado para subir imagen destacada via Multer

## Middleware de autorización: `noticiaOwnership.middleware.js`

Se creó un nuevo middleware `requireNoticiaOwnership` que permite acceso si:
- El usuario es admin, O
- El usuario es profesor/tutor y es el autor de la noticia

```javascript
// Uso en rutas
router.put('/:id', idParamValidation, updateNoticiaValidation, requireNoticiaOwnership(), noticiaController.update);
router.delete('/:id', idParamValidation, requireNoticiaOwnership(), noticiaController.remove);
```

## Seeder de categorias

El seeder `categoria-seeder.js` crea 5 categorias por defecto:

| Nombre | Slug | Color |
|--------|------|-------|
| Inscripciones | inscripciones | `#3B82F6` |
| Exámenes | examenes | `#EF4444` |
| Eventos | eventos | `#10B981` |
| Tecnología | tecnologia | `#8B5CF6` |
| Becas | becas | `#F59E0B` |

El seeder de noticias crea 5 noticias de ejemplo (4 publicadas, 1 borrador) asociadas a las categorias y al admin.

## Para el equipo

### Frontend
- **Categorias**: Usar `GET /api/categorias` para obtener lista de categorias
- **Noticias**: Usar `GET /api/noticias` con filtros opcionales para listar con paginación
- **Detalle de noticia**: Usar `GET /api/noticias/slug/:slug` para SEO-friendly URLs
- **Creación**: `POST /api/noticias` requiere titulo, slug y opcionalmente categoria/estado
- **Subida de imágenes**: Usar `POST /api/noticias/upload-imagen` con FormData (campo `imagen`)
- **Autorización en UI**: Admin puede editar/eliminar cualquier noticia; profesor/tutor solo las propias

### Backend
Se detalla el uso de los componentes creados siguiendo el patrón de módulos anteriores:

#### 1. Modelos (`src/models/categoria.model.js`, `src/models/noticia.model.js`)
- Categoria: nombre, slug (único), color (hex)
- Noticia: titulo, slug (único), contenido, imagen_destacada_url, categoria_id (FK), autor_id (FK), estado, fecha_publicacion
- Soft delete habilitado con `paranoid: true`
- Relaciones: `Noticia.belongsTo(Categoria)`, `Noticia.belongsTo(User)`

#### 2. Migraciones (`src/migrations/03-create-categorias-table.js`, `10-create-noticias-table.js`)
- Creación de tablas con índices únicos en slug
- Claves foráneas: categoria_id → categorias, autor_id → users
- Timestamps y soft delete

#### 3. Seeders (`src/seeders/03-categoria-seeder.js`, `04-noticia-seeder.js`)
- Categorias por defecto (5)
- Noticias de ejemplo con datos realistas

#### 4. Servicios (`src/services/categoria.services.js`, `noticia.services.js`)
- Envueltos en `handleDbErrors` para manejo automático de errores de Sequelize
- **Categoria**: `getAll`, `getById`, `create`, `update`, `remove` (con validación de slug único)
- **Noticia**: `getAll` (con filtros, paginación, includes), `getById`, `getBySlug`, `create`, `update`, `remove` (con validación de slug único y existencia de categoria/autor)

#### 5. Controladores (`src/controllers/categoria.controller.js`, `noticia.controller.js`)
- Envueltos en `asyncHandler` para captura de errores
- Validación de parámetros con `express-validator`
- Uso de funciones de `response.js`: `success`, `created`, `deleted`

#### 6. Validadores
- **Categoria**: `createCategoriaValidation`, `updateCategoriaValidation`, `idParamValidation`
- **Noticia**: `createNoticiaValidation`, `updateNoticiaValidation`, `idParamValidation`, `slugParamValidation`

#### 7. Rutas (`src/routes/categoria.routes.js`, `noticia.routes.js`)
- Prefijos: `/api/categorias`, `/api/noticias`
- GET público, POST/PUT/DELETE con autenticación y roles
- Noticias incluyen middleware de ownership

## Tests

Los tests cubren:

**Categorias (23 tests):**
- Creación exitosa y validaciones (nombre, slug duplicado, color inválido)
- Acceso sin token y con roles no autorizados
- Listar, obtener por ID
- Actualizar y eliminar (admin)
- Acceso público a GET

**Noticias (26 tests):**
- Creación con admin, profesor y tutor
- Validaciones (titulo faltante, slug duplicado, estado inválido)
- Listar con filtros (estado, categoria_id, search)
- Paginación
- Obtener por ID y por slug
- Actualizar (admin, profesor como owner, tutor no autorizado)
- Eliminar (admin, profesor no autorizado)
- Subida de imágenes

**Total:** 49 tests

Ejecutar: `make tests-back` (desde `BASE/App/`)

## Archivos modificados/creados

### Nuevos archivos:
- `backend/src/models/categoria.model.js`
- `backend/src/models/noticia.model.js`
- `backend/src/services/categoria.services.js`
- `backend/src/services/noticia.services.js`
- `backend/src/controllers/categoria.controller.js`
- `backend/src/controllers/noticia.controller.js`
- `backend/src/middlewares/validators/categoria.validator.js`
- `backend/src/middlewares/validators/noticia.validator.js`
- `backend/src/middlewares/noticiaOwnership.middleware.js`
- `backend/src/routes/categoria.routes.js`
- `backend/src/routes/noticia.routes.js`
- `backend/src/migrations/03-create-categorias-table.js`
- `backend/src/migrations/10-create-noticias-table.js`
- `backend/src/seeders/03-categoria-seeder.js`
- `backend/src/seeders/04-noticia-seeder.js`
- `backend/tests/integration/categoria.test.js`
- `backend/tests/integration/noticia.test.js`

### Archivos modificados:
- `backend/src/models/index.js` (registrados modelos Categoria y Noticia)
- `backend/src/routes/index.js` (registradas rutas de /categorias y /noticias)
