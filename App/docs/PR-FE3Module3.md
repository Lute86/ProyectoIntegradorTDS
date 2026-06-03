# FE Módulo 3 - Noticias, Contacto y Portal Estudiante

## Resumen de cambios

- `NoticiasPage`: listado con búsqueda en tiempo real, filtro por categorías, paginación (4/pág), sidebar con categorías y destacadas
- `NoticiaDetailPage`: breadcrumb, header con badge/gradiente, imagen placeholder, contenido, volver a noticias
- `src/data/mockNoticias.js`: datos mock compartidos (7 noticias) + BADGE_COLORS
- `NewsSidebar`: componente sidebar con categorías (contador) y noticias destacadas (colocalizado en NoticiasPage/)
- `ContactoPage`: página completa con formulario de contacto (RHF+Zod) e info cards laterales
- `ContactForm`: formulario colocalizado en ContactoPage/ con validación RHF+Zod
- `EstudiantesPage`: portal del estudiante con cards de acceso rápido, tabla de horarios, enlaces útiles
- `QuickLinks`: grilla de enlaces colocalizada en EstudiantesPage/
- `noticiasStore.ts`: TTL 30s (`_lastFetched`), `fetchNoticiaBySlug`, `fetchCategorias`, `selectedNoticia`, `setSelectedNoticia`, usa `noticiasService`
- `noticiasService.js`: capa de servicio (getAll, getBySlug, getCategories, create, update, remove)
- `NoticiasPage` conectada al store con fallback a MOCK_NOTICIAS
- `NoticiaDetailPage` conectada al store con fallback a MOCK_NOTICIAS + loading skeleton
- Ruta `/noticias/:slug` en AppRouter.jsx

## Archivos

| Archivo | Tipo |
|---------|------|
| `src/data/mockNoticias.js` | Nuevo |
| `src/pages/public/NoticiaDetailPage/NoticiaDetailPage.jsx` | Modificado |
| `src/pages/public/NoticiasPage/NoticiasPage.jsx` | Modificado |
| `src/pages/public/NoticiasPage/NewsSidebar.jsx` | Nuevo |
| `src/pages/public/ContactoPage/ContactoPage.jsx` | Modificado |
| `src/pages/public/ContactoPage/ContactForm.jsx` | Modificado |
| `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | Modificado |
| `src/pages/public/EstudiantesPage/QuickLinks.jsx` | Nuevo |
| `src/AppRouter.jsx` | Modificado |
| `src/services/noticiasService.js` | Nuevo |
| `src/stores/noticiasStore.ts` | Modificado |
| `src/tests/components/NewsSidebar.test.jsx` | Nuevo |
| `src/tests/components/ContactForm.test.jsx` | Nuevo |
| `src/tests/components/QuickLinks.test.jsx` | Nuevo |
| `src/components/SectionGuard.jsx` | Nuevo |
| `src/hooks/useThemeStyles.js` | Nuevo |
| `src/components/layout/PublicLayout/PublicLayout.jsx` | Modificado |
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Modificado |
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Modificado |
| `backend/src/middlewares/validators/siteconfig.validator.js` | Modificado |

## Tests

| Archivo | Tests |
|---------|-------|
| `tests/components/NewsSidebar.test.jsx` | 7 tests (categorías, destacadas, selección, navegación) |
| `tests/components/ContactForm.test.jsx` | 3 tests esenciales (submit, validación, loading) |
| `tests/components/QuickLinks.test.jsx` | 2 tests esenciales (render 6 links, empty) |

## Integración con Store

Las páginas públicas (`NoticiasPage`, `NoticiaDetailPage`) se conectan al store y usan un adaptador (`adaptNoticia`) que transforma el formato API (con `categoria.nombre`, `autor.nombre + apellido`, `fecha_publicacion` ISO) al formato mock que la UI espera. Si el store no tiene datos (API caído o vacío), caen a MOCK_NOTICIAS como fallback.

## Extensiones del modulo (sesion 2 Junio 2026)

### Eventos

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/pages/public/EventosPage/EventosPage.jsx` | Nuevo | Pagina independiente /eventos con busqueda y paginacion |
| `src/components/public/EventosSection/EventosCard.jsx` | Nuevo | Card con titulo arriba, descripcion, fecha/hora/modalidad/ver mas abajo |
| `src/components/public/EventosSection/EventosSection.jsx` | Nuevo | Carrusel responsive con auto-play, dots, link "Ver todos los eventos" |
| `src/services/eventosService.js` | Nuevo | Service que intenta GET /api/eventos, devuelve null si falla |
| `src/stores/eventosStore.ts` | Modificado | fetchEventos intenta API primero, fallback a EVENTOS_MOCK |
| `src/pages/public/HomePage/HomePage.jsx` | Modificado | Agregado EventosSection al mapa de secciones |
| `src/AppRouter.jsx` | Modificado | Ruta /eventos agregada |
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Modificado | Dropdown Eventos apunta a /eventos |

