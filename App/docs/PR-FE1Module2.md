# FE Modulo 2 - Inicio y Carreras Publicas

## Resumen de cambios

Se implementa la HomePage completa y las paginas de Carreras (listado + detalle con tabs).

### HomePage
5 secciones: Hero, Stats, CareerCards, NewsSection, TestimonialsCarousel (con auto-play cada 5s).

### CarrerasPage (listado)
- Header con gradient, breadcrumb (Inicio / Carreras)
- Filtros por nombre de carrera (botones tipo pill)
- Listado de tarjetas con icono, badge duracion, modalidad, nombre, descripcion, link al detalle

### CarreraDetailPage
- Breadcrumb (Inicio / Carreras / Desarrollo de Software)
- Header con nombre y titulo oficial
- 4 tabs: Descripcion, Materias, Requisitos, Horarios
  - Descripcion: texto largo + info cards (duracion, modalidad, titulo)
  - Materias: agrupadas por cuatrimestre con border-left color
  - Requisitos: lista con bullet points
  - Horarios: tabla con HorariosTable component
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
| `src/pages/public/HomePage/HomePage.jsx` | Modificado | Reemplazado placeholder por 5 secciones |
| `src/pages/public/CarrerasPage/CarrerasPage.jsx` | Modificado | Listado completo con filtros |
| `src/pages/public/CarrerasPage/CarreraDetailPage.jsx` | Nuevo | Detalle con 4 tabs + sidebar |
| `src/AppRouter.jsx` | Modificado | Ruta /carreras/:slug agregada |

### Tests
| Archivo | Tests |
|---------|-------|
| `src/tests/components/Hero.test.jsx` | 3 tests (render, CTA, links) |
| `src/tests/components/StatItem.test.jsx` | 1 test (valor + label) |
| `src/tests/components/Stats.test.jsx` | 3 tests (items, empty, null) |
| `src/tests/components/CareerCard.test.jsx` | 3 tests (datos, icono, link) |
| `src/tests/components/CareerCards.test.jsx` | 3 tests (titulo, items, empty) |
| `src/tests/components/NewsCard.test.jsx` | 2 tests (datos, link) |
| `src/tests/components/NewsSection.test.jsx` | 3 tests (titulo, 3 noticias, empty) |
| `src/tests/components/TestimonialSlide.test.jsx` | 2 tests (texto, avatar) |
| `src/tests/components/TestimonialsCarousel.test.jsx` | 4 tests (titulo, 1er slide, empty, controles) |
| `src/tests/components/HorariosTable.test.jsx` | 3 tests (headers, filas, empty) |
| `src/tests/pages/HomePage.test.jsx` | 1 test (5 secciones renderizan) |
| `src/tests/pages/CarrerasPage.test.jsx` | 3 tests (h1, filtro, 3 carreras) |
| `src/tests/pages/CarreraDetailPage.test.jsx` | 4 tests (h1, tabs, sidebar, 404) |
