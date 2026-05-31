# Pull Request - Modulo 7: Control de Acceso por Roles (Admin)

**Autor:** Lucas (FE Dev)
**Rama:** `fix/roles-varios`
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, React Router 7

---

## Resumen

Implementacion de control de acceso basado en roles (RBAC) en el panel de administracion. Hasta ahora, cualquier usuario autenticado podia acceder a todas las secciones del admin, sin importar su rol (`admin`, `profesor`, `tutor`). Se agrego proteccion por ruta, filtrado del sidebar segun permisos, creacion de pagina 403, y correccion del campo `role` -> `rol` para alinear el mock de login con la API real.

---

## Modificaciones por Archivo

| Archivo | Cambio |
|---------|--------|
| `src/contexts/AuthContext/AuthContext.jsx` | Mock: `role: 'admin'` -> `rol: 'admin'` para coincidir con el backend (`auth.services.js` devuelve `rol`) |
| `src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx` | `user?.role` -> `user?.rol` en la etiqueta del rol del usuario logueado |
| `src/pages/admin/ForbiddenPage/ForbiddenPage.jsx` | **NUEVO** - Pagina 403 con mensaje "No tenes permisos suficientes", muestra el rol actual del usuario y link para volver al dashboard |
| `src/components/ProtectedRoute.jsx` | Agregado prop `allowedRoles` (array de strings). Si se pasa y `user.rol` no esta incluido, redirige a 403 (con children) o al dashboard (sin children). Si `allowedRoles` no se pasa, funciona como antes (solo auth) |
| `src/AppRouter.jsx` | Cada ruta admin ahora envuelve su pagina con `<ProtectedRoute allowedRoles={...}>`. Mapa de acceso: dashboard/noticias/carreras/eventos -> `['admin','profesor','tutor']`, galeria -> `['admin','profesor']`, testimonios/usuarios/personalizar/ajustes/consultas -> `['admin']` |
| `src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx` | Agregado `useAuth` + mapa `roleAccess` por rol. Filtra `sections.items` contra las rutas permitidas segun `user.rol`, y oculta secciones vacias |

---

## Detalles Tecnicos

- **roleAccess map** en AdminSidebar:
  - `admin`: dashboard, noticias, carreras, eventos, galeria, testimonios, consultas, usuarios, personalizar, ajustes
  - `profesor`: dashboard, noticias, carreras, eventos, galeria
  - `tutor`: dashboard, noticias, carreras, eventos
- **Fallback seguro:** Si `user.rol` no coincide con ninguna clave del mapa (ej. mock antiguo con `role`), se usa `roleAccess.admin` como default
- **ProtectedRoute** ahora acepta dos modos:
  1. Sin `children`: renderiza `<AdminLayout />` (modo layout anidado, usado en ruta padre `/admin`)
  2. Con `children`: renderiza el children solo si pasa el chequeo de roles (modo wrappeador por pagina)
- **ForbiddenPage** es autocontenida y no necesita estar dentro de AdminLayout, ideal para redirecciones desde rutas hijas
- El orden de las rutas en AppRouter no cambio; la navegacion dentro de `/admin` sigue funcionando igual

---

## Notas

- La API real del backend (`auth.services.js`) siempre devolvio `rol` en el payload JWT y en la respuesta de login. El mock estaba desactualizado con `role`.
- Las rutas sin `allowedRoles` en ProtectedRoute seguira permitiendo acceso a cualquier usuario autenticado (ej. para uso futuro).
- No se modificaron las paginas publicas ni el layout publico.