**Detalles:**
- EventosPage centrada (max-w-3xl), sin sidebar, sin filtros de categoria
- Cards con borde de acento izquierdo (azul=presencial, verde=virtual)
- Busqueda por texto y paginacion (5 items/pagina)
- Icono de modalidad (ubicacion/camara) segun tipo

### Galeria / Imagenes

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/stores/galeriaStore.ts` | Modificado | Conectado a GET /api/imagenes, sin mock |
| `src/components/public/GaleriaCarousel/GaleriaCarousel.jsx` | Modificado | Usa useGaleriaStore en vez de GALERIA_MOCK |

**Detalles:**
- Sin mock: si API falla no se renderiza nada
- Adapta formato BE al del carrusel

### Horarios conectados a API

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/services/horariosService.js` | Nuevo | Service para GET /api/horarios |
| `src/pages/public/CarrerasPage/CarreraDetailPage.jsx` | Modificado | Pestana Horarios con selector de comision y tabla desde API |
| `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | Modificado | Selects de carrera + comision con fetch dinamico de horarios |

**Detalles:**
- GET /api/horarios es publico (sin auth)
- Filtro por materia_id y comision
- CarreraDetailPage: comision pills + tabla por materia
- EstudiantesPage: select de carrera, luego select de comision, tabla completa

### CarrerasPage rediseno

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/pages/public/CarrerasPage/CarrerasPage.jsx` | Modificado | Grid 2 columnas, icono academico, cards mas compactas |

### Requisitos en CarreraDetailPage

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/pages/public/CarrerasPage/CarreraDetailPage.jsx` | Modificado | Lista fija de requisitos con checkmark en pestana Requisitos |

### SectionManager labels

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/components/admin/SectionManager.tsx` | Modificado | Agregadas labels para events, statistics, gallery, students |

