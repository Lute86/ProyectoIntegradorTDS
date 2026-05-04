# Modulo 1 - Configuración inicial, auth, modelo usuarios, tests

## Resumen de cambios

Se implementa el sistema completo de autenticación y gestión de usuarios para el backend de la aplicación.

**Cambios principales:**
- Modelo `User` con roles (`admin`, `profesor`, `tutor`) y soft delete (paranoid: true)
- Sistema de autenticación JWT (access token + refresh token)
- Endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/auth/profile`
- Middlewares de autenticación, validación, manejo de errores y configuración de multer
- Migración de creación de tabla users y seeder con usuario admin por defecto
- Tests de integración para el módulo de autenticación
- Configuración de base de datos, logger y utilidades de token

## Actualizar localmente

1. **Git pull**
2. **Actualizar dependencias y reiniciar contenedores**
3. **Ejecutar migraciones y seeders**
4. **Credenciales de admin creadas:**
   - Email: `admin@ifts29.edu.ar`
   - Password: `admin1234`

## Endpoints disponibles

| Método | Endpoint | Descripción | Auth requerida |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login` | Login con email y password | No |
| POST | `/api/auth/register` | Registro de nuevo usuario | No |
| POST | `/api/auth/refresh` | Renovar access token usando refresh token | No |
| GET | `/api/auth/profile` | Obtener perfil del usuario autenticado | Sí |

## Variables de entorno necesarias

Asegúrate de tener configuradas las siguientes variables en `/backend/.env` (copiar desde `.env.example` si no existe):
```
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Para el equipo

### Frontend
- Usar el endpoint `/api/auth/login` para obtener `accessToken` y `refreshToken`. Guardarlos en `localStorage` o `sessionStorage`.
- El `accessToken` debe enviarse en el header de las peticiones protegidas: `Authorization: Bearer <accessToken>`.
- Cuando el `accessToken` expire, usar el endpoint `/api/auth/refresh` con el `refreshToken` para obtener nuevos tokens.

### Backend
Se detalla el uso de los componentes creados para que los próximos módulos sigan el mismo patrón y reutilicen la infraestructura existente:

#### 1. Manejo de errores (`src/middlewares/error.middleware.js`)
- Middleware global registrado al final de `app.js` con la firma `(err, req, res, next)`.
- Captura todas las excepciones no manejadas y retorna respuestas JSON consistentes.
- **Cómo se activa**: Cualquier error lanzado o promesa rechazada pasará por este middleware.
- **Códigos de estado**: Lee `err.status` automáticamente (si es `AppError`).
- En desarrollo (`NODE_ENV=development`) expone el stack trace.
- Estructura de respuesta:
  ```json
  {
    "success": false,
    "message": "Mensaje de error",
    "stack": "..." // Solo en desarrollo
  }
  ```

#### 2. AppError y clases específicas (`src/utils/AppError.js`)
- Clases personalizadas para errores de aplicación con código HTTP automático.
- **NO necesitas especificar status code** - ya viene incluido en la clase:
  ```javascript
  throw new UnauthorizedError('Usuario no encontrado');     // 401 automático
  throw new ForbiddenError('Usuario inactivo');             // 403 automático
  throw new ConflictError('El email ya está registrado');   // 409 automático
  throw new NotFoundError('Recurso no encontrado');        // 404 automático
  throw new BadRequestError('Datos inválidos');             // 400 automático
  ```
- Ventaja: Código limpio y semántico sin códigos de estado.

#### 3. handleDbErrors (`src/utils/dbErrorHandler.js`)
- Wrapper para servicios que realizan operaciones de base de datos.
- **Convierte errores de Sequelize a AppErrors automáticamente**:
  - `SequelizeUniqueConstraintError` → `ConflictError`
  - `SequelizeValidationError` → `BadRequestError`
  - `SequelizeForeignKeyConstraintError` → `BadRequestError`
- **Uso en servicios** (elimina try/catch innecesarios):
  ```javascript
  export const login = handleDbErrors(async (email, password) => {
    const user = await models.User.findOne({ where: { email } });
    if (!user) throw new UnauthorizedError('Usuario no encontrado');
    // Cualquier error de Sequelize se convierte automáticamente
    await user.update({ ultimo_acceso: new Date() });
    return { ... };
  });
  ```

#### 4. asyncHandler (`src/utils/asyncHandler.js`)
- Wrapper para controladores async.
- Captura errores y los pasa automáticamente a `next(error)`.
- **Uso en controladores**:
  ```javascript
  export const login = asyncHandler(async (req, res) => {
    const result = await authService.login(email, password);
    return success(res, result, 'Login exitoso');
  });
  ```

#### 5. Response Helper (`src/utils/response.js`)
- Utilidades solo para **respuestas exitosas** (los errores los maneja el flujo AppError + errorHandler).
- **Formato estándar**: `{ success: boolean, message: string, data?: any }`
- **Funciones disponibles**:
  - `success(res, data, message, status)`: Respuesta exitosa genérica (default 200)
  - `created(res, data, message)`: Recurso creado (201)
  - `noContent(res)`: Sin contenido (204)

#### 6. Validadores (`src/middlewares/validators/`)
- Se definen reglas de validación específicas por ruta usando `express-validator`.
- Uso: pasar el validador como middleware antes del controlador:
  ```javascript
  router.post('/login', loginValidation, authController.login);
  ```
- Si la validación falla, usar `validationError()` de response.js:
  ```javascript
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }
  ```

#### 7. Logger (`src/utils/logger.js`)
- Winston configurado con múltiples transports:
  1. **Consola**: Salida coloreada para desarrollo
  2. **Archivo rotativo diario**: `logs/YYYY-MM-DD-app.log` (retención 14 días)
  3. **Archivo de errores**: `logs/YYYY-MM-DD-error.log` (retención 30 días)
- Niveles: `error`, `warn`, `info`, `debug` (controlado por `LOG_LEVEL`)

#### 8. Autenticación y control de roles
- `authenticate` middleware: Verifica JWT y adjunta `req.user`
- `role.middleware.js`: Control de acceso basado en roles (RBAC)
  ```javascript
  router.get('/admin-only', authenticate, checkRole(['admin']), controller.method);
  ```

#### 9. Flujo completo simplificado
```
Servicio (throw new UnauthorizedError) 
  → handleDbErrors (convierte errores Sequelize) 
    → asyncHandler (captura y llama a next) 
      → errorHandler (lee err.status, envía JSON)
