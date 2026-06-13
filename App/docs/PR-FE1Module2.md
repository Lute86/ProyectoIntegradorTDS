# FE Modulo 2 - Inicio y Carreras Publicas

## Resumen de cambios

Se implementa la HomePage completa y las paginas de Carreras (listado + detalle con tabs).

### HomePage
8 secciones configurables: Hero, Stats, CareerCards, NewsSection, EventosSection, TestimonialsCarousel, GaleriaCarousel.
- `EventosSection`: carrusel de hasta 6 eventos (3 visibles en desktop), auto-advance cada 6s, siempre visible (si no hay eventos, muestra mensaje "No hay eventos proximos por ahora").
- `EventosSection` pasada a recibir `eventos` desde `useEventosStore()` via HomePage.

### CarrerasPage (listado)
- Header con gradient, breadcrumb (Inicio / Carreras)
- Filtros por nombre de carrera (botones tipo pill)
- Listado de tarjetas con badge duracion, modalidad, nombre, descripcion, link al detalle

### CarreraDetailPage
- Breadcrumb (Inicio / Carreras / Desarrollo de Software)
- Header con nombre y titulo oficial
- 4 tabs: Descripcion, Materias, Requisitos, Horarios
  - Descripcion: texto largo + info cards (duracion, modalidad, titulo)
  - Materias: agrupadas por cuatrimestre con border-left color
  - Requisitos: lista con bullet points
  - Horarios: tabla inline con boton "Todas" + comisiones individuales (A, B, C...), columna "Comision" visible solo en modo "Todas"
  - Filtro por cuatrimestre en pestaña Horarios (tabs: "Todos los cuatrimestres", "1°", "2°"...)
- Sidebar: otras carreras + card de contacto
- 404 handling si el slug no existe

## Archivos

### Nuevos / Modificados
| Archivo | Tipo | Descripcion |
|---------|------|-------------|
| `src/data/mockCarreras.js` | Modificado | Agregados materias, horarios, requisitos, descripcion larga, informacion |
| `src/data/mockTestimonios.js` | Nuevo | 4 testimonios mock |
| `src/data/mockStats.js` | Nuevo | 4 estadisticas mock |
| `src/components/public/Hero/Hero.jsx` | Nuevo | Banner con gradient, titulo, 2 CTA |
| `src/components/public/Stats/Stats.jsx` | Nuevo | Grid de estadisticas |
| `src/components/public/Stats/StatItem.jsx` | Nuevo | Item individual de estadistica |
| `src/components/public/CareerCards/CareerCards.jsx` | Nuevo | Grid de tarjetas de carreras |
| `src/components/public/CareerCards/CareerCard.jsx` | Nuevo | Tarjeta individual con badge + link |
| `src/components/public/NewsSection/NewsSection.jsx` | Nuevo | Ultimas 3 noticias + link "Ver todas" |
| `src/components/public/NewsSection/NewsCard.jsx` | Nuevo | Tarjeta de noticia con badge + fecha |
| `src/components/public/TestimonialsCarousel/TestimonialsCarousel.jsx` | Nuevo | Carrusel con auto-play 5s, dots, controles |
| `src/components/public/TestimonialsCarousel/TestimonialSlide.jsx` | Nuevo | Slide con comilla, avatar, nombre |
| `src/components/public/HorariosTable/HorariosTable.jsx` | Nuevo | Tabla de horarios con thead/tbody |
| `src/pages/public/HomePage/HomePage.jsx` | Modificado | Reemplazado placeholder por 8 secciones configurables |
| `src/pages/public/CarrerasPage/CarrerasPage.jsx` | Modificado | Listado completo con filtros |
| `src/pages/public/CarrerasPage/CarreraDetailPage.jsx` | Modificado | Horarios: boton "Todas", filtro cuatrimestre, columna comision condicional |
| `src/components/public/EventosSection/EventosSection.jsx` | Modificado | Siempre visible aunque no haya eventos |
| `src/components/public/EventosSection/EventosCard.jsx` | Modificado | Adaptacion dual mock/API, "Ver detalle" abre modal |
| `src/AppRouter.jsx` | Modificado | Ruta /carreras/:slug agregada |

