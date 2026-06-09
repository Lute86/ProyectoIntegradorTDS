# Modulo 14 - Seguridad Backend

## Resumen de cambios

Se aplican correcciones de seguridad críticas y medias al backend, eliminando vulnerabilidades de autenticación, autorización y configuración identificadas en el security audit del 2026-06-08. Se refactorizan todos los tests de integración para usar un helper compartido en vez del endpoint de registro eliminado.

**Cambios principales:**
- Eliminar fallback hardcoded de `JWT_SECRET` (crash si falta la env var)
- Eliminar ruta pública `POST /api/auth/register` (CRIT-02)
- Reducir rate limit global de 200→100 req/min, agregar `loginLimiter` (10 intentos/15min)
- Eliminar fuga de stack traces al cliente
- Generar passwords aleatorios en el seeder
- Aumentar mínimo de contraseña de 6→8 caracteres
- Refactorizar 13 archivos de test de integración con helper compartido

## Issues corregidos del security audit

| ID | Severidad | Descripción | Estado |
|----|-----------|-------------|--------|
| CRIT-01 | CRITICAL | JWT Secret hardcoded con fallback débil | ✅ Corregido |
| CRIT-02 | CRITICAL | Registro público permite crear cuentas admin | ✅ Corregido |
| HIGH-02 | HIGH | CORS wildcard fallback (`*`) | ✅ Corregido |
| HIGH-04 | HIGH | Credenciales admin hardcodeadas en seeder | ✅ Corregido |
| MED-01 | MEDIUM | Rate limiting muy generoso (200 req/min) | ✅ Corregido |
| MED-03 | MEDIUM | Error handler filtra stack traces | ✅ Corregido |
| MED-07 | MEDIUM | Password mínimo 6 caracteres | ✅ Corregido |
| LOW-03 | LOW | No hay health check que valide DB connection | ✅ Corregido |

### Issues no corregidos (diferidos o fuera de scope backend)

| ID | Severidad | Razón |
|----|-----------|-------|
| CRIT-03 | CRITICAL | XSS vía dangerouslySetInnerHTML — **Frontend** |
| HIGH-01 | HIGH | Mock auth bypass — **Frontend** |
| HIGH-05 | HIGH | JWT en localStorage → httpOnly cookies — Diferido |
| HIGH-06 | HIGH | Sin protección CSRF — Diferido (depende de HIGH-05) |
| MED-02 | MEDIUM | Nginx sin security headers — **Infra** |
| MED-04 | MEDIUM | PostgreSQL sin SSL — Ya resuelto en **Módulo 13** |
| MED-05 | MEDIUM | ProtectedRoute sin wrapper padre — **Frontend** |
| MED-08 | MEDIUM | Console.error en producción — **Frontend** |
| LOW-01 | LOW | Dev Dockerfile corre como root — **Infra** |
| LOW-05 | LOW | CORS env var mismatch — Ya resuelto en **Módulo 13** |

## Archivos modificados

### Core de seguridad

| Archivo | Cambio | Issue |
|---------|--------|-------|
| `backend/src/services/auth.services.js` | Eliminar fallback `JWT_SECRET`, eliminar función `register` | CRIT-01, CRIT-02 |
| `backend/src/middlewares/auth.middleware.js` | Eliminar fallback `JWT_SECRET` | CRIT-01 |
| `backend/src/routes/auth.routes.js` | Eliminar `POST /register`, agregar `loginLimiter` | CRIT-02, MED-01 |
| `backend/src/controllers/auth.controller.js` | Eliminar handler `register` | CRIT-02 |
| `backend/src/middlewares/validators/auth.validator.js` | Eliminar `registerValidation` | CRIT-02 |
| `backend/src/middlewares/validators/user.validator.js` | Cambiar `min: 6` → `min: 8` en passwords | MED-07 |
| `backend/src/app.js` | CORS fallback `'*'` → `'https://localhost'`, rate limit 200→100 | HIGH-02, MED-01 |
| `backend/src/middlewares/error.middleware.js` | Eliminar envío de `response.stack` al cliente | MED-03 |
| `backend/src/seeders/01-user-seeder.js` | Generar passwords aleatorios con `crypto.randomBytes`, imprimir en consola | HIGH-04 |
| `backend/.env` | Eliminar variable `CORS` no utilizada | LOW-05 |

### Tests

