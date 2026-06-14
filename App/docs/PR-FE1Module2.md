# Pull Request - Modulo 2: Inicio y Carreras Publicas

**Autor:** Lucas (FE Dev 1)
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, Axios

---

## Resumen

Implementacion de la HomePage con 8 secciones modulares (Hero, Stats, CareerCards, NewsSection, TestimonialsCarousel), mas paginas de Carreras publicas con listado filtrable, detalle con 4 tabs (descripcion, plan de estudios, requisitos, horarios) y tabla de horarios agrupada por comision. Datos mock para independencia total del backend.

---

## Archivos Creados

| Archivo | Proposito |
|---------|-----------|
| `src/components/public/Hero/Hero.jsx` | Banner con gradient, titulo, 2 CTA |
| `src/components/public/Stats/Stats.jsx` | Grid de estadisticas |
| `src/components/public/Stats/StatItem.jsx` | Item individual de estadistica |
| `src/components/public/CareerCards/CareerCards.jsx` | Grid de tarjetas de carreras |
| `src/components/public/CareerCards/CareerCard.jsx` | Tarjeta individual con badge y link |
| `src/components/public/NewsSection/NewsSection.jsx` | Ultimas 3 noticias + link |
| `src/components/public/NewsSection/NewsCard.jsx` | Tarjeta de noticia |
| `src/components/public/TestimonialsCarousel/TestimonialsCarousel.jsx` | Carrusel con auto-play 5s |
| `src/components/public/TestimonialsCarousel/TestimonialSlide.jsx` | Slide con comilla y avatar |
| `src/components/public/HorariosTable/HorariosTable.jsx` | Tabla de horarios |
| `src/data/mockTestimonios.js` | 4 testimonios mock |
| `src/data/mockStats.js` | 4 estadisticas mock |

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/pages/public/HomePage/HomePage.jsx` | Reemplazado placeholder por 8 secciones |
| `src/pages/public/CarrerasPage/CarrerasPage.jsx` | Listado completo con filtros |
| `src/pages/public/CarrerasPage/CarreraDetailPage.jsx` | 4 tabs + horarios con comisiones |
| `src/data/mockCarreras.js` | Agregados materias, horarios, requisitos |
| `src/AppRouter.jsx` | Ruta /carreras/:slug agregada |

---

## Detalles Tecnicos

- **HomePage:** 8 secciones modulares (Hero, Stats, CareerCards, NewsSection, TestimonialsCarousel, etc.)
- **Datos mock:** Archivos separados en `data/` para total independencia del backend (carreras, testimonios, stats)
- **CarreraDetailPage:** 4 tabs navegables (descripcion, plan de estudios, requisitos, horarios)
- **HorariosTable:** Agrupacion por comision con filtro de cuatrimestre y hora formateada
- **TestimonialsCarousel:** Auto-play cada 5s con transiciones CSS, pausa al hacer hover
- **CareerCard:** Color de fondo dinamico desde `carrera.color`, badge de modalidad (presencial/virtual)

---

## Tests

| Archivo | Tests |
|---------|-------|
| `src/tests/components/Hero.test.jsx` | 3 tests |
| `src/tests/components/StatItem.test.jsx` | 1 test |
| `src/tests/components/Stats.test.jsx` | 3 tests |
| `src/tests/components/CareerCard.test.jsx` | 2 tests |
| `src/tests/components/CareerCards.test.jsx` | 3 tests |
| `src/tests/components/NewsCard.test.jsx` | 2 tests |
| `src/tests/components/NewsSection.test.jsx` | 3 tests |
| `src/tests/components/TestimonialSlide.test.jsx` | 2 tests |
| `src/tests/components/TestimonialsCarousel.test.jsx` | 4 tests |
| `src/tests/components/HorariosTable.test.jsx` | 3 tests |
| `src/tests/pages/HomePage.test.jsx` | 1 test |
| `src/tests/pages/CarrerasPage.test.jsx` | 3 tests |
| `src/tests/pages/CarreraDetailPage.test.jsx` | 4 tests |
