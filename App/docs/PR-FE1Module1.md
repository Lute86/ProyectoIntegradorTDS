# Pull Request - Modulo 1: Fundacion y Autenticacion

**Autor:** Lucas (FE Dev 1)
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, Axios

---

## Resumen

Implementacion de la capa base del frontend: sistema de diseno UI con 12 componentes reutilizables, servicios API con axios e interceptors JWT, 3 contextos globales (Theme, Layout, Toast), stores Zustand con persistencia (authStore, uiStore), PublicLayout completo (Navbar responsive + MobileMenu + Footer) y AdminLayout (Sidebar colapsable + Topbar con breadcrumbs).

---

## Archivos Creados

| Archivo | Proposito |
|---------|-----------|
| `src/services/api.js` | Axios con interceptors JWT y 401 redirect |
| `src/stores/authStore.js` | Store de autenticacion |
| `src/stores/uiStore.js` | Store de UI global (theme, sidebar, toasts) |
| `src/contexts/ThemeContext/ThemeContext.jsx` | Provider de tema claro/oscuro |
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
| `src/components/layout/PublicLayout/PublicLayout.jsx` | Layout publico |
| `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | Navbar responsive |
| `src/components/layout/PublicLayout/Navbar/MobileMenu.jsx` | Menu mobile overlay |
| `src/components/layout/PublicLayout/Footer/Footer.jsx` | Footer 3 columnas |

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/App.jsx` | Agregados ThemeProvider, LayoutProvider, ToastProvider |
| `src/AppRouter.jsx` | PublicLayout wrapper, import default ProtectedRoute |
| `src/pages/admin/LoginPage/LoginPage.jsx` | Fix handleSubmit para usar login(email, password) |
| `src/components/ProtectedRoute.jsx` | Renderiza AdminLayout |
| `src/components/layout/AdminLayout/AdminLayout.jsx` | Layout admin con sidebar + topbar + outlet |
| `src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx` | Sidebar con 4 secciones |
| `src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx` | Topbar con breadcrumbs, avatar, logout |
| `src/components/layout/AdminLayout/AdminBreadcrumbs/AdminBreadcrumbs.jsx` | Breadcrumb basado en ruta activa |

---

## Detalles Tecnicos

- **Axios interceptor:** Adjunta JWT en headers, redirect a `/login` en 401
- **3 contextos globales:** ThemeContext (claro/oscuro con localStorage), LayoutContext (sidebar colapsable), ToastContext (notificaciones con auto-close)
- **2 stores Zustand:** authStore con persistencia localStorage (login, logout, refresh token), uiStore (theme, sidebar, toasts)
- **Sistema de diseno:** 12 componentes UI reutilizables con variantes (Button: 5 variantes, Modal: 4 tamanos, Badge: 6 colores)
- **PublicLayout:** Navbar responsive con dropdown + MobileMenu overlay + Footer 3 columnas
- **AdminLayout:** Sidebar colapsable con 4 secciones, Topbar con breadcrumbs dinamicos

---

## Errores Corregidos

- Rutas relativas desde `pages/*/XPage/` necesitan `../../../` para llegar a `src/`
- ProtectedRoute importado con `{ }` pero exportado como `default`
- LoginPage pasaba objeto en vez de `(email, password)`
