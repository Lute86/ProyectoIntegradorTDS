
# Karpathy Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```


## Project-Specific Guidelines

### Backend (Node.js/Express/Sequelize)
- All API endpoints must have tests
- Follow the existing error handling patterns in `BASE/App/backend/src/middlewares/error.middleware.js`, `BASE/App/backend/src/utils/AppError.ts`,  `BASE/App/backend/src/utils/asyncHandler.ts`, `BASE/App/backend/src/utils/dbErrorHandler.ts`
- Follow the patterns on the code for each section/module

#### Code Structure Pattern
When creating a new module (e.g., Carreras, Noticias), follow this structure:
1. **Model**: `src/models/<name>.model.js` - Sequelize model definition
2. **Migration**: `src/migrations/XXX-create-<name>.js` - Database migration
3. **Service**: `src/services/<name>.services.js` - Business logic
4. **Controller**: `src/controllers/<name>.controller.js` - HTTP handling (use try/catch)
5. **Validators**: `src/middlewares/validators/` - Input validation rules
6. **Routes**: `src/routes/` - Register in `src/routes/index.js`

#### Module Pattern (Auth as Reference)
- Controllers: Use try/catch blocks, call services, return standardized responses
- Services: Contain business logic, interact with models
- Routes: Define endpoints, apply validators and middlewares
- Validators: Use express-validator or Zod schemas

#### ESM Modules (Important)
- All backend code uses **ESM** (`import/export`)
- `package.json` has `"type": "module"`
- Always include `.js` extension in imports: `import { x } from './file.js'`
- No CommonJS (`require`, `module.exports`)

#### Database
- Development: SQLite (file-based)
- Production: PostgreSQL
- Use Sequelize ORM with migrations and seeders
- Run migrations: `npx sequelize-cli db:migrate`
- Run seeders: `npx sequelize-cli db:seed:all`

#### Testing
- Framework: Jest + Supertest
- Location: `tests/integration/`
- Setup: `tests/setup.js` (uses in-memory SQLite)
- Config: `jest.config.cjs` (requires babel-jest for ESM)
- Run: `npm test`

#### Authentication & Authorization
- JWT-based authentication
- Middleware: `src/middlewares/auth.middleware.js` (JWT validation)
- Role middleware: `src/middlewares/role.middleware.js` (RBAC: admin/profesor/tutor)
- Protected routes use: `authenticate` + `authorize(['role'])` middlewares

#### Error Handling
- Global error handler: `src/middlewares/error.middleware.js`
- Custom errors: Use `AppError` from `src/utils/AppError.js`
- Async handlers: Use `asyncHandler` from `src/utils/asyncHandler.js`
- Database errors: Handled by `dbErrorHandler` from `src/utils/dbErrorHandler.js`

### Frontend (React/Vite)
- Framework: React 19 with Vite 6
- Styling: TailwindCSS 4
- State: Zustand stores
- Routing: React Router 7
- Forms: React Hook Form + Zod validation
- Rich Text: TipTap editor
- Testing: Vitest + Testing Library

#### Code Structure
- Pages: `src/pages/` - Route components
- Components: `src/components/` - Reusable UI components
- Stores: `src/stores/` - Zustand state management
- Services: `src/services/` - API calls (axios)
- Hooks: `src/hooks/` - Custom React hooks
- Tests: `src/tests/` - Vitest tests

#### Component Patterns
- Use functional components with hooks
- Follow existing component structure in `src/components/`
- Use TailwindCSS classes for styling (no CSS modules unless necessary)
- Props validation with TypeScript or PropTypes

#### Documentation
- After finishing a task add the documentation in the App/docs dir. If you're working on a Task of a specific module, check if there is the md already created PR-BE1Module{X}.md. (If there's no related file create it) 
- This will serve as documentation for anyone working on the project. Follow PR-BE1Module1.md format.
- Add on it, don't erase, modify if necessary but ask.
- Tick on the Tasks.md the task finished 