# FE Modulo 1 - Fundacion y Autenticacion

## Resumen de cambios

Se implementa la capa base del frontend: sistema de diseno UI completo, capa de servicios API con axios, contextos globales, stores de estado (Zustand), layout publico con Navbar/Footer, y correccion del login flow.

**Cambios principales:**
- Capa de servicios API con axios e interceptores (token JWT, 401 redirect)
- Stores Zustand: authStore (user, token, login/logout), uiStore (theme, sidebar, toasts)
- AuthContext integrado con API real + mock fallback (admin@ifts29.edu.ar / admin1234)
- ThemeContext con persistencia en localStorage y soporte dark mode
- LayoutContext (sidebar toggle) y ToastContext (notificaciones)
- Sistema de diseno UI: 13 componentes (Button, Input, Select, Textarea, Card, Badge, Modal, Table, Pagination, Toggle, Toast, Skeleton, EmptyState)
- PublicLayout con Navbar (links responsive, mobile menu) y Footer (3 columnas)
- Corregido LoginPage para redirigir al dashboard tras login exitoso
- Corregidos imports relativos con `../../../` en pages/ y ProtectedRoute

## Archivos

### Nuevos
| Archivo | Descripcion |
|---------|-------------|
| `src/services/api.js` | Axios instance con interceptors |
| `src/stores/authStore.js` | Zustand store de autenticacion |
| `src/stores/uiStore.js` | Zustand store de UI global |
| `src/contexts/ThemeContext/ThemeContext.jsx` | Provider de tema (claro/oscuro) |
| `src/contexts/LayoutContext/LayoutContext.jsx` | Provider de layout (sidebar) |
| `src/contexts/ToastContext/ToastContext.jsx` | Provider de toasts |
| `src/components/ui/Button/Button.jsx` | 5 variantes, 3 tamanos, loading |
| `src/components/ui/Input/Input.jsx` | Label, error, disabled |
| `src/components/ui/Select/Select.jsx` | Options array, placeholder |
| `src/components/ui/Textarea/Textarea.jsx` | resize-vertical |
| `src/components/ui/Card/Card.jsx` | padding toggle, hover shadow |
| `src/components/ui/Badge/Badge.jsx` | 6 colores |
| `src/components/ui/Modal/Modal.jsx` | Escape/click-outside close, 4 sizes |
| `src/components/ui/Table/Table.jsx` | Columnas, render, empty state |
| `src/components/ui/Pagination/Pagination.jsx` | Numeros, anterior/siguiente |
| `src/components/ui/Toggle/Toggle.jsx` | Switch, label, aria |
| `src/components/ui/Toast/Toast.jsx` | 4 tipos, auto-close |
| `src/components/ui/Skeleton/Skeleton.jsx` | 6 variantes con animate-pulse |
| `src/components/ui/EmptyState/EmptyState.jsx` | Icono, titulo, accion |
| `src/components/layout/PublicLayout/PublicLayout.jsx` | Layout publico (Navbar + Outlet + Footer) |
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Navbar responsive |
| `src/components/layout/PublicLayout/Navbar/MobileMenu.jsx` | Menu mobile overlay |
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Footer 3 columnas |

### Modificados
| Archivo | Descripcion |
|---------|-------------|
| `src/contexts/AuthContext/AuthContext.jsx` | Integrado con API, mock fallback, localStorage |
| `src/App.jsx` | Agregados ThemeProvider, LayoutProvider, ToastProvider |
| `src/AppRouter.jsx` | PublicLayout wrapper, import default ProtectedRoute |
| `src/pages/admin/LoginPage/LoginPage.jsx` | handleSubmit corregido para usar login(email, password) |
| `src/pages/public/NoticiasPage/NoticiasPage.jsx` | Import path corregido |
| `src/pages/public/NoticiaDetailPage/NoticiaDetailPage.jsx` | Import path corregido |
| `src/components/ProtectedRoute.jsx` | Ahora renderiza AdminLayout |
| `src/components/layout/AdminLayout/AdminLayout.jsx` | Layout admin con sidebar + topbar + outlet |
| `src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx` | Sidebar con 4 secciones y navegacion |
| `src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx` | Topbar con titulo, breadcrumbs, avatar, logout |
| `src/components/layout/AdminLayout/AdminBreadcrumbs/AdminBreadcrumbs.jsx` | Breadcrumb basado en ruta activa |

### Errores corregidos
- Rutas relativas `../../` incorrectas desde `pages/*/XPage/` (necesitan `../../../`)
- ProtectedRoute importado con `{ }` pero exportado como `default`
- LoginPage pasaba objeto `{ email, role }` en vez de `(email, password)` al AuthContext

## Pendiente

### Tests faltantes
| Archivo | Prioridad |
|---------|-----------|
| `tests/stores/authStore.test.js` | Alta — store crítico sin cobertura |
| `tests/components/Select.test.jsx` | Media |
| `tests/components/Textarea.test.jsx` | Media |
| `tests/components/layout/Navbar.test.jsx` | Media |
| `tests/components/layout/MobileMenu.test.jsx` | Baja |
| `tests/components/layout/Footer.test.jsx` | Baja |
| `tests/components/layout/PublicLayout.test.jsx` | Media |
| `tests/pages/admin/LoginPage.test.jsx` | Alta |
| `tests/components/layout/AdminLayout.test.jsx` | Media |
| `tests/components/layout/AdminSidebar.test.jsx` | Media |

### Issues
- AGENTS.md línea 56 dice que ThemeContext/LayoutContext/ToastContext están vacíos — ya están implementados, actualizar doc

## Responsive — Fix completo (contenedores + grids + tipografía)

**Problema:** Al alejar zoom, el contenido se "achicaba" porque todo usaba `max-w-6xl` (1152px) fijo, generando márgenes enormes en viewports efectivos grandes. Además, los grids no expandían columnas ni la tipografía escalaba.

### Cambios realizados

**1. `globals.css`** — `@theme` con:
- `--breakpoint-3xl: 1920px` (nuevo breakpoint ultra-wide)
- `--width-content: 90rem` (contenedor de 1440px)
- `--text-h1`, `--text-h2`, `--text-hero` con `clamp()` para tipografía fluida

**2. Contenedores** — 19 replaces de `max-w-6xl` → `max-w-content` en 12 archivos públicos

**3. Grids responsivos** — variantes `xl:` y `3xl:` agregadas:
- `Stats`: `xl:grid-cols-6`
- `CareerCards`, `NewsSection`, `Footer`: `xl:grid-cols-4`
- `NoticiasPage`, `CarreraDetailPage` (layout): `xl:grid-cols-4`
- `CarreraDetailPage` (materias): `xl:grid-cols-3`
- `EstudiantesPage` (cards): `xl:grid-cols-5 3xl:grid-cols-6`
- `QuickLinks`: `xl:grid-cols-4`

**4. Tipografía fluida** — headings reemplazados por clases fluidas:
- `text-h1` (clamp 1.875rem–3rem): pages H1
- `text-h2` (clamp 1.5rem–2.25rem): secciones H2
- `text-hero` (clamp 2rem–3.5rem): Hero H1

**Archivos tocados:** `globals.css` + 16 archivos .jsx públicos

**Admin no se modificó.**

## Como usar

```jsx
import Button from '../../components/ui/Button/Button';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { useTheme } from '../../contexts/ThemeContext/ThemeContext';

function MiComponente() {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return <Button onClick={toggleTheme}>Cambiar tema</Button>;
}
```
