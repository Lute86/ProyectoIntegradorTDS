# AGENTS.md - IFTS 29 Nueva Web

##  Critical Rules
- **NEVER use npm directly** - Always use Makefile in App/ or docker exec
- **NEVER commit/push without explicit user request** - Wait for user to ask
- **Only implement what the user explicitly asks** - No features, no refactors, no extras
- **Comment code in Spanish** - Simple, short, no icons. Explain what each section does
- **No emojis/icons in code files** - Use text labels instead (e.g. 'NOT' instead of 📰)

##  Read These First
| File | What it contains |
|------|-----------------|
| `App/AGENTS.md` | All make commands, troubleshooting |
| `App/GUIDELINES.md` | Code patterns, module structure, ESM rules, doc process |
| `App/Tasks.md` | Task tracking (tick when done) |
| `App/WORKFLOW.md` | Git flow, PR process, testing requirements |
| `App/frontend/AGENTS.md` | Frontend-specific info |

##  Essential Commands (from App/)
```bash
make dev              # Start dev (frontend:5173, backend:3000/api)
make dev-down         # Stop dev
make dev-reset        # Stop dev + delete SQLite DB
make migrate-dev      # Run migrations
make seed-dev         # Load seed data
make tests-back       # Backend tests (Jest)
make tests-frontend   # Frontend tests (Vitest --run)
make lint-frontend    # Frontend lint (eslint --max-warnings 0)
make lint-backend     # Backend lint
make install          # Install all deps (frontend + backend)
make logs-dev         # Real-time logs
make shell-be-dev     # Backend container shell
# Windows (PowerShell, no WSL):
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml down
```

##  Quick Setup
```
cd App && cp .env.example .env   # Edit JWT_SECRET, DOMAIN
make install && make dev
```

##  Admin Credentials
- Email: admin@ifts29.edu.ar
- Password: admin1234

##  URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

##  FE Stack & Conventions
React 19 / Vite 6 / TailwindCSS 4 / Zustand 5 / React Router 7 / RHF + Zod / Axios / clsx / date-fns
- Tests: Vitest + Testing Library in `src/tests/`
- Proxy: `/api` → `http://backend:3000` (vite.config.js)
- UI: TailwindCSS 4 all styling, `clsx` for conditional classes
- Wireframe: open `wireframe/*.html` in browser for visual reference
- Mock data allowed until BE module is ready

##  Page & Route Pattern
- Create page at: `pages/public/XPage/XPage.jsx` or `pages/admin/XPage/XPage.jsx`
- Register route in `src/AppRouter.jsx`
- Detail pages use `/:slug` param (e.g. `/noticias/:slug`)
- Admin routes nest under `<Route path="/admin" element={<ProtectedRoute>}>` in AppRouter
- **To add a new page** (e.g. NoticiaDetailPage): create the .jsx, import in AppRouter, add `<Route>`

##  After Finishing a Module
1. Create `App/docs/PR-FEModuleX.md` (follow `App/docs/PR-BE1Module1.md` format as reference)
2. Tick completed tasks in `App/Tasks.md`
3. Write tests following the backend test patterns in `App/backend/tests/` as reference (not mandatory, but keep in mind)

##  Troubleshooting
- "Cannot find module": `make dev-down && make dev`
- Migration errors: `make migrate-dev` (or `make dev-reset && make dev`)
- Container issues: Check logs `make logs-dev` then restart
