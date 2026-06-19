# Ejemplos de API REST

A continuación se presentan ejemplos de peticiones y respuestas para los endpoints principales del sistema. Útiles para pruebas manuales con Postman o curl.

> **Formato de respuesta (envelope):** todas las respuestas tienen la forma
> `{ "success": boolean, "message": string, "data": ... }`. En errores:
> `{ "success": false, "message": string, "errors"?: [...] }`. **No hay** campo
> `status` dentro del body (el código HTTP va en la respuesta HTTP).
>
> Formas de `data`:
> - Listas simples (carreras, usuarios, materias, etc.) → `data` es un **array**.
> - Listas paginadas (noticias, consultas) → `data` es `{ data: [...], total, page, limit, totalPages }`.
> - Un recurso → `data` es el **objeto** directamente (sin envoltura por nombre).

---

## 1. AUTENTICACIÓN

### 1.1 Login (Obtener Token JWT)

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@ifts29.edu.ar",
  "password": "admin1234"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nombre": "Admin",
      "apellido": "Sistema",
      "email": "admin@ifts29.edu.ar",
      "rol": "admin",
      "avatar_url": null
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**Headers requeridos en sucesivas peticiones:**
```
Authorization: Bearer <token>
```

> Otros endpoints de auth: `POST /api/auth/refresh` y `GET /api/auth/profile`.

---

## 2. CARRERAS

### 2.1 Listar Carreras (Público)

**Endpoint:** `GET /api/carreras`

**Query Parameters (opcionales):**
- `modalidad`: presencial, virtual, hibrida
- `activa`: true / false

**Request:**
```
GET /api/carreras
```

**Response (200 OK)** — `data` es un array:
```json
{
  "success": true,
  "message": "Carreras obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Tecnicatura Superior en Desarrollo de Software",
      "slug": "tecnicatura-desarrollo-software",
      "titulo": "Técnico Superior en Desarrollo de Software",
      "descripcion": "Forma profesionales capacitados en...",
      "duracion": 6,
      "modalidad": "presencial",
      "icono": "code",
      "color": "#FF6B6B",
      "activa": true
    }
  ]
}
```

### 2.2 Obtener Carrera por ID o Slug

**Endpoint:** `GET /api/carreras/:id` · `GET /api/carreras/slug/:slug`

**Request:**
```
GET /api/carreras/slug/tecnicatura-desarrollo-software
```

**Response (200 OK)** — `data` es el objeto carrera, con sus materias en `carreraMaterias`:
```json
{
  "success": true,
  "message": "Carrera obtenida exitosamente",
  "data": {
    "id": 1,
    "nombre": "Tecnicatura Superior en Desarrollo de Software",
    "slug": "tecnicatura-desarrollo-software",
    "titulo": "Técnico Superior en Desarrollo de Software",
    "descripcion": "Forma profesionales capacitados...",
    "duracion": 6,
    "modalidad": "presencial",
    "icono": "code",
    "color": "#FF6B6B",
    "activa": true,
    "carreraMaterias": [
      {
        "id": 10,
        "cuatrimestre": 1,
        "carga_horaria_semanal": 6,
        "materia": { "id": 1, "nombre": "Programación I" }
      }
    ]
  }
}
```

### 2.3 Crear Carrera (Admin)