| Archivo | Cambio |
|---------|--------|
| `backend/tests/helpers.js` | **Nuevo**: `createUser()`, `generateToken()`, `createAndLogin()` |
| `backend/tests/integration/auth.test.js` | Eliminar tests de registro, ajustar passwords a 8+ chars |
| `backend/tests/unit/services/auth.services.test.js` | Eliminar tests de `register` |
| `backend/tests/integration/horario.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/noticia.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/evento.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/testimonio.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/galeria.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/consulta.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/stats.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/categoria.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/materia.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/carrera.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/carreraMateria.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/siteconfig.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()` |
| `backend/tests/integration/user.test.js` | Reemplazar `/api/auth/register` → `createAndLogin()`, passwords 8+ chars |

## Detalle de implementación

### 1. JWT Secret sin fallback (CRIT-01)

```js
// ANTES (auth.services.js y auth.middleware.js)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

// DESPUÉS
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET no está definido en las variables de entorno');
}
```

El backend crashea al iniciar si `JWT_SECRET` no está definido. Nunca usa un valor por defecto.

### 2. Eliminar registro público (CRIT-02)

Eliminados completamente:
- Ruta `POST /api/auth/register` de `auth.routes.js`
- Handler `register` de `auth.controller.js`
- Servicio `register` de `auth.services.js`
- Validator `registerValidation` de `auth.validator.js`
- Tests de registro en `auth.test.js` y `auth.services.test.js`

**Razón:** La creación de usuarios debe hacerse exclusivamente por admin desde `POST /api/usuarios` (requiere `authenticate` + `authorize('admin')`).

### 3. Rate limiting mejorado (MED-01)

```js
// Global: reducir de 200 a 100 req/min
app.use('/api/', rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Login: 10 intentos por 15 min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiados intentos. Intentá de nuevo en 15 minutos.' },
});
```

### 4. Seeder con passwords aleatorios (HIGH-04)

```js
// ANTES
{ email: 'admin@ifts29.edu.ar', password: 'admin1234' }

// DESPUÉS
import crypto from 'crypto';
const password = crypto.randomBytes(12).toString('base64url');
// Imprime en consola: admin: admin@ifts29.edu.ar / xK9pL2mN...
```

### 5. Password mínimo 8 caracteres (MED-07)

```js
// ANTES
.isLength({ min: 6 })

// DESPUÉS
.isLength({ min: 8 })
```

Aplica a `auth.validator.js` y `user.validator.js` (create y update).

### 6. Test helper compartido (`tests/helpers.js`)

```js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sequelize } from '../src/models/index.js';

export async function createUser({ email, password = 'testpass123', rol = 'profesor' } = {}) {
  const passwordHash = await bcrypt.hash(password, 10);
  return sequelize.models.User.create({
    nombre: 'Test', apellido: 'Test', email,
    password_hash: passwordHash, rol, activo: true,
  });
}

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

export async function createAndLogin({ email, password, rol } = {}) {
  const user = await createUser({ email, password, rol });
  const token = generateToken(user);
  return { user, token };
}
```

Reemplaza las llamadas a `POST /api/auth/register` en los 13 archivos de test de integración.

## Para el equipo

### Frontend
- Los cambios en `auth.routes.js` eliminan `POST /api/auth/register`. Si el frontend usa ese endpoint para registro, ahora debe usar `POST /api/usuarios` (requiere token de admin).
- El mínimo de contraseña ahora es 8 caracteres.

### Backend
- **JWT_SECRET**: Asegurar que esté definido en `.env` antes de iniciar.
- **Login rate limit**: 10 intentos fallidos por 15 minutos por IP.
- **Passwords**: Todos los passwords nuevos deben tener mínimo 8 caracteres.

## Tests

```bash
# Todos los tests (480 tests, 33 suites)
make tests-back

# Tests específicos
make tests-back arg=auth
make tests-back arg=user
```

## Archivos creados

- `backend/tests/helpers.js`

## Archivos modificados

- `backend/src/services/auth.services.js`
- `backend/src/middlewares/auth.middleware.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/middlewares/validators/auth.validator.js`
- `backend/src/middlewares/validators/user.validator.js`
- `backend/src/app.js`
- `backend/src/middlewares/error.middleware.js`
- `backend/src/seeders/01-user-seeder.js`
- `backend/.env`
- `backend/tests/integration/auth.test.js`
- `backend/tests/unit/services/auth.services.test.js`
- 13 archivos de test de integración (ver tabla arriba)
