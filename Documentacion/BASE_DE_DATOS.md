# 🗄️ BASE DE DATOS

**Descripción completa de todas las tablas y relaciones**

> Campos verificados contra los modelos Sequelize en `backend/src/models/*.model.js`.

---

## 📊 Descripción General

El sistema utiliza SQLite en desarrollo y PostgreSQL en producción, administrado con Sequelize ORM.

### Características
- ✅ 14 tablas (modelos en `backend/src/models/`)
- ✅ Soft deletes (`paranoid`) en la mayoría de las tablas — **excepto** `imagenes`, `consultas`, `site_config` y `comision_carrera_materias`
- ✅ Timestamps (`createdAt`/`updatedAt`) en todas las tablas
- ✅ Relaciones N:M vía tablas intermedias
- ✅ Datos iniciales con seeders
- ℹ️ Los "ENUM" se implementan como `STRING` con validación `isIn` (no tipo ENUM nativo)

---

## 📋 Tablas

### 1. User (`users`)
**Usuarios del sistema (admin, profesor, tutor)**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK, autoincrement | Identificador único |
| nombre | STRING | NOT NULL | Nombre del usuario |
| apellido | STRING | NULL | Apellido |
| email | STRING | UNIQUE, NOT NULL, isEmail | Email de login |
| password_hash | STRING | NOT NULL | Contraseña hasheada (bcryptjs) |
| rol | STRING | isIn: admin\|profesor\|tutor (default `profesor`) | Rol del usuario |
| avatar_url | STRING | NULL | URL del avatar |
| activo | BOOLEAN | DEFAULT true | Si está habilitado |
| ultimo_acceso | DATE | NULL | Último login |

*Soft delete (`paranoid`) + timestamps.*

**Relaciones:**
- 1 User (encargado) → N Comisiones (`encargado_id`)
- 1 User (autor) → N Noticias (`autor_id`)

---

### 2. Carrera (`carreras`)
**Programas académicos**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| nombre | STRING | NOT NULL | Nombre carrera |
| slug | STRING | UNIQUE, NOT NULL | URL amigable |
| titulo | STRING | NULL | Título mostrado |
| descripcion | TEXT | NULL | Descripción |
| duracion | INTEGER | NULL | Duración (nº, ej. cuatrimestres) |
| modalidad | STRING | isIn: presencial\|virtual\|hibrida | Tipo de cursada |
| icono | STRING | NULL | Icono |
| color | STRING | NULL | Color (hex) |
| activa | BOOLEAN | DEFAULT true | Si está activa |

*Soft delete (`paranoid`) + timestamps.*

**Relaciones:**
- N:M con Materia (vía CarreraMateria)
- 1 Carrera → N Comisiones

---

### 3. Materia (`materias`)
**Asignaturas/Cursos**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| nombre | STRING | NOT NULL | Nombre materia |
| descripcion | TEXT | NULL | Descripción |

*Soft delete (`paranoid`) + timestamps. El cuatrimestre y la carga horaria viven en CarreraMateria, no acá.*

**Relaciones:**
- N:M con Carrera (vía CarreraMateria)

---

### 4. CarreraMateria (`carrera_materias`)
**Relación N:M entre Carrera y Materia (plan de estudios)**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INTEGER | PK |
| carrera_id | INTEGER | FK → Carrera, NOT NULL |
| materia_id | INTEGER | FK → Materia, NOT NULL |
| cuatrimestre | INTEGER | NULL |
| carga_horaria_semanal | INTEGER | NULL |

*Índice único: (`carrera_id`, `materia_id`). Soft delete + timestamps.*

---

### 5. Comisión (`comisiones`)
**Grupos/Secciones de estudiantes**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| carrera_id | INTEGER | FK → Carrera, NOT NULL | Carrera |
| nombre | STRING(20) | NOT NULL, len 1-20 | Nombre comisión (ej. "1A") |
| anio_lectivo | INTEGER | NOT NULL (default año actual) | Año lectivo |
| semestre | INTEGER | NOT NULL, 1-2 (default 1) | Semestre |
| encargado_id | INTEGER | FK → User, NULL | Profesor/tutor a cargo |
| activo | BOOLEAN | DEFAULT true | Si está activa |