**Endpoint:** `POST /api/carreras` · **Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "nombre": "Tecnicatura en Ciberseguridad",
  "slug": "tecnicatura-ciberseguridad",
  "titulo": "Técnico Superior en Ciberseguridad",
  "descripcion": "Forma especialistas en protección de sistemas...",
  "duracion": 6,
  "modalidad": "presencial",
  "color": "#FF1744",
  "activa": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Carrera creada exitosamente",
  "data": {
    "id": 5,
    "nombre": "Tecnicatura en Ciberseguridad",
    "slug": "tecnicatura-ciberseguridad",
    "modalidad": "presencial",
    "activa": true,
    "createdAt": "2026-06-18T15:30:00Z",
    "updatedAt": "2026-06-18T15:30:00Z"
  }
}
```

---

## 3. NOTICIAS

### 3.1 Listar Noticias (Público)

**Endpoint:** `GET /api/noticias`

**Query Parameters (opcionales):**
- `categoria_id`: ID de categoría
- `estado`: borrador | publicado | archivado
- `search`: búsqueda por título/contenido
- `page`, `limit`: paginación (default 1 / 10)

**Request:**
```
GET /api/noticias?categoria_id=1&page=1&limit=5
```

**Response (200 OK)** — lista **paginada** (`data.data` es el array):
```json
{
  "success": true,
  "message": "Noticias obtenidas exitosamente",
  "data": {
    "data": [
      {
        "id": 1,
        "titulo": "Acto de Colación de Egresados 2026",
        "slug": "acto-colacion-egresados-2026",
        "contenido": "<p>Se llevará a cabo la ceremonia...</p>",
        "imagen_destacada_url": "/uploads/noticias/noticia-1.jpg",
        "estado": "publicado",
        "fecha_publicacion": "2026-06-15T10:30:00Z",
        "categoria": { "id": 1, "nombre": "Académica", "slug": "academica" },
        "autor": { "id": 1, "nombre": "Admin", "apellido": "Sistema" }
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 5,
    "totalPages": 3
  }
}
```

### 3.2 Crear Noticia (admin/profesor/tutor)

**Endpoint:** `POST /api/noticias` · **Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "titulo": "Nueva Carrera: Ciberseguridad",
  "slug": "nueva-carrera-ciberseguridad",
  "contenido": "<h2>Abrimos nueva carrera</h2><p>...</p>",
  "categoria_id": 2,
  "imagen_destacada_url": "/uploads/noticias/noticia-nueva.jpg",
  "estado": "borrador"
}
```

> `autor_id` se asigna automáticamente del usuario autenticado.
> Para subir el archivo de imagen primero: `POST /api/noticias/upload-imagen`
> (multipart, campo `imagen`) → devuelve `{ url, filename }`.

**Response (201 Created):** `data` es la noticia creada (con `categoria` y `autor`).

### 3.3 Actualizar / 3.4 Eliminar Noticia

- `PUT /api/noticias/:id` — body con los campos a cambiar (ej. `{ "estado": "publicado" }`).
- `DELETE /api/noticias/:id` — respuesta `{ "success": true, "message": "Noticia eliminada exitosamente" }`.

---

## 4. USUARIOS

### 4.1 Listar Usuarios (Admin)

**Endpoint:** `GET /api/usuarios` · **Headers:** `Authorization: Bearer <token>`

**Response (200 OK)** — `data` es un array:
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Admin",
      "apellido": "Sistema",
      "email": "admin@ifts29.edu.ar",
      "rol": "admin",
      "activo": true,
      "ultimo_acceso": "2026-06-18T15:30:00Z",
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ]
}
```

### 4.2 Crear Usuario (Admin)

**Endpoint:** `POST /api/usuarios`

**Request:**
```json
{
  "nombre": "María",
  "apellido": "López",
  "email": "maria.lopez@ifts29.edu.ar",
  "password": "SeguridadFuerte123!",
  "rol": "tutor"
}
```

**Response (201 Created):** `data` es el usuario creado (sin `password_hash`).

> Activar/desactivar: `PATCH /api/usuarios/:id/toggle-active` (admin).

---

## 5. CONSULTAS DE CONTACTO

### 5.1 Enviar Consulta (Público)

**Endpoint:** `POST /api/consultas` (sin autenticación)

**Request:**
```json
{
  "nombre": "Carlos Martínez",
  "email": "carlos@ejemplo.com",
  "asunto": "Información sobre inscripción",
  "mensaje": "Quisiera saber los requisitos de inscripción para Desarrollo de Software."
}
```

> Campos aceptados: `nombre`, `email`, `asunto`, `mensaje`. **No** hay `telefono`.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Consulta enviada exitosamente",
  "data": {
    "id": 42,
    "nombre": "Carlos Martínez",
    "email": "carlos@ejemplo.com",
    "asunto": "Información sobre inscripción",
    "respondido": false,
    "createdAt": "2026-06-18T18:00:00Z"
  }
}
```

### 5.2 Listar Consultas (Admin)

**Endpoint:** `GET /api/consultas`

**Query Parameters (opcionales):** `respondido` (true/false), `search`, `page`, `limit`.

**Response (200 OK)** — lista **paginada** (`data.data` es el array):
```json
{
  "success": true,
  "message": "Consultas obtenidas exitosamente",
  "data": {
    "data": [
      {
        "id": 42,
        "nombre": "Carlos Martínez",
        "email": "carlos@ejemplo.com",
        "asunto": "Información sobre inscripción",
        "mensaje": "Quisiera saber los requisitos...",
        "respondido": false,
        "respuesta": null,
        "createdAt": "2026-06-18T18:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

> Responder: `PUT /api/consultas/:id` con `{ "respuesta": "...", "respondido": true }`.
> Contador de no leídas: `GET /api/consultas/unread/count` → `data: { count }`.

---

## CÓDIGOS DE ERROR COMUNES

### 400 Bad Request (validación) — `errors` es un array
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    { "type": "field", "path": "email", "msg": "Email inválido" },
    { "type": "field", "path": "password", "msg": "Mínimo 8 caracteres" }
  ]
}
```

### 401 / 403 / 404 / 409 / 500
```json
{ "success": false, "message": "Token inválido o expirado" }
```
```json
{ "success": false, "message": "No tienes permisos para acceder a este recurso" }
```
```json
{ "success": false, "message": "Recurso no encontrado" }
```
```json
{ "success": false, "message": "El email ya está registrado" }
```
```json
{ "success": false, "message": "Error interno del servidor" }
```

---

## EJEMPLOS CON CURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ifts29.edu.ar","password":"admin1234"}'
```

### Listar Noticias
```bash
curl -X GET "http://localhost:3000/api/noticias?page=1&limit=10"
```

### Crear Noticia (requiere token)
```bash
curl -X POST http://localhost:3000/api/noticias \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo":"Mi Noticia",
    "slug":"mi-noticia",
    "contenido":"<p>Contenido...</p>",
    "estado":"borrador"
  }'
```

### Enviar Consulta
```bash
curl -X POST http://localhost:3000/api/consultas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Juan",
    "email":"juan@ejemplo.com",
    "asunto":"Consulta",
    "mensaje":"Mi mensaje"
  }'
```

---

## RATE LIMITING

- **`POST /api/auth/login`**: limitado por `loginLimiter`.
- **Resto de `/api/`**: 100 solicitudes por minuto (ver `app.js`).

Si se excede el límite (429):
```json
{ "success": false, "message": "Demasiadas solicitudes, intente más tarde" }
```
