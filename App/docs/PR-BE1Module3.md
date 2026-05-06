# Modulo 3 - Gestión de Usuarios (CRUD)

## Resumen de cambios

Se implementa el módulo de gestión de usuarios con operaciones CRUD completas.

**Cambios principales:**
- Servicio `user.services.js` con lógica de negocio para CRUD de usuarios
- Controlador `user.controller.js` con manejo HTTP y validación de entrada
- Validadores `user.validator.js` para creación y actualización de usuarios
- Rutas `user.routes.js` con protección JWT y control de acceso por roles
- Toggle de estado activo/inactivo para usuarios
- Tests de integración completos en `tests/integration/user.test.js`

## Endpoints disponibles

| Método | Endpoint | Descripción | Auth requerida | Rol requerido |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/usuarios` | Listar todos los usuarios | Sí | admin |
| GET | `/api/usuarios/:id` | Obtener usuario por ID | Sí | - |
| POST | `/api/usuarios` | Crear nuevo usuario | Sí | admin |
| PUT | `/api/usuarios/:id` | Actualizar usuario | Sí | - |
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
3. **Control de roles**: Solo admin puede listar usuarios, crear, eliminar y toggle active
4. **Toggle activo**: Endpoint PATCH para cambiar estado activo/inactivo
5. **Validación de email duplicado**: Tanto en creación como actualización

## Para el equipo

### Frontend (Módulo FE 4)
- Usar `GET /api/usuarios` para listar usuarios (requiere rol admin)
- Usar `POST /api/usuarios` para crear usuario (requiere rol admin)
- Usar `PUT /api/usuarios/:id` para actualizar usuario
- Usar `DELETE /api/usuarios/:id` para eliminar usuario (requiere rol admin)
- Usar `PATCH /api/usuarios/:id/toggle-active` para activar/desactivar usuario

### Backend
- El servicio maneja el hash de contraseñas con bcrypt automáticamente
- Se reutilizan los middlewares `authenticate` y `authorize` existentes
- Patrón de error handling consistente con los módulos anteriores

## Tests

Los tests cubren:
- Listar usuarios (con y sin permisos)
- Obtener usuario por ID
- Crear usuario (éxito y errores)
- Actualizar usuario
- Eliminar usuario
- Toggle estado activo
- Validación de email duplicado


## Archivos modificados/creados

### Nuevos archivos:
- `backend/src/services/user.services.js`
- `backend/src/controllers/user.controller.js`
- `backend/src/middlewares/validators/user.validator.js`
- `backend/src/routes/user.routes.js`
- `backend/tests/integration/user.test.js`

### Archivos modificados:
- `backend/src/routes/index.js` (registro de user routes)
