# AGENTS.md — IFTS 29 Nueva Web

## Reglas críticas
- No usar npm directo — siempre Makefile en App/ o `docker exec`
- No commit/push sin pedido explícito
- Código comentado en español, simple, sin emojis
- Solo implementar lo pedido — nada de features, refactors ni extras

## Primero leer
| Archivo | Contenido |
|---------|-----------|
| `App/AGENTS.md` | comandos make, troubleshooting |
| `App/GUIDELINES.md` | patrones de código, estructura de módulos, ESM |
| `App/Tasks.md` | seguimiento de tareas (tachar al completar) |
| `App/WORKFLOW.md` | flujo git, PRs, testing |
| `App/frontend/AGENTS.md` | frontend específico |

## Comandos esenciales (desde App/)
```bash
make dev              # iniciar (FE:5173 + BE:3000/api)
make dev-down         # detener
make dev-reset        # detener + borrar SQLite
make migrate-dev      # migraciones
make seed-dev         # seed data
make tests-back       # tests backend (Jest)
make tests-frontend   # tests frontend (Vitest --run)
make lint-frontend    # eslint --max-warnings 0
make lint-backend     # eslint backend
make install          # npm install en frontend + backend
make logs-dev         # logs en vivo
# Windows (PowerShell, sin WSL):
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml down
```

## Stack
- **FE**: React 19 / Vite 6 / TailwindCSS 4 / Zustand 5 / React Router 7 / RHF+Zod / Axios / clsx / date-fns
- **BE**: Express 5 / Sequelize / SQLite(dev) / PostgreSQL(prod) / JWT / bcryptjs / Winston
- **Tests**: Jest+Supertest (BE), Vitest+Testing Library (FE)

## ⚠️ Performance: stores sin caché
Cada página pública re-fetcha datos del API al montarse porque los stores de Zustand no tienen cooldown. Solución implementada: `_lastFetched` con TTL de 30s en `carrerasStore.js` y `noticiasStore.js`. Si ya hay datos frescos, salta el fetch.

## Ruteo de páginas
- Páginas: `pages/public/XPage/` o `pages/admin/XPage/` — todas lazy-loaded en `AppRouter.jsx`
- Detalle usa `/:slug` (ej: `/noticias/:slug`)
- Admin anidado bajo `<Route path="/admin" element={<ProtectedRoute>}>`

## Frontend — peculiaridades
- Proxy Vite: `/api` → `http://backend:3000`
- Imports desde `pages/` necesitan `../../../` para llegar a `src/`
- `ThemeContext`, `LayoutContext`, `ToastContext` existen como carpetas pero están vacíos — la funcionalidad vive en `uiStore.js`
- Mock data como fallback para módulos BE que aún no existen (noticias, eventos, testimonios, galería)
- Admin seed: admin@ifts29.edu.ar / admin1234

## Backend — peculiaridades
- ESM: `import`/`export`, incluir extensión `.js`
- Patrón módulo: Model → Migration → Service → Controller → Validator → Routes
- Módulos BE completos: Auth, Carreras/Materias, Usuarios, SiteConfig/Stats
- Módulos BE pendientes: Noticias/Categorías, Eventos/Testimonios, Galería

## Después de completar un módulo FE
1. Crear `App/docs/PR-FEModuleX.md` (seguir formato de `App/docs/PR-BE1Module1.md`)
2. Tachar tareas en `App/Tasks.md`
3. Escribir tests

## Troubleshooting
- `make dev-down && make dev` para módulos/caché
- `make migrate-dev` para errores de migración
- `make dev-reset && make dev` para borrar BD SQLite
- `make logs-dev` para revisar logs
