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
| `src/pages/public/ContactoPage/ContactForm.jsx` | Nuevo |
| `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | Modificado |
| `src/pages/public/EstudiantesPage/QuickLinks.jsx` | Nuevo |
| `src/AppRouter.jsx` | Modificado |
| `src/services/noticiasService.js` | Nuevo |
| `src/stores/noticiasStore.ts` | Modificado |
| `src/tests/components/NewsSidebar.test.jsx` | Nuevo |
| `src/tests/components/ContactForm.test.jsx` | Nuevo |
| `src/tests/components/QuickLinks.test.jsx` | Nuevo |

## Tests

| Archivo | Tests |
|---------|-------|
| `tests/components/NewsSidebar.test.jsx` | 7 tests (categorías, destacadas, selección, navegación) |
| `tests/components/ContactForm.test.jsx` | 3 tests esenciales (submit, validación, loading) |
| `tests/components/QuickLinks.test.jsx` | 2 tests esenciales (render 6 links, empty) |

## Integración con Store

Las páginas públicas (`NoticiasPage`, `NoticiaDetailPage`) se conectan al store y usan un adaptador (`adaptNoticia`) que transforma el formato API (con `categoria.nombre`, `autor.nombre + apellido`, `fecha_publicacion` ISO) al formato mock que la UI espera. Si el store no tiene datos (API caído o vacío), caen a MOCK_NOTICIAS como fallback.