### Bugfix carrerasService

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/services/carrerasService.js` | Modificado | URL de getBySlug corregida (faltaba /slug/) |

## Secciones publicas dinamicas (siteConfig)

### SectionGuard — ocultar rutas segun visibilidad en config

Nuevo componente que envuelve rutas publicas y redirige a `/` si la seccion esta desactivada en siteConfig.

| Archivo | Tipo | Proposito |
|---------|------|-----------|
| `src/components/SectionGuard.jsx` | Nuevo | Wrapper `<SectionGuard sectionId="...">` que redirige si `!section.visible` |

**Rutas protegidas en `AppRouter.jsx`:**

| Ruta | sectionId |
|------|-----------|
| `/carreras`, `/carreras/:slug` | `careers` |
| `/noticias`, `/noticias/:slug` | `news` |
| `/eventos` | `events` |
| `/contacto` | `contact` |
| `/estudiantes` | `students` |

### useThemeStyles — CSS variables desde SiteConfig

Nuevo hook que lee `config.colors` y `config.typography` y setea CSS custom properties en `:root`:

| Variable | Fuente |
|----------|--------|
| `--clr-primary` | `config.colors.primary` |
| `--clr-secondary` | `config.colors.secondary` |
| `--clr-accent` | `config.colors.accent` |
| `--clr-surface` | `config.colors.surface` |
| `--clr-bg` | `config.colors.background` |
| `--clr-text` | `config.colors.text` |
| `--font-heading` | `config.typography.headingFont` |
| `--font-body` | `config.typography.bodyFont` |
| `--font-base-size` | `config.typography.baseSize` |

Se ejecuta en `PublicLayout.jsx` via `useThemeStyles()`.

### Navbar y Footer con colores dinamicos

| Archivo | Cambio |
|---------|--------|
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Fondo usa `var(--clr-surface)`, link activo usa `var(--clr-secondary)`, boton Admin usa `var(--clr-accent)` |
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Fondo usa `var(--clr-surface)`, texto usa `var(--clr-text)` |

### ContactoPage con datos y colores dinamicos

| Archivo | Cambio |
|---------|--------|
| `src/pages/public/ContactoPage/ContactoPage.jsx` | infoCards lee `config.address`, `config.contactEmail`, `config.contactPhone` del store. Colores usan `var(--clr-*)` |
| `src/pages/public/ContactoPage/ContactForm.jsx` | Borde inputs y boton submit usan `var(--clr-primary)`, labels usan `var(--clr-text)` |

### Fix backend validator

| Archivo | Cambio |
|---------|--------|
| `App/backend/src/middlewares/validators/siteconfig.validator.js` | Agregados `'students'` y `'contact'` a `validSections` |

---

## Pendiente

### Tests faltantes
| Archivo | Prioridad |
|---------|-----------|
| `tests/pages/NoticiasPage.test.jsx` | Alta |
| `tests/pages/NoticiaDetailPage.test.jsx` | Alta |
| `tests/pages/EstudiantesPage.test.jsx` | Media |

### Issues de implementacion
- QuickLinks usa href="#" — todos los enlaces son placeholders sin destino real
- adaptNoticia() duplicado en NoticiasPage.jsx y NoticiaDetailPage.jsx — extraer a util compartida
- mockNoticias.categoria es string pero NewsSidebar espera objeto {nombre} — puede causar undefined en keys
- Eventos y Testimonios no muestran datos reales por bug de auth en BE (evento.routes.js:9, testimonio.routes.js:9)
- Falta saveConfig() en siteConfigStore (cambios de PersonalizarPage solo quedan en memoria) — lo implementa FE Dev 2

### Issues resueltos en esta sesion
- ContactForm ya envia al backend via `api.post('/consultas', data)` — resuelto
- Secciones publicas ahora reflejan colores/tipografia de siteConfig — resuelto via `useThemeStyles` + CSS variables
- Acceso por URL directa a secciones desactivadas redirige a `/` — resuelto via SectionGuard

## Responsive — Fix completo (contenedores + grids + tipografia)

**En este modulo:**
- Contenedores: `NoticiasPage`, `ContactoPage`, `EstudiantesPage` → `max-w-content`
- Grids: `NoticiasPage` layout (xl:4), `EstudiantesPage` cards (xl:5 3xl:6), `QuickLinks` (xl:4)
- Tipografia: paginas H1 → `text-h1`

---

### Imagenes de fondo en portadas

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `src/pages/public/CarrerasPage/CarrerasPage.jsx` | Import de `carrera1.png` como fondo del header con overlay oscuro |
| `src/pages/public/NoticiasPage/NoticiasPage.jsx` | Import de `noticia1.png` como fondo del header + thumbnail de cards |
| `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | Import de `estudiantes1.png` como fondo del header |
| `src/pages/public/ContactoPage/ContactoPage.jsx` | Import de `contac.png` como fondo del header |

**Detalles tecnicos:**
- Imagenes usadas: `assets/fonts/{carrera1, noticia1, estudiantes1, contac}.png`
- Overlay: `bg-slate-900/50` sobre el contenedor del texto para legibilidad
- Breakpoints: `py-12 md:py-16`, mismo padding que el diseno original
- Cards de Noticias: thumbnail con `object-cover` en contenedor de 140px

---

### Conexiones FE -> API — Estado

**Stores conectados al API real (sin mock):**

| Store | Endpoint | Publico | Fallback |
|-------|----------|---------|----------|
| `carrerasStore` | `GET /api/carreras` | SI | Ninguno |
| `noticiasStore` | `GET /api/noticias` | SI | Ninguno |
| `siteConfigStore` | `GET /api/config` | SI | DEFAULT_CONFIG hardcodeado |
| `galeriaStore` | `GET /api/imagenes` | SI | Ninguno |
| `testimoniosStore` | `GET /api/testimonios` | **NO (requiere auth)** | Ninguno |
| `eventosStore` | `GET /api/eventos` | **NO (requiere auth)** | Ninguno |

**Stores que usan mock:**

| Store | Datos | Motivo |
|-------|-------|--------|
| Stats | `MOCK_STATS` en HomePage | No hay endpoint publico de stats |
| Noticias (fallback) | `MOCK_NOTICIAS` en HomePage | Solo si el API devuelve array vacio |

**Bugs de backend que bloquean datos publicos:**

