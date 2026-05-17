# AGENTS.md — IFTS 29 Nueva Web

##  Critical Rules
- **Platform**: Windows (no WSL, no `make`). Use explicit `docker compose` commands.
- **NEVER commit/push without explicit user request**
- **Only implement what the user explicitly asks** — no extra features, refactors, or scope creep
- **Comment code in Spanish** — concise, no icons. Explain what each section does
- **No emojis/icons in code files** — use text labels (e.g. 'NOTICIA' not 📰)
- **Tests mandatory for all new/modified code** — PRs without tests are rejected

##  Monorepo Structure
```
BASE/
├── App/                            # Full-stack app (Docker Compose)
│   ├── backend/                    # Express 5 + Sequelize — ESM ("type": "module")
│   │   ├── src/server.js           # Entrypoint
│   │   ├── src/app.js              # Express app setup
│   │   ├── src/routes/index.js     # Mounts: /api/auth, /carreras, /materias, /usuarios, /config, /stats
│   │   ├── src/controllers/        # 6 controllers (auth, carrera, materia, user, siteconfig, stats)
│   │   ├── src/models/             # Sequelize models (User, Carrera, Materia, SiteConfig)
│   │   ├── src/middlewares/        # auth, role, error, multer, validators
│   │   ├── src/migrations/         # Sequelize migrations
│   │   ├── src/seeders/            # Seed data
│   │   └── tests/integration/      # Jest + Supertest (in-memory SQLite)
│   ├── frontend/                   # React 19 + Vite 6 — ESM
│   │   ├── src/main.jsx            # Entrypoint
│   │   ├── src/AppRouter.jsx       # All routes defined here
│   │   ├── src/pages/public/       # Public pages (Home, Carreras, Noticias, Contacto, Estudiantes)
│   │   ├── src/pages/admin/        # Admin pages (Dashboard, Usuarios, Personalizar, etc.)
│   │   ├── src/components/layout/  # PublicLayout, AdminLayout
│   │   ├── src/services/api.js     # Axios instance with JWT interceptors
│   │   ├── src/stores/             # Zustand stores (authStore, carrerasStore, uiStore)
│   │   └── src/tests/              # Vitest + Testing Library (jsdom)
│   ├── docker/                     # Dockerfiles for dev and prod
│   └── docs/                       # PR docs per completed module
├── wireframe/                      # Static HTML prototype (reference only — open .html in browser)
└── .github/workflows/              # CI + PR branch check
```

##  Essential Commands (from `App/`)
```powershell
# Development
docker compose -f docker-compose.dev.yml up --build    # Start dev (frontend:5173, backend:3000/api)
docker compose -f docker-compose.dev.yml up            # Restart without rebuild
docker compose -f docker-compose.dev.yml down          # Stop dev
docker compose -f docker-compose.dev.yml down -v       # Stop + delete SQLite DB

# Migrations & seeds (run automatically on container start too)
docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate
docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:seed:all

# Testing
docker compose -f docker-compose.dev.yml exec backend npm test
docker compose -f docker-compose.dev.yml exec frontend npm test -- --run

# Linting
docker compose -f docker-compose.dev.yml exec backend npm run lint
docker compose -f docker-compose.dev.yml exec frontend npm run lint

# Utilities
docker compose -f docker-compose.dev.yml logs -f        # Real-time logs
docker compose -f docker-compose.dev.yml exec backend sh # Shell in backend container
```

##  Quick Setup
```powershell
cd App
copy .env.example .env            # Edit JWT_SECRET (min 32 chars) and DOMAIN
docker compose -f docker-compose.dev.yml up --build
```
- Admin: `admin@ifts29.edu.ar` / `admin1234`
- Frontend: http://localhost:5173 — Backend API: http://localhost:3000/api

##  Dev Environment Notes
- Backend uses **SQLite** in dev, **PostgreSQL** in prod (`src/config/database.js`)
- Migrations + seeds run automatically on container start
- `CHOKIDAR_USEPOLLING=true` is already set in docker-compose for Windows/WSL2 hot-reload
- Frontend proxies `/api` → `http://backend:3000` (configured in `vite.config.js`, dev only)
- After `git pull` with new deps: `docker compose -f docker-compose.dev.yml down && docker compose -f docker-compose.dev.yml up --build`
- After `git pull` with new migrations: `docker compose -f docker-compose.dev.yml exec backend npx sequelize-cli db:migrate`

##  Testing
- **Backend**: `docker compose -f docker-compose.dev.yml exec backend npm test` → Jest 29 + Supertest 7, `NODE_ENV=test`, in-memory SQLite (`:memory:`)
  - Test command: `NODE_ENV=test node --experimental-vm-modules node_modules/.bin/jest --forceExit --no-cache`
  - Tests in `backend/tests/integration/` (auth, carrera, materia, siteconfig, stats, user)
  - Each test file calls `sequelize.sync({ force: true })` in beforeAll/beforeEach
- **Frontend**: `docker compose -f docker-compose.dev.yml exec frontend npm test -- --run` → Vitest 4 + Testing Library, jsdom environment
  - Setup in `frontend/src/tests/setup.js` (imports `@testing-library/jest-dom/vitest`, cleanup afterEach)

##  CI / Branch Enforcement (GitHub Actions)
- `main` is protected — no direct pushes, PRs must come from `develop`
- CI runs 4 parallel jobs on push/PR to `develop` or `main`: `backend-lint`, `backend-tests`, `frontend-lint`, `frontend-tests`
- PRs to `main` additionally enforce `PR Branch Check` (must originate from `develop`)
- Commits: Conventional Commits in Spanish, with scope, e.g. `feat(be/users): agregar CRUD de usuarios`
- Branch naming: `feature/desc`, `fix/desc`, `chore/desc`, `docs/desc`, `test/desc`

##  Page & Route Pattern
- Create page in `pages/public/XPage/XPage.jsx` or `pages/admin/XPage/XPage.jsx`
- Register route in `src/AppRouter.jsx`
- Detail pages use `/:slug` param (e.g. `/noticias/:slug`)
- Admin routes nest under `<Route path="/admin" element={<ProtectedRoute>}>`

##  Reference Files
| File | Content |
|------|---------|
| `App/README.md` | Full Docker setup, env vars, troubleshooting |
| `App/WORKFLOW.md` | Git flow, branch rules, PR process |
| `App/Tasks.md` | Task tracking, module dependencies, team assignments |
| `App/docs/ARCHITECTURE.md` | Docker architecture, service descriptions |
| `wireframe/*.html` | Open in browser — visual reference for UI |

