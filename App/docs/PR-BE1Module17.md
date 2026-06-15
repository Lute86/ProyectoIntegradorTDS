# PR Módulo 17: Actividad Reciente del Dashboard

## Descripción
Se agrega endpoint `GET /api/stats/recent-activity` que retorna los últimos items de cada módulo (noticias, eventos, consultas, testimonios, usuarios) en una sola llamada, optimizado con queries paralelas y `LIMIT` en SQL. Solo accesible para administradores.

## Endpoint Implementado

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/stats/recent-activity` | Obtener actividad reciente del dashboard | Admin |

## Archivos Modificados

### Backend (`App/backend/src/`)

- **`services/stats.services.js`** (modificado)
  - Nueva función `getRecentActivity()`: ejecuta 5 queries en paralelo con `Promise.all`, cada una con `LIMIT 3` y `ORDER BY` por fecha correspondiente
  - Mapea resultados a formato unificado: `{ tipo, texto, timestamp, id }`
  - Ordena todos los items por timestamp descendente y retorna los 10 más recientes

- **`controllers/stats.controller.js`** (modificado)
  - Nuevo handler `getRecentActivity` que llama al servicio y retorna la respuesta

- **`routes/stats.routes.js`** (modificado)
  - Nueva ruta `GET /recent-activity` protegida con `authenticate` + `authorize('admin')`

### Tests (`App/backend/tests/integration/`)

- **`stats.test.js`** (modificado)
  - 12 nuevos tests para el endpoint `GET /api/stats/recent-activity`

## Estructura de Respuesta

### GET /api/stats/recent-activity
```json
{
  "success": true,
  "message": "Actividad reciente obtenida exitosamente",
  "data": [
    {
      "tipo": "consulta",
      "texto": "Consulta de Juan: Horarios de carrera",
      "timestamp": "2026-06-15T10:30:00.000Z",
      "id": 5
    },
    {
      "tipo": "noticia",
      "texto": "Nueva noticia: Inscripciones abiertas",
      "timestamp": "2026-06-14T15:00:00.000Z",
      "id": 12
    },
    {
      "tipo": "evento",
      "texto": "Evento: Feria de就业",
      "timestamp": "2026-06-20T09:00:00.000Z",
      "id": 3
    },
    {
      "tipo": "testimonio",
      "texto": "Testimonio de María García (Desarrollo de Software)",
      "timestamp": "2026-06-13T12:00:00.000Z",
      "id": 8
    },
    {
      "tipo": "usuario",
      "texto": "Último acceso: Carlos López (profesor)",
      "timestamp": "2026-06-15T08:45:00.000Z",
      "id": 4
    }
  ]
}
```

## Tipos de Actividad

| Tipo | Fuente | Campo Timestamp | Descripción |
|------|--------|-----------------|-------------|
| `noticia` | Noticias publicadas | `fecha_publicacion` | Últimas noticias publicadas |
| `evento` | Eventos | `fecha` | Próximos eventos |
| `consulta` | Consultas de contacto | `createdAt` | Últimas consultas recibidas |
| `testimonio` | Testimonios | `createdAt` | Últimos testimonios |
| `usuario` | Usuarios activos | `ultimo_acceso` | Usuarios con último acceso reciente |

## Tests
```bash
make tests-back arg=stats
```

**Resultado:** 22 tests pasando (6 dashboard + 12 recent-activity + 4 unit stats services)

## Dependencias
- Módulo BE 7 (Configuración del Sitio y Estadísticas)
- Modelos utilizados: Noticia, Evento, Consulta, Testimonio, User

## Contraparte Frontend

### Cómo integrar en `DashboardPage.tsx`

1. **Importar `api`** (ya importado):
   ```tsx
   import api from '../../../services/api';
   ```

2. **Agregar fetch en el `useEffect` existente**:
   ```tsx
   useEffect(() => {
     // Stats existente
     api.get('/stats/dashboard').then((res) => { ... });

     // Nueva actividad reciente
     api.get('/stats/recent-activity').then((res) => {
       setActividades(res.data.data || []);
     }).catch(() => {
       setActividades([]);
     });
   }, []);
   ```

3. **Agregar icono por tipo** (opcional): El JSX actual ya renderiza cada actividad con `{ texto, timestamp }`. Para agregar un icono por tipo, se puede acceder a `act.tipo`:
   - `noticia`: 📰
   - `evento`: 📅
   - `consulta`: 📧
   - `testimonio`: 💬
   - `usuario`: 👤

4. **Opcional - Agregar link**: Cada item tiene un `id` y un `tipo`. Se puede navegar a la página de admin correspondiente:
   ```tsx
   <Link to={`/admin/${act.tipo === 'noticia' ? 'noticias' : act.tipo === 'evento' ? 'eventos' : act.tipo === 'consulta' ? 'consultas' : act.tipo === 'testimonio' ? 'testimonios' : 'usuarios'}`}>
   ```

## Mejoras Futuras
- Parámetro `limit` configurable por query string
- Filtro por tipos específicos (`?tipos=noticia,evento`)
- Cache con TTL en el frontend (patrón `_lastFetched` existente en noticiasStore)
- Endpoint público para活动 reciente del sitio (sin auth)
