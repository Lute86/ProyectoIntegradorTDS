# FE Módulo 3 - Noticias, Contacto y Portal Estudiante

## Resumen de cambios

- `NoticiasPage`: listado con búsqueda en tiempo real, filtro por categorías, paginación (4/pág), sidebar con categorías y destacadas
- `NoticiaDetailPage`: breadcrumb, header con badge/gradiente, imagen placeholder, contenido, volver a noticias
- `src/data/mockNoticias.js`: datos mock compartidos (7 noticias) + BADGE_COLORS
- `NewsSidebar`: componente sidebar con categorías (contador) y noticias destacadas (colocalizado en NoticiasPage/)
- `ContactoPage`: página completa con formulario de contacto (RHF+Zod) e info cards laterales
- `ContactForm`: formulario colocalizado en ContactoPage/ con validación RHF+Zod
- `EstudiantesPage`: portal del estudiante con cards de acceso rápido, tabla de horarios, enlaces útiles
  - Horarios: opcion "Todas las comisiones" en dropdown, filtro por cuatrimestre, columna "Comision" visible solo en modo "Todas"
- `QuickLinks`: grilla de enlaces colocalizada en EstudiantesPage/
- `noticiasStore.ts`: TTL 30s (`_lastFetched`), `fetchNoticiaBySlug`, `fetchCategorias`, `selectedNoticia`, `setSelectedNoticia`, usa `noticiasService`
- `noticiasService.js`: capa de servicio (getAll, getBySlug, getCategories, create, update, remove)
- `NoticiasPage` conectada al store con fallback a MOCK_NOTICIAS
- `NoticiaDetailPage` conectada al store con fallback a MOCK_NOTICIAS + loading skeleton
- `EventosPage`: listado con busqueda, paginacion (5/pag), campos adaptados dual mock/API, descripcion truncada a 2 lineas, card clickeable abre modal de detalle
- `EventoDetailModal`: nuevo componente modal flotante con overlay, muestra todos los datos del evento (nombre, fecha, hora, ubicacion, estado, modalidad, descripcion), cierra con ESC o click fuera
- Ruta `/noticias/:slug` en AppRouter.jsx
- Ruta `/eventos` en AppRouter.jsx con SectionGuard

## Archivos