### Tests
| Archivo | Tests |
|---------|-------|
| `src/tests/components/Hero.test.jsx` | 3 tests (render, CTA, links) |
| `src/tests/components/StatItem.test.jsx` | 1 test (valor + label) |
| `src/tests/components/Stats.test.jsx` | 3 tests (items, empty, null) |
| `src/tests/components/CareerCard.test.jsx` | 2 tests (nombre en header, link) |
| `src/tests/components/CareerCards.test.jsx` | 3 tests (titulo, items, empty) |
| `src/tests/components/NewsCard.test.jsx` | 2 tests (datos, link) |
| `src/tests/components/NewsSection.test.jsx` | 3 tests (titulo, 3 noticias, empty) |
| `src/tests/components/TestimonialSlide.test.jsx` | 2 tests (texto, avatar) |
| `src/tests/components/TestimonialsCarousel.test.jsx` | 4 tests (titulo, 1er slide, empty, controles) |
| `src/tests/components/HorariosTable.test.jsx` | 3 tests (headers, filas, empty) |
| `src/tests/pages/HomePage.test.jsx` | 1 test (5 secciones renderizan) |
| `src/tests/pages/CarrerasPage.test.jsx` | 3 tests (h1, filtro, 3 carreras) |
| `src/tests/pages/CarreraDetailPage.test.jsx` | 4 tests (h1, tabs, sidebar, 404) |

### Horarios tab — mensajes condicionales

**Archivo:** `src/pages/public/CarrerasPage/CarreraDetailPage.jsx`

**Problema:** El subtitulo "Selecciona una comision y/o cuatrimestre para ver los horarios" se mostraba siempre, incluso cuando no habia comisiones disponibles para la carrera. Luego abajo aparecia "Sin horarios disponibles para esta carrera."

**Solucion:**
- Se elimino el subtitulo fijo.
- Cuando `comisiones.length > 0`: se muestra un info card (`bg-slate-50/80 border border-slate-200 rounded-xl p-5 text-center`) con el mensaje de seleccion, consistente con el diseno de la pagina.
- Cuando `comisiones.length === 0`: se muestra directamente "Sin horarios disponibles para esta carrera." sin mensaje previo.

---

## Pendiente

### Tests faltantes
| Archivo | Prioridad |
|---------|-----------|
| `tests/stores/carrerasStore.test.js` | Alta — store sin cobertura |

### Issues
- HomePage.test.jsx tiene solo 1 test smoke, sin cobertura de loading/error/estados vacios

---

## Post-Implementation Fixes (11 Jun 2026)

### Hero overlay
- `CarrerasPage.jsx`, `CarreraDetailPage.jsx`: `bg-surface/50` → `bg-black/40` para overlay neutro consistente con ContactoPage.

### CarreraDetailPage fondo
- `CarreraDetailPage.jsx`: `bg-slate-50` → `bg-site-bg` en render principal (loading y not-found ya estaban correctos).

### Home secciones fondo
- `CareerCarousel.jsx`: gradientes light mode reemplazados por `bg-site-bg` para respetar configuracion admin.

### Carruseles modo claro
- `CareerCarousel.jsx`, `NewsSection.jsx`, `TestimonialsCarousel.jsx`: botones nav `bg-white/10` → `bg-black/10`, dots `bg-white` → `bg-body` con `dark:bg-white` para visibilidad en modo claro.

### Layout boxed/full-width
- `CarrerasPage.jsx`, `CarreraDetailPage.jsx`: ahora leen `config.layout` y condicionan el wrapper (`max-w-[1280px] mx-auto` en boxed, `max-w-content` en full-width).