1. **Eventos** — `App/backend/src/routes/evento.routes.js:9`: `router.use(authenticate)` esta antes del GET. Moverlo despues de los GETs.
2. **Testimonios** — `App/backend/src/routes/testimonio.routes.js:9`: mismo problema.

**Modificaciones realizadas (2 Junio 2026):**
- `galeriaStore.ts`: eliminado `GALERIA_MOCK`, llama a `api.get('/imagenes')`
- `GaleriaCarousel.jsx`: usa `useGaleriaStore` en vez de `GALERIA_MOCK`
- `testimoniosStore.ts`: eliminado `TESTIMONIOS_MOCK`, llama a `api.get('/testimonios')`
- `HomePage.jsx`: usa `useTestimoniosStore`, `MOCK_TESTIMONIOS` eliminado
- `horariosService.js` (nuevo): `GET /api/horarios` con filtro por materia_id
- `CarreraDetailPage.jsx`: pestana Horarios fetchea horarios via API
- `EstudiantesPage.jsx`: selects dinamicos de carrera + comision con fetch de horarios
- `carrerasService.js`: bugfix URL de `getBySlug` (faltaba `/slug/`)
- `CarrerasPage.jsx`: grid 2 columnas, icono academico SVG, cards compactas
- `CarreraDetailPage.jsx`: requisitos fijos hardcodeados con checkmark
- `EventosPage.jsx` (nuevo): pagina `/eventos` centrada con busqueda y paginacion
- `NoticiasPage.jsx`: filtro de categoria "Evento" eliminado de las pills

Ver detalle completo en `PR-FE1Module1.md`

---

## Footer — datos dinamicos desde siteConfig (3 Junio 2026)

**Motivo:** El Footer mostraba "Enlaces Rapidos" hardcodeados (Carreras, Noticias, Estudiantes, Administracion) y no cargaba datos reales de configuracion del sitio al navegar directo a una pagina (sin pasar por Home).

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Eliminada seccion "Enlaces Rapidos" con links estaticos |
| `Footer.jsx` | Agregado `useEffect(() => fetchConfig(), [fetchConfig])` para cargar datos reales del backend |
| `Footer.jsx` | Agregada seccion "Redes Sociales" con Instagram/Facebook desde `config.socialLinks` |
| `Footer.jsx` | Fallback "Sin redes configuradas" cuando no hay URLs configuradas |
| `Footer.jsx` | Grid mantiene 3 columnas (Nombre + Contacto + Redes) |

**Detalles tecnicos:**
- `fetchConfig()` en el Footer asegura que los datos (siteName, contactEmail, redes sociales, etc.) se carguen incluso si el usuario ingresa por URL directa a cualquier pagina publica
- Las redes sociales se renderizan condicionalmente: solo aparecen si tienen URL configurada en el admin (Ajustes Generales)
- Sin dependencia de backend ni admin — solo cambios de frontend

## Pendiente actualizado (3 Junio 2026)

### Tests faltantes
| Archivo | Prioridad |
|---------|-----------|
| `tests/pages/NoticiasPage.test.jsx` | Alta |
| `tests/pages/NoticiaDetailPage.test.jsx` | Alta |
| `tests/pages/EstudiantesPage.test.jsx` | Media |
| `tests/components/Footer.test.jsx` | Media — verificar render condicional de redes sociales y llamado a fetchConfig |

### Issues de implementacion
- QuickLinks usa href="#" — todos los enlaces son placeholders sin destino real
- adaptNoticia() duplicado en NoticiasPage.jsx y NoticiaDetailPage.jsx — extraer a util compartida
- mockNoticias.categoria es string pero NewsSidebar espera objeto {nombre} — puede causar undefined en keys
- Eventos y Testimonios no muestran datos reales por bug de auth en BE (evento.routes.js:9, testimonio.routes.js:9)
- Falta saveConfig() en siteConfigStore (cambios de AjustesPage y PersonalizarPage solo quedan en memoria) — lo implementa FE Dev 2
- **`siteConfigStore.fetchConfig()` linea 141 hardcodea `socialLinks: DEFAULT_CONFIG.socialLinks`** — nunca carga Instagram/Facebook desde el backend. Aunque el admin configure redes sociales, al recargar la pagina el Footer mostrara los defaults. Requiere que `fetchConfig()` mapee `data.social_links?.instagram` y `data.social_links?.facebook` desde la respuesta del backend.
