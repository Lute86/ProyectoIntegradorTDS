# Modulo 3 - Gestión de Usuarios (CRUD)

## Resumen de cambios

Se implementa el módulo de gestión de usuarios con operaciones CRUD completas.

**Cambios principales:**
- Servicio `user.services.js` con lógica de negocio para CRUD de usuarios
- Controlador `user.controller.js` con manejo HTTP y validación de entrada
- Validadores `user.validator.js` para creación y actualización de usuarios
- Rutas `user.routes.js` con protección JWT y control de acceso por roles
- Middleware `owner.middleware.js` para autorizar al propietario o admin
- Toggle de estado activo/inactivo para usuarios
- Seeder actualizado con usuarios para cada rol (admin, profesor, tutor)
- Tests de integración completos en `tests/integration/user.test.js`

## Endpoints disponibles

| Método | Endpoint | Descripción | Auth requerida | Autorización |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/usuarios` | Listar todos los usuarios | Sí | admin |
| GET | `/api/usuarios/:id` | Obtener usuario por ID | Sí | Propietario o admin |
| POST | `/api/usuarios` | Crear nuevo usuario | Sí | admin |
| PUT | `/api/usuarios/:id` | Actualizar usuario | Sí | Propietario o admin |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | Sí | admin |
| PATCH | `/api/usuarios/:id/toggle-active` | Cambiar estado activo/inactivo | Sí | admin |

## Filtros disponibles

- `?rol=admin` - Filtrar por rol
- `?activo=true` - Filtrar por estado activo

## Validaciones

### Creación de usuario (`createUserValidation`)
- `nombre`: Requerido, mínimo 2 caracteres
- `email`: Requerido, formato email válido
- `password`: Requerido, mínimo 6 caracteres
- `apellido`: Opcional
- `rol`: Opcional (admin/profesor/tutor)
- `avatar_url`: Opcional, formato URL
- `activo`: Opcional, booleano

### Actualización de usuario (`updateUserValidation`)
- Todos los campos son opcionales
- Mismas reglas de validación que creación

## Características implementadas

1. **Exclusión de password_hash**: Las respuestas nunca incluyen el hash de la contraseña
2. **Protección de rutas**: Todas las rutas requieren autenticación JWT
3. **Control de acceso**: 
   - Admin: acceso completo
   - Usuario: solo puede ver/editar su propio perfil (`requireOwnerOrAdmin`)
4. **Toggle activo**: Endpoint PATCH para cambiar estado activo/inactivo (solo admin)
5. **Validación de email duplicado**: Tanto en creación como actualización

## Middleware de autorización: `owner.middleware.js`

Se creó un nuevo middleware `requireOwnerOrAdmin` que permite acceso si:
- El usuario es admin, O
- El usuario está accediendo a su propio recurso (ID coincide)

```javascript
// Uso en rutas
router.get('/:id', idParamValidation, requireOwnerOrAdmin(), userController.getById);
router.put('/:id', idParamValidation, requireOwnerOrAdmin(), userController.update);
```

## Seeder de usuarios

El seeder `user-seeder.js` ahora crea usuarios para cada rol:

| Email | Rol | Password |
|-------|-----|----------|
| `admin@ifts29.edu.ar` | admin | admin1234 |
| `profesor@ifts29.edu.ar` | profesor | profesor123 |
| `tutor@ifts29.edu.ar` | tutor | tutor123 |

## Para el equipo

### Frontend (Módulo FE 4)
- Usar `GET /api/usuarios` para listar usuarios (requiere rol admin)
- Usar `GET /api/usuarios/:id` para ver perfil (solo propio o admin)
- Usar `POST /api/usuarios` para crear usuario (requiere rol admin)
- Usar `PUT /api/usuarios/:id` para actualizar (solo propio o admin)
- Usar `DELETE /api/usuarios/:id` para eliminar usuario (requiere rol admin)
- Usar `PATCH /api/usuarios/:id/toggle-active` para activar/desactivar (requiere rol admin)

### Backend
- El servicio maneja el hash de contraseñas con bcrypt automáticamente
- Se reutilizan los middlewares `authenticate`, `authorize` y nuevo `requireOwnerOrAdmin`
- Patrón de error handling consistente con los módulos anteriores

## Tests

Los tests cubren:
- Listar usuarios (con y sin permisos)
- Obtener usuario por ID (propio y otros casos)
- Crear usuario (éxito y errores)
- Actualizar usuario (propio y validaciones)
- Eliminar usuario
- Toggle estado activo
- Validación de email duplicado

Ejecutar: `make tests-back` (desde `BASE/App/`)

## Archivos modificados/creados

### Nuevos archivos:
- `backend/src/services/user.services.js`
- `backend/src/controllers/user.controller.js`
- `backend/src/middlewares/validators/user.validator.js`
- `backend/src/middlewares/owner.middleware.js`
- `backend/src/routes/user.routes.js`
- `backend/tests/integration/user.test.js`

### Archivos modificados:
- `backend/src/routes/index.js` (registro de user routes)
- `backend/src/seeders/user-seeder.js` (usuarios para cada rol)
