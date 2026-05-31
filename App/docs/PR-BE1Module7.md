# PR Módulo 7: Configuración del Sitio y Estadísticas

## Descripción
Implementación del módulo de configuración del sitio (SiteConfig) y estadísticas del dashboard (Stats) para el panel de administración del IFTS 29.

## Endpoints Implementados

### SiteConfig
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/config` | Obtener configuración del sitio | Pública |
| PUT | `/api/config` | Actualizar configuración del sitio | Admin |

### Stats
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/stats/dashboard` | Obtener estadísticas del dashboard | Admin |

## Archivos Modificados/Creados

### Backend (`App/backend/src/`)

#### Modelos
- **`models/siteconfig.model.js`** (nuevo)
  - Campos: id, site_name, site_subtitle, contact_email, contact_phone, address, seo_description, footer_text, colors (JSON), layout (JSON), sections (JSON), typography (JSON), theme_preset
  - Timestamps: createdAt, updatedAt, deletedAt (paranoid)
  - Índice único en id

#### Migraciones
- **`migrations/create-siteconfig-table.js`** (nuevo)
  - Crea tabla `site_config` con todos los campos definidos en el modelo
  - Manejo de rollback con `dropTable`

#### Seeders
- **`seeders/siteconfig-seeder.js`** (nuevo)
  - Configuración por defecto: IFTS 29, colores primarios, secciones visibles (hero, statistics, careers, news, events, testimonials, gallery)
  - Se ejecuta solo si no existe configuración previa

#### Servicios
- **`services/siteconfig.services.js`** (nuevo)
  - `getConfig()`: Obtiene o crea configuración por defecto
  - `updateConfig(data)`: Actualiza o crea la configuración

- **`services/stats.services.js`** (nuevo)
  - `getDashboardStats()`: Retorna conteo de carreras activas, materias y staff (admin/profesor/tutor activos)

#### Controladores
- **`controllers/siteconfig.controller.js`** (nuevo)
  - `getConfig()`: Retorna configuración actual
  - `updateConfig()`: Actualiza configuración con validación

- **`controllers/stats.controller.js`** (nuevo)
  - `getDashboardStats()`: Retorna estadísticas para el dashboard

#### Rutas
- **`routes/siteconfig.routes.js`** (nuevo)
  - GET `/` - Pública
  - PUT `/` - Protegida (admin), con validadores

- **`routes/stats.routes.js`** (nuevo)
  - GET `/dashboard` - Protegida (admin)

- **`routes/index.js`** (modificado)
  - Registro de `siteConfigRoutes` en `/config`
  - Registro de `statsRoutes` en `/stats`

#### Validadores
- **`middlewares/validators/siteconfig.validator.js`** (nuevo)
  - `updateSiteConfigValidation`: Valida campos opcionales
    - `site_name`: No vacío, string
    - `contact_email`: Formato email válido
    - `colors`, `layout`, `typography`: Deben ser objetos JSON
    - `sections`: Debe ser array con secciones válidas (`hero`, `statistics`, `careers`, `news`, `events`, `testimonials`, `gallery`)
    - `theme_preset`: String

#### Modelos (modificado)
- **`models/index.js`** (modificado)
  - Registro de `SiteConfig` model

### Tests (`App/backend/tests/integration/`)
- **`siteconfig.test.js`** (nuevo)
  - 8 tests: GET/PUT config, validaciones, secciones válidas/inválidas, permisos

- **`stats.test.js`** (nuevo)
  - 6 tests: GET dashboard stats, conteo de carreras/materias/staff, permisos

## Secciones Válidas (SiteConfig)
El campo `sections` acepta un array de objetos con la estructura:
```json
[
  { "id": "hero", "visible": true, "order": 1 },
  { "id": "statistics", "visible": true, "order": 2 },
  { "id": "careers", "visible": true, "order": 3 },
  { "id": "news", "visible": true, "order": 4 },
  { "id": "events", "visible": true, "order": 5 },
  { "id": "testimonials", "visible": true, "order": 6 },
  { "id": "gallery", "visible": false, "order": 7 }
]
```

## Estructura de Respuesta

### GET /api/config
```json
{
  "success": true,
  "message": "Configuración obtenida exitosamente",
  "data": {
    "id": 1,
    "site_name": "IFTS 29",
    "site_subtitle": "Nueva Web",
    "contact_email": "contacto@ifts29.edu.ar",
    "contact_phone": "+54 11 1234-5678",
    "address": "Buenos Aires, Argentina",
    "seo_description": "...",
    "footer_text": "...",
    "colors": { "primary": "#3B82F6", ... },
    "layout": { "header": "default", ... },
    "sections": [...],
    "typography": { "fontFamily": "Inter", ... },
    "theme_preset": "default",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### GET /api/stats/dashboard
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "carreras": 2,
    "materias": 0,
    "staff": 3
  }
}
```

## Mejoras Futuras
- Métricas de visitantes del sitio (analytics)
- Conteo de estudiantes por carrera
- Tasa de aprobación de materias
- Rendimiento con vistas materializadas o tabla de cache
- Métricas adicionales: demanda de cursos, horarios pico, tiempo de lectura

## Tests
```bash
make tests-back  # Ejecuta todos los tests incluyendo siteconfig y stats
```

**Resultado:** 14 tests pasando (8 siteconfig + 6 stats)

## Dependencias
- Ninguna (módulo independiente)
- Modelos utilizados para stats: Carrera, Materia, User

## Contraparte FE
- Módulo FE 5: Personalización y Configuración del Sitio
