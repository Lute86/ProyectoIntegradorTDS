# Pull Request - Modulo 3: Noticias, Contacto y Portal Estudiante

**Autor:** Lucas (FE Dev 1)
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, React Hook Form + Zod

---

## Resumen

Implementacion de paginas publicas de Noticias (busqueda, filtro por categoria, paginacion), Contacto (formulario RHF+Zod con validacion en espanol), Eventos (busqueda, paginacion, modal detalle) y Portal del Estudiante (horarios por cuatrimestre y comision, QuickLinks). Stores con TTL de 30s y fallback automatico a mock si la API no responde. SectionGuard para ocultar/mostrar secciones segun configuracion del sitio. Colores dinamicos en Navbar/Footer desde siteConfig.

---

## Archivos Creados

| Archivo | Proposito |
|---------|-----------|
| `src/data/mockNoticias.js` | Datos mock de noticias |
| `src/pages/public/NoticiasPage/NewsSidebar.jsx` | Sidebar categorias + destacadas |
| `src/pages/public/ContactoPage/ContactForm.jsx` | Formulario con RHF+Zod |
| `src/pages/public/EstudiantesPage/QuickLinks.jsx` | Grilla enlaces utiles |
| `src/services/noticiasService.js` | Capa de servicio noticias |
| `src/services/horariosService.js` | Service horarios |
| `src/services/eventosService.js` | Service eventos con fallback mock |
| `src/components/public/EventoDetailModal/EventoDetailModal.jsx` | Modal flotante info evento |
| `src/components/SectionGuard.jsx` | Guard para secciones configurables |
| `src/hooks/useThemeStyles.js` | Hook estilos desde siteConfig |

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/pages/public/NoticiasPage/NoticiasPage.jsx` | Busqueda, filtro categorias, paginacion |
| `src/pages/public/NoticiaDetailPage/NoticiaDetailPage.jsx` | Detalle noticia con breadcrumb |
| `src/pages/public/ContactoPage/ContactoPage.jsx` | Formulario + info cards |
| `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | Horarios con comisiones y cuatrimestre |
| `src/pages/public/EventosPage/EventosPage.jsx` | Busqueda, paginacion, modal detalle |
| `src/pages/public/HomePage/HomePage.jsx` | EventosSection conectada |
| `src/stores/noticiasStore.ts` | TTL 30s, fetchNoticiaBySlug |
| `src/AppRouter.jsx` | Rutas /noticias/:slug, /eventos |
| `src/components/layout/PublicLayout/PublicLayout.jsx` | useThemeStyles |
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Colores dinamicos |
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Redes sociales desde siteConfig |

---

## Detalles Tecnicos

- **noticiasStore:** TTL de 30 segundos, fetch con fallback a `mockNoticias` si la API falla
- **SectionGuard:** Oculta/muestra secciones segun `siteConfig.sections`, evita render condicional disperso
- **ContactForm:** React Hook Form + Zod con validacion en espanol y feedback visual de envio
- **NewsSidebar:** Categorias desde la store + noticias destacadas con imagen y fecha
- **eventosService:** Fallback automatico a mock si el endpoint `GET /api/eventos` no responde
- **Colores dinamicos:** Navbar y Footer usan `useThemeStyles` que lee `siteConfig.colors` para fondo, texto y acentos
- **EstudiantesPage:** Horarios filtrados por cuatrimestre y comision, con grilla de QuickLinks
