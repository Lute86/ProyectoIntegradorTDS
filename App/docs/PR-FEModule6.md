# Pull Request - Modulo 6: Gestion de Consultas (Admin)

**Autor:** Andres (FE Dev 2)
**Rama:** `feature/fe-modulo6-gestion-consultas`
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, Axios

---

## Resumen

Implementacion del panel de administracion de consultas recibidas desde el formulario de contacto del sitio publico. El backend ya estaba completamente desarrollado (Migraciones BE 8), por lo que la integracion fue directa via API real sin necesidad de mocks.

---

## Archivos Creados

| Archivo | Proposito |
|---------|-----------|
| `src/stores/consultasStore.ts` | Store Zustand con metodos fetchConsultas, fetchUnreadCount, responderConsulta, eliminarConsulta |
| `src/pages/admin/ConsultasPage/ConsultasPage.tsx` | Pagina de listado con DataTable (columnas: Nombre, Email, Asunto, Fecha, Estado) |
| `src/components/admin/ConsultaDetailModal.tsx` | Modal de detalle con mensaje completo, textarea de respuesta y boton de enviar |

---


## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/stores/consultasStore.ts` | Metodo `setUnreadCount` agregado para resetear contador desde el topbar |
| `src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx` | Store importado, `fetchUnreadCount` en `useEffect`, badge numerico en icono de campana, titulo "Consultas" en el map. `onClick` en campana: navega a `/admin/consultas` y resetea `unreadCount` a 0 |
| `src/AppRouter.jsx` | Import + ruta `/admin/consultas` agregada al bloque de rutas protegidas |
| `App/Tasks.md` | 6 tareas del Modulo 6 marcadas como completadas |

---

## Detalles Tecnicos

- **API:** Todos los endpoints del backend `GET/PUT/DELETE /api/consultas` y `GET /api/consultas/unread/count`
- **Badge de notificacion:** Muestra el contador de consultas sin leer en el AdminTopbar. Si supera 99, muestra "99+". Al hacer clic, navega a `/admin/consultas` y resetea el contador a 0
- **ConsultaDetailModal:** Al enviar respuesta, dispara `PUT /api/consultas/:id` con `{ respuesta, respondido: true }`. Una vez respondida, el textarea se deshabilita
- **Sin mocks:** Backend completo con migraciones, modelo, controlador, servicio, validador y rate-limit en POST
- **Estados UX:** Loading (skeleton), Error (banner rojo), Empty (mensaje informativo) en ConsultasPage