```

#### 10. Estructura de controladores y servicios
- **Estilo funcional ESM**: `export const/login = asyncHandler(async (...) => { ... })`
- **Servicios**: Lógica de negocio envuelta en `handleDbErrors`
- **Controladores**: Manejo HTTP envuelto en `asyncHandler`, usan `response.js` para éxitos

### Guía para nuevos módulos
Para crear un nuevo módulo (ej: noticias, carreras), seguir la siguiente estructura:
1. **Modelo**: Crear en `src/models/` (ej: `news.model.js`)
2. **Migración**: Crear en `src/migrations/`
3. **Servicio**: Crear en `src/services/` y envolver con `handleDbErrors`
4. **Controlador**: Crear en `src/controllers/` y envolver con `asyncHandler`
5. **Validadores**: Crear en `src/middlewares/validators/`
6. **Rutas**: Crear en `src/routes/` y registrar en `src/routes/index.js`
7. **Tests**: Crear en `tests/integration/` siguiendo el patrón de `auth.test.js`

### Tests
- Los tests se encuentran en `backend/tests/integration/`.
- Ejecutar: `docker compose -f docker-compose.dev.yml exec backend npm test`
- Configuración en `tests/setup.js`: `NODE_ENV=test`, SQLite en memoria.

## Archivos modificados 
- Nuevos archivos: modelo User, controladores/auth, servicios/auth, middlewares (auth, error, role, multer, validators), utils (logger, token, AppError, asyncHandler, dbErrorHandler), tests de integración, migraciones y seeders.
- Archivos modificados: app.js, server.js, package.json, config/database.js, models/index.js, rutas index, Makefile.
