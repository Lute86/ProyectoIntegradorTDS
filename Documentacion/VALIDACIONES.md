# ✅ VALIDACIONES Y CONTROL DE ERRORES

**Sistema de validación y manejo de excepciones**

---

## 📋 Validación Multidimensional

### Nivel 1: Frontend

**React Hook Form + Zod**

```javascript
// Esquema de validación
const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  nombre: z.string().min(2, "Mínimo 2 caracteres")
});

// En el formulario
const { register, errors } = useForm({
  resolver: zodResolver(schema)
});
```

**Validaciones:**
- ✅ Email válido
- ✅ Contraseña mínimo 8 caracteres
- ✅ Campo no vacío
- ✅ Tipo de dato correcto
- ✅ Longitud mínima/máxima

### Nivel 2: Backend

**express-validator** (los validadores en `backend/src/middlewares/validators/` usan
exclusivamente `express-validator`; Zod se usa en el **frontend**, no en el backend)

```javascript
router.post('/usuarios', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({min: 8}),
  body('nombre').trim().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    // Procesar...
  }
);
```

### Nivel 3: Base de Datos

**Sequelize Constraints**

```javascript
User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    len: [8, 255]
  }
}, {sequelize});
```

---

## 🔐 Validaciones por Campo

### User (Usuarios)

| Campo | Tipo | Reglas |
|-------|------|--------|
| email | STRING | Email válido, UNIQUE |
| password | STRING | Min 8 chars, hasheada |
| nombre | STRING | NOT NULL, min 2 |
| apellido | STRING | NULL permitido |
| rol | ENUM | admin\|profesor\|tutor |

### Noticia

| Campo | Tipo | Reglas |
|-------|------|--------|
| titulo | STRING | NOT NULL, min 5 |
| contenido | TEXT | NOT NULL |
| estado | ENUM | borrador\|publicado\|archivado |
| categoria_id | INTEGER | FK válida |

### Evento

| Campo | Tipo | Reglas |
|-------|------|--------|
| titulo | STRING | NOT NULL |
| fecha_inicio | TIMESTAMP | NOT NULL, >= hoy |
| fecha_fin | TIMESTAMP | NULL, >= fecha_inicio |
| capacidad | INTEGER | >= 0 si existe |

---

## ⚠️ Códigos de Error HTTP

### 400 Bad Request (Validación fallida)

**Causa:** Datos inválidos en la petición

```json
{
  "success": false,
  "status": 400,
  "message": "Validación fallida",
  "errors": {
    "email": ["Email inválido"],
    "password": ["Mínimo 8 caracteres"]
  }
}
```

### 401 Unauthorized (No autenticado)

**Causa:** Falta token o es inválido

```json
{
  "success": false,
  "status": 401,
  "message": "Token inválido o expirado"
}
```

### 403 Forbidden (No autorizado)

**Causa:** Usuario no tiene permisos

```json
{
  "success": false,
  "status": 403,
  "message": "No tienes permisos para este recurso"
}
```

### 404 Not Found (Recurso no existe)

**Causa:** ID no encontrado

```json
{
  "success": false,
  "status": 404,
  "message": "Noticia no encontrada"
}
```

### 409 Conflict (Conflicto de datos)

**Causa:** Email duplicado, slug único violado

```json
{
  "success": false,
  "status": 409,
  "message": "El email ya está registrado"
}
```

### 500 Internal Server Error

**Causa:** Error no esperado en servidor

```json
{
  "success": false,
  "status": 500,
  "message": "Error interno del servidor"
}
```

---

## 🛡️ Rate Limiting

### Endpoints Limitados

```
POST /api/auth/login
├─ Máximo: 10 intentos
└─ Ventana: 15 minutos
```

**Ejemplo de respuesta:**

```json
{
  "success": false,
  "status": 429,
  "message": "Demasiados intentos. Intenta más tarde."
}
```

---

## 🔐 Autenticación

### Login

**Request:**
```bash
POST /api/auth/login
{
  "email": "admin@ifts29.edu.ar",
  "password": "admin1234"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "admin@ifts29.edu.ar",
      "rol": "admin"
    }
  }
}
```

**Response (fallo):**
```json
{
  "success": false,
  "status": 401,
  "message": "Credenciales inválidas"
}
```

### Autorización

**Token en header:**
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Validación:**
- ✅ Token presente
- ✅ Formato Bearer válido
- ✅ Firma correcta
- ✅ No expirado
- ✅ Usuario existe

---

## 🚨 Manejo de Excepciones

### En Frontend

```javascript
try {
  const respuesta = await api.post('/noticias', data);
  mostrarNotificacion('Éxito', 'Noticia creada');
} catch (error) {
  if (error.status === 400) {
    mostrarErrores(error.data.errors);
  } else if (error.status === 401) {
    redirigirAlLogin();
  } else {
    mostrarNotificacion('Error', 'Algo salió mal');
  }
}
```

### En Backend

```javascript
async (req, res) => {
  try {
    const usuario = await User.create(req.body);
    return res.status(201).json({...});
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Email ya existe'
      });
    }
    // Logging
    logger.error(error);
    return res.status(500).json({
      message: 'Error interno'
    });
  }
}
```

---

## ✨ Buenas Prácticas

### Frontend

- ✅ Validar antes de enviar
- ✅ Mostrar errores inline
- ✅ No exponer detalles técnicos
- ✅ Manejar timeouts
- ✅ Retry automático en errores 5xx

### Backend

- ✅ Validar siempre (no confiar frontend)
- ✅ Loguear todos los errores
- ✅ No exponer stack traces al cliente
- ✅ Usar mensajes amigables
- ✅ Códigos HTTP correctos

### Base de Datos

- ✅ Constraints a nivel BD
- ✅ Foreign keys con cascades
- ✅ Índices en campos únicos
- ✅ Triggers para auditoría

---

## 📚 Ver También

- [EJEMPLOS_API_REST.md](./EJEMPLOS_API_REST.md)
- [BASE_DE_DATOS.md](./BASE_DE_DATOS.md)
- [ARQUITECTURA.md](./ARQUITECTURA.md)
