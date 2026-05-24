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