| Archivo | Tipo | Descripcion |
|---------|------|-------------|
| `src/data/mockNoticias.js` | Nuevo | Datos mock de noticias |
| `src/pages/public/NoticiaDetailPage/NoticiaDetailPage.jsx` | Modificado | Pagina detalle noticia |
| `src/pages/public/NoticiasPage/NoticiasPage.jsx` | Modificado | Listado noticias con filtros |
| `src/pages/public/NoticiasPage/NewsSidebar.jsx` | Nuevo | Sidebar categorias + destacadas |
| `src/pages/public/ContactoPage/ContactoPage.jsx` | Modificado | Pagina contacto completa |
| `src/pages/public/ContactoPage/ContactForm.jsx` | Modificado | Formulario RHF+Zod |
| `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | Modificado | Horarios: "Todas las comisiones" + filtro cuatrimestre |
| `src/pages/public/EstudiantesPage/QuickLinks.jsx` | Nuevo | Grilla enlaces utiles |
| `src/pages/public/EventosPage/EventosPage.jsx` | Modificado | Campos adaptados dual mock/API, descripcion truncada, card clickeable abre modal |
| `src/components/public/EventoDetailModal/EventoDetailModal.jsx` | Nuevo | Modal flotante con info completa del evento |
| `src/AppRouter.jsx` | Modificado | Ruta /eventos agregada |
| `src/services/noticiasService.js` | Nuevo | Capa de servicio noticias |
| `src/stores/noticiasStore.ts` | Modificado | TTL 30s, fetchNoticiaBySlug |
| `src/tests/components/NewsSidebar.test.jsx` | Nuevo | 7 tests |
| `src/tests/components/ContactForm.test.jsx` | Nuevo | 3 tests |
| `src/tests/components/QuickLinks.test.jsx` | Nuevo | 2 tests |
| `src/components/SectionGuard.jsx` | Nuevo | Guard para secciones configurables |
| `src/hooks/useThemeStyles.js` | Nuevo | Hook de estilos de tema |
| `src/components/layout/PublicLayout/PublicLayout.jsx` | Modificado | Layout publico |
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Modificado | Navbar responsive |
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Modificado | Footer 3 columnas |
| `backend/src/middlewares/validators/siteconfig.validator.js` | Modificado | Validador config |

## Tests

| Archivo | Tests |
|---------|-------|
| `tests/components/NewsSidebar.test.jsx` | 7 tests (categorías, destacadas, selección, navegación) |
| `tests/components/ContactForm.test.jsx` | 3 tests esenciales (submit, validación, loading) |
| `tests/components/QuickLinks.test.jsx` | 2 tests esenciales (render 6 links, empty) |

## Integración con Store

Las páginas públicas (`NoticiasPage`, `NoticiaDetailPage`) se conectan al store y usan un adaptador (`adaptNoticia`) que transforma el formato API (con `categoria.nombre`, `autor.nombre + apellido`, `fecha_publicacion` ISO) al formato mock que la UI espera. Si el store no tiene datos (API caído o vacío), caen a MOCK_NOTICIAS como fallback.

## Extensiones

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
| `tests/components/Footer.test.jsx` | Media |

### Issues de implementacion
- QuickLinks usa href="#" — todos los enlaces son placeholders sin destino real
- adaptNoticia() duplicado en NoticiasPage.jsx y NoticiaDetailPage.jsx — extraer a util compartida
- mockNoticias.categoria es string pero NewsSidebar espera objeto {nombre} — puede causar undefined en keys
- Eventos y Testimonios no muestran datos reales por bug de auth en BE (evento.routes.js:9, testimonio.routes.js:9)
- Falta saveConfig() en siteConfigStore (cambios de AjustesPage y PersonalizarPage solo quedan en memoria) — lo implementa FE Dev 2
- `siteConfigStore.fetchConfig()` hardcodea `socialLinks: DEFAULT_CONFIG.socialLinks` — no carga Instagram/Facebook desde el backend

### Issues resueltos
- ContactForm ya envia al backend via `api.post('/consultas', data)` — resuelto
- Secciones publicas ahora reflejan colores/tipografia de siteConfig — resuelto via `useThemeStyles` + CSS variables
- Acceso por URL directa a secciones desactivadas redirige a `/` — resuelto via SectionGuard

### Footer dinamico

**Motivo:** El Footer mostraba "Enlaces Rapidos" hardcodeados y no cargaba datos reales de configuracion al navegar directo a una pagina.

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

---

### Fix guardado batch de horarios

**Archivo:** `src/pages/admin/CarrerasPage/CarreraDetailAdmin.jsx`

**Problemas:** `Promise.all` perdía datos en fallos parciales, notificación global lejos del botón, fail-fast cancelaba requests, useEffect reiniciaba el form tras fallos.

**Soluciones:** Guardado secuencial con `for...of`, contador guardados/fallidos, formSnapshot preserva datos fallidos, notificación local junto al botón, skipFormResetRef evita reinicio.

**Mensajes:** "X guardados correctamente", "Error al guardar", "X guardados, Y fallaron", "Completa al menos dia y horario".

**Tests:** `CarreraDetailAdmin.test.jsx` — 4 tests (render tabs, crear comision, create con datos, error parcial).

---

### Roles RBAC

**Archivos:** AuthContext, ProtectedRoute, AdminTopbar, AdminSidebar, AppRouter, ForbiddenPage (nuevo).

**Cambios:** Mock `role` -> `rol`, ProtectedRoute con `allowedRoles`, sidebar filtra por rol, pagina 403, mapa roleAccess por rol.

---

### Contacto API

**Archivos:** ContactoPage, ContactForm, tests.

**Cambios:** `setTimeout` mock -> `api.post('/consultas', data)`, estados error/success con feedback visual, throw en catch evita reset en fallo. Tests: api.post llamado, exito, error generico, error con mensaje, loading.

---

### Card de carreras — titulo en header

**CareerCard.jsx / CarrerasPage.jsx:** El icono/iniciales del header se reemplazaron por el nombre de la carrera con fondo de color. El titulo se eliminó del body de la card.

**Tests:** CareerCard.test.jsx eliminó test de iniciales, CarrerasPage.test.jsx cambió heading role por getByText.

---

### Icono de categoria en NoticiasPage

**NoticiasPage.jsx:** El placeholder `NOT` se reemplazó por `IconoCategoria` con el SVG de la categoria (inscripciones, examenes, etc.) en blanco.

---

### EstudiantesPage — filtros progresivos con animacion

**Archivo:** `src/pages/public/EstudiantesPage/EstudiantesPage.jsx`

**Problema:** Los 3 selects (Carrera, Comision, Cuatrimestre) se mostraban siempre, algunos deshabilitados, ocupando espacio aunque no tuvieran datos que mostrar.

**Solucion:**
- Los filtros de Comision y Cuatrimestre ahora aparecen progresivamente solo cuando tienen datos disponibles.
- El filtro **Comision** aparece con fade-in cuando hay una carrera seleccionada y esa carrera tiene comisiones.
- El filtro **Cuatrimestre** aparece con fade-in cuando hay una comision seleccionada y existen cuatrimestres.
- Los mensajes informativos se simplificaron: "Selecciona una carrera para comenzar", "No hay horarios disponibles para esta carrera", etc.
- Animacion: `animate-in fade-in duration-300` en cada filtro que aparece, usando `tailwindcss-animate` (mismo que usan los modales y admin pages).