*Índice único: (`carrera_id`, `nombre`, `anio_lectivo`, `semestre`). Soft delete + timestamps.*

**Relaciones:**
- belongsTo Carrera, belongsTo User (encargado)
- 1 Comisión → N Horarios
- N:M con CarreraMateria (vía ComisionCarreraMateria)

---

### 6. ComisionCarreraMateria (`comision_carrera_materias`)
**Materias asignadas a una comisión (tabla intermedia pura)**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INTEGER | PK |
| comision_id | INTEGER | FK → Comision |
| carrera_materia_id | INTEGER | FK → CarreraMateria |

*Índice único: (`comision_id`, `carrera_materia_id`). Solo timestamps (sin soft delete). No tiene `profesor_id`.*

---

### 7. Horario (`horarios`)
**Cronograma de clases**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| carrera_materia_id | INTEGER | FK → CarreraMateria, NOT NULL | Materia del plan |
| comision_id | INTEGER | FK → Comision, NOT NULL | Comisión |
| dia | STRING | isIn: Lunes…Domingo (capitalizado) | Día |
| horario | STRING | NOT NULL | Franja horaria (ej. "18:00-22:00") |
| aula | STRING | NOT NULL | Aula/Sala |
| profesor | STRING | NULL | Nombre del profesor |
| activo | BOOLEAN | DEFAULT true | Si está activo |

*Soft delete (`paranoid`) + timestamps.*

**Relaciones:**
- belongsTo CarreraMateria (alias `carreraMateria`), belongsTo Comision (alias `comisionInfo`)

---

### 8. Noticia (`noticias`)
**Artículos publicados**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| titulo | STRING | NOT NULL | Título |
| slug | STRING | UNIQUE, NOT NULL | URL amigable |
| contenido | TEXT | NULL | Contenido |
| imagen_destacada_url | STRING | NULL | URL de imagen destacada |
| categoria_id | INTEGER | FK → Categoria, NULL | Categoría |
| autor_id | INTEGER | FK → User, NOT NULL | Autor |
| estado | STRING | isIn: borrador\|publicado\|archivado (default `borrador`) | Estado |
| fecha_publicacion | DATE | NULL | Fecha publicación |

*Soft delete (`paranoid`) + timestamps.*

**Estados:**
- `borrador`: No visible
- `publicado`: Visible en sitio
- `archivado`: Oculta pero existe

**Relaciones:**
- belongsTo Categoria (alias `categoria`), belongsTo User (alias `autor`)

---

### 9. Categoria (`categorias`)
**Categorías de noticias**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INTEGER | PK |
| nombre | STRING | NOT NULL |
| slug | STRING | UNIQUE, NOT NULL |
| color | STRING | NULL |

*Soft delete (`paranoid`) + timestamps.*

---

### 10. Evento (`eventos`)
**Eventos institucionales**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| nombre | STRING | NOT NULL | Nombre del evento |
| descripcion | TEXT | NULL | Descripción |
| fecha | DATEONLY | NOT NULL | Fecha del evento |
| ubicacion | STRING | NULL | Dónde |
| estado | STRING | isIn: pendiente\|confirmado\|finalizado\|cancelado (default `pendiente`) | Estado |

*Soft delete (`paranoid`) + timestamps.*

---

### 11. Testimonio (`testimonios`)
**Testimonios de estudiantes**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INTEGER | PK |
| autor_nombre | STRING | NOT NULL |
| autor_carrera | STRING | NULL |
| texto | TEXT | NOT NULL |
| visible | BOOLEAN | DEFAULT true |

*Soft delete (`paranoid`) + timestamps.*

---

### 12. Imagen (`imagenes`)
**Galería de imágenes**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| titulo | STRING | NULL | Título |
| url | STRING | NOT NULL | URL pública (`/uploads/...`) |
| alt_text | STRING | NULL | Texto alternativo |
| categoria | STRING | NULL | Categoría/álbum |
| entidad_id | INTEGER | NULL | Entidad asociada (opcional) |

*Solo timestamps (sin soft delete).*

**Restricciones de subida (multer):**
- Formatos de imagen; máximo configurable vía `MAX_FILE_SIZE` (default 20 MB)
- Los archivos se guardan en `UPLOAD_DIR` y se sirven en `/uploads`

---

### 13. Consulta (`consultas`)
**Mensajes de contacto**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Identificador |
| nombre | STRING | NOT NULL | Nombre remitente |
| email | STRING | NOT NULL, isEmail | Email |
| asunto | STRING | NOT NULL | Asunto |
| mensaje | TEXT | NOT NULL | Mensaje |
| respondido | BOOLEAN | DEFAULT false | Si fue respondida |
| respuesta | TEXT | NULL | Respuesta enviada |

*Solo timestamps (sin soft delete). No tiene `telefono`, `leida` ni `estado`.*

---

### 14. SiteConfig (`site_config`)
**Configuración global del sitio (fila única)**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PK | Siempre 1 |
| site_name | STRING | NOT NULL (default `IFTS 29`) | Nombre del sitio |
| site_subtitle | STRING | NULL (default `Nueva Web`) | Subtítulo |
| contact_email | STRING | NULL, isEmail | Email de contacto |
| contact_phone | STRING | NULL | Teléfono |
| address | STRING | NULL | Dirección |
| seo_description | TEXT | NULL | Meta descripción SEO |
| footer_text | STRING | NULL | Texto del footer |
| colors | JSON | default `{}` | Paleta de colores |
| layout | JSON | default `{}` | Configuración de layout |
| sections | JSON | default `[]` | Secciones (orden/visibilidad) |
| typography | JSON | default `{}` | Tipografía |
| theme_preset | STRING | NULL (default `default`) | Preset de tema |
| social_links | JSON | default `{}` | Redes sociales |

*Solo timestamps (sin soft delete).*

---

## 🔗 Diagrama de Relaciones

```
User (1) ──→ (N) Comision   (encargado_id)
User (1) ──→ (N) Noticia    (autor_id)

Carrera (1) ──→ (N) Comision
Carrera (N) ←──→ (N) Materia            [CarreraMateria]

Comision (1) ──→ (N) Horario
Comision (N) ←──→ (N) CarreraMateria    [ComisionCarreraMateria]

CarreraMateria (1) ──→ (N) Horario

Categoria (1) ──→ (N) Noticia
```

---

## 🌱 Seeders (Datos Iniciales)

Los seeders están en `backend/src/seeders/` y se ejecutan con `make seed-dev`
(o `npx sequelize-cli db:seed:all` dentro del contenedor). Cargan usuarios
(admin/profesor/tutor), carreras, materias, categorías, noticias, eventos,
comisiones, horarios y la configuración inicial del sitio.

> Las migraciones corren automáticamente al levantar el backend (ver Dockerfile);
> los seeders se ejecutan aparte con el target de Makefile correspondiente. (Prod)

---

## 🔒 Características de Seguridad

### Soft Deletes
- Las tablas con `paranoid: true` marcan registros como eliminados (`deletedAt`) en vez de borrarlos.
- No aplica a `imagenes`, `consultas`, `site_config` ni `comision_carrera_materias`.

### Validaciones
- Campos UNIQUE: `email` (users), `slug` (carreras/noticias/categorias)
- NOT NULL en campos obligatorios
- `isIn` para valores restringidos (rol, modalidad, estado, dia)
- Foreign Keys para integridad referencial

### Encriptación
- Contraseñas con bcryptjs (nunca en texto plano), almacenadas en `password_hash`

---

## 📈 Migraciones

```bash
# Ver migraciones
ls backend/src/migrations/

# Ejecutar (dev)
make migrate-dev

# Dentro del contenedor
npx sequelize-cli db:migrate
```

---

## 🔍 Ver Datos en Desarrollo

El archivo de la BD (SQLite) está en:
```
./data/dev.sqlite
```

Puedes abrirlo con:
- **SQLite Browser** (app)
- **VS Code extension** SQLite
- **Comando:** `sqlite3 data/dev.sqlite`

---

## 📚 Ver También

- [ARQUITECTURA.md](./ARQUITECTURA.md)
- [EJEMPLOS_API_REST.md](./EJEMPLOS_API_REST.md)
- [VALIDACIONES.md](./VALIDACIONES.md)
