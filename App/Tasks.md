# Tareas - IFTS 29 Nueva Web

## Asignación del Equipo
| Rol | Miembro |
|-----|---------|
| Frontend | FE Dev 1 Lucas|
| Frontend | FE Dev 2 Andres|
| Backend | BE Dev 1 (SL) |
| Backend | BE Dev 2 |

## Notas de Desacoplamiento
- Los módulos de backend están agrupados por modelos/características autocontenidas con dependencias cruzadas mínimas
- Los módulos de frontend pueden usar datos simulados (mock) para trabajar independientemente del progreso del backend
- Las dependencias explícitas se listan por módulo para evitar bloqueos

---

## Módulos de Backend

### BE Dev 1 (SL): Fundación y Modelos Core
#### Módulo 1: Configuración Base y Usuario/Auth
**Tareas:**
- [x] Implementar modelo User (id, nombre, apellido, email, password_hash, rol, avatar_url, activo, ultimo_acceso)
- [x] Crear migración de users
- [x] Crear seeder de usuario admin (admin@ifts29.edu.ar / admin1234)
- [x] Implementar JWT auth (generación y verificación de tokens)
- [x] Middleware de autenticación (validación JWT)
- [x] Middleware de roles (RBAC: admin/profesor/tutor)
- [x] Controlador de auth (login, register, refresh token)
- [x] Rutas de auth (POST /api/auth/login, /register, /refresh)
- [x] Validadores de auth (email, password, rol)
- [x] Middleware global de manejo de errores
- [x] Configuración base de multer para uploads

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 1

#### Módulo 2: Carreras y Materias
**Tareas:**
- [x] Implementar modelo Carrera (id, nombre, slug, descripcion, duracion, modalidad, icono, color, activa)
- [x] Implementar modelo Materia (id, nombre, carrera_id, cuatrimestre, carga_horaria_semanal, descripcion)
- [x] Crear migración de carreras
- [x] Crear migración de materias
- [x] Seeder de carreras de ejemplo
- [x] Controlador de Carrera (CRUD, filtrar por modalidad/estado)
- [x] Controlador de Materia (CRUD, filtrar por carrera)
- [x] Rutas de Carrera (GET/POST/PUT/DELETE /api/carreras)
- [x] Rutas de Materia (GET/POST/PUT/DELETE /api/materias)
- [x] Validadores de Carrera y Materia

**Dependencias:** Ninguna (Materia solo referencia a Carrera dentro de este módulo)
**Contraparte FE:** Módulo FE 2

#### Módulo 3: Gestión de Usuarios
**Tareas:**
- [x] Controlador de User (CRUD, asignación de roles)
- [x] Rutas de User (GET/POST/PUT/DELETE /api/usuarios)
- [x] Validadores de usuarios

**Dependencias:** Modelo User (Módulo BE 1)
**Contraparte FE:** Módulo FE 4

#### Módulo 7: Configuración del Sitio y Estadísticas
**Tareas:**
- [x] Implementar modelo SiteConfig (id, site_name, site_subtitle, contact_email, contact_phone, address, seo_description, footer_text, colors, layout, sections, typography, theme_preset)
- [x] Crear migración de site-config
- [x] Seeder de configuración por defecto del sitio
- [x] Controlador de SiteConfig (GET/PUT /api/config) + rutas y servicios
- [x] Controlador de Stats (contadores para dashboard: usuarios, noticias, eventos) + rutas y servicios
- [x] Rutas de SiteConfig (GET/PUT /api/config)
- [x] Rutas de Stats (GET /api/stats)
- [x] Validadores de SiteConfig

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 5

#### Módulo 8: Consultas / Contactos
**Tareas:**
- [x] Implementar modelo Consulta (id, nombre, email, asunto, mensaje, respondido, respuesta, created_at, updated_at)
- [x] Crear migración de consultas
- [x] Controlador/Servicios de Consultas:
  - POST /api/consultas (público, con rate limit)
  - GET /api/consultas (auth, listado con paginación y filtros)
  - GET /api/consultas/:id (auth, detalle)
  - PUT /api/consultas/:id (auth, responder/marcar como leída)
  - DELETE /api/consultas/:id (admin, eliminar)
- [x] Rate limit específico para POST /api/consultas (ej: 5/min por IP)
- [x] Validadores de Consulta (nombre, email, asunto, mensaje)
- [x] Tests de integración para todos los endpoints
- [x] Registrar rutas en src/routes/index.js

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 6

#### Módulo 9: Horarios
**Tareas:**
- [x] Implementar modelo Horario (id, materia_id, dia, horario, aula, profesor, activo)
- [x] Crear migración de horarios
- [x] Seeder de horarios de ejemplo
- [x] Controlador de Horario (CRUD, filtrar por materia_id/dia)
- [x] Rutas de Horario (GET/POST/PUT/DELETE /api/horarios)
- [x] Validadores de Horario
- [x] Tests de integración para todos los endpoints
- [x] Registrar rutas en src/routes/index.js

**Dependencias:** Modelo Materia (Módulo BE 2)
**Contraparte FE:** Módulo FE 2

#### Módulo 10: Unit Tests — Auth Core (Utils + Services)
**Tareas:**
- [x] Crear carpeta `tests/unit/mocks/` con mocks compartidos de Sequelize (modelos, Op, sequelize instance)
- [x] Test `AppError.js`: cada subclase tiene status code correcto (400/401/403/404/409), instanceof AppError, mensaje por defecto vs custom
- [x] Test `token.js`: generateToken genera string válido, verifyToken retorna payload o lanza error, decodeToken retorna payload o null
- [x] Test `auth.services.js`: register hashea password y genera token, login verifica credentials y actualiza ultimo_acceso, rechaza email duplicado, refreshToken valida token, hashPassword retorna hash

**Dependencias:** Ninguna
**Directorio:** `tests/unit/utils/` + `tests/unit/services/` + `tests/unit/mocks/`

#### Módulo 11: Unit Tests — Async Handler y User (Utils + Services)
**Tareas:**
- [x] Test `asyncHandler.js`: éxito retorna resultado, rechazo llama next(error)
- [x] Test `user.services.js`: create hashea password y excluye password_hash del retorno, rechaza email duplicado, toggleActive cambia estado, getAll filtra por rol

**Dependencias:** Módulo 10 (mocks compartidos)
**Directorio:** `tests/unit/utils/` + `tests/unit/services/`

#### Módulo 12: Unit Tests — Error Handling y Response (Utils)
**Tareas:**
- [x] Test `dbErrorHandler.js`: SequelizeUniqueConstraintError → ConflictError(409), SequelizeValidationError → BadRequestError(400), SequelizeForeignKeyConstraintError → BadRequestError(400), SequelizeEmptyResultError → NotFoundError(404), AppError se re-lanza, error desconocido se re-lanza
- [x] Test `response.js`: success/created/deleted/noContent/badRequest/unauthorized/forbidden/notFound/conflict/validationError/tooManyRequests/serverError retornan status y JSON correctos, badRequest incluye/excluye errors condicionalmente

**Dependencias:** Módulo 10 (AppError para dbErrorHandler)
**Directorio:** `tests/unit/utils/`

#### Módulo 13: Unit Tests — Carreras y Materias (Services)
**Tareas:**
- [x] Test `carrera.services.js`: create genera slug único, rechaza slug duplicado, remove bloquea si tiene materias asociadas (cascade protection), getAll filtra por modalidad/activa
- [x] Test `materia.services.js`: create valida que carrera_id existe (FK), getAll filtra por carrera_id/cuatrimestre, eager-load de carrera en getById

**Dependencias:** Módulo 10 (mocks compartidos)
**Directorio:** `tests/unit/services/`

#### Módulo 14: Unit Tests — Contenido (Services)
**Tareas:**
- [x] Test `noticia.services.js`: getAll con paginación (page/limit/totalPages), búsqueda por titulo/contenido con Op.or, create valida FK de categoria_id y autor_id, slug único en create/update
- [x] Test `categoria.services.js`: create genera slug único, rechaza slug duplicado, getAll retorna todas las categorías

**Dependencias:** Módulo 10 (mocks compartidos)
**Directorio:** `tests/unit/services/`

#### Módulo 15: Unit Tests — Eventos y Testimonios (Services)
**Tareas:**
- [x] Test `evento.services.js`: getAll con filtros fecha_desde/fecha_hasta (Op.gte/Op.lte), filtro por estado, nombre único en update
- [x] Test `testimonio.services.js`: getAll con filtro visible, create retorna testimonio con visible=true por defecto

**Dependencias:** Módulo 10 (mocks compartidos)
**Directorio:** `tests/unit/services/`

#### Módulo 16: Unit Tests — Horarios, Consultas, Imágenes (Services)
**Tareas:**
- [x] Test `horario.services.js`: create valida que materia_id existe, eager-load de materia en getById, filtro por materia_id/comision/dia
- [x] Test `consulta.services.js`: getUnreadCount retorna conteo correcto, búsqueda por nombre/email/asunto con Op.or, paginación
- [x] Test `imagen.services.js`: create valida URL única, update rechaza URL duplicada, filtro por categoria/entidad_id

**Dependencias:** Módulo 10 (mocks compartidos)
**Directorio:** `tests/unit/services/`

#### Módulo 17: Unit Tests — Stats y Config (Services)
**Tareas:**
- [x] Test `stats.services.js`: getDashboardStats retorna conteos correctos (carreras activas, materias, staff)
- [x] Test `siteconfig.services.js`: getConfig crea registro default si no existe, updateConfig upsert correctamente

**Dependencias:** Módulo 10 (mocks compartidos)
**Directorio:** `tests/unit/services/`

---

### BE Dev 2: Modelos de Contenido
#### Módulo 4: Categorías y Noticias
**Tareas:**
- [X] Implementar modelo Categoria (id, nombre, slug, color)
- [X] Implementar modelo Noticia (id, titulo, slug, contenido, imagen_destacada_url, categoria_id, autor_id, estado, fecha_publicacion)
- [X] Crear migración de categorias
- [X] Crear migración de noticias
- [X] Seeder de categorías de ejemplo
- [X] Seeder de noticias de ejemplo
- [X] Controlador de Categoria (CRUD)
- [X] Controlador de Noticia (CRUD, filtrar por categoría/estado/fecha, paginación, búsqueda)
- [X] Rutas de Categoria (GET/POST/PUT/DELETE /api/categorias)
- [X] Rutas de Noticia (GET/POST/PUT/DELETE /api/noticias)
- [X] Validadores de Categoria y Noticia
- [X] Upload de imágenes para noticias destacadas

**Dependencias:** Modelo User (Módulo BE 1), Categoria (mismo módulo)
**Contraparte FE:** Módulo FE 3

#### Módulo 5: Eventos y Testimonios
**Tareas:**
- [x] Implementar modelo Evento (id, nombre, descripcion, fecha, ubicacion, estado)
- [x] Implementar modelo Testimonio (id, autor_nombre, autor_carrera, texto, visible)
- [x] Crear migración de eventos
- [x] Crear migración de testimonios
- [x] Seeder de eventos de ejemplo
- [x] Seeder de testimonios de ejemplo
- [x] Controlador de Evento (CRUD, filtrar por estado/fecha)
- [x] Controlador de Testimonio (CRUD, toggle visibilidad)
- [x] Rutas de Evento (GET/POST/PUT/DELETE /api/eventos)
- [x] Rutas de Testimonio (GET/POST/PUT/DELETE /api/testimonios)
- [x] Validadores de Evento y Testimonio

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 4

#### Módulo 6: Galería
**Tareas:**
- [ ] Implementar modelo Imagen (id, url, alt_text, categoria, entidad_id)
- [ ] Crear migración de imagenes
- [ ] Controlador de Galería (upload, listar, eliminar imágenes, filtrar por categoría/entidad)
- [ ] Rutas de Galería (GET/POST/DELETE /api/imagenes)
- [ ] Validadores de Galería
- [ ] Upload de imágenes para galería

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 4

---

## Módulos de Frontend

### FE Dev 1: Sitio Público y Fundación
#### Módulo 1: Fundación y Autenticación
**Tareas:**
- [x] Configurar React Router (todas las rutas públicas/admin)
- [x] Crear capa de servicios API (axios con interceptores)
- [x] Implementar AuthContext, ThemeContext
- [x] Implementar LayoutContext, ToastContext
- [x] Crear authStore, uiStore
- [x] Construir sistema de diseño UI: Button, Input, Select, Textarea, Card, Badge
- [x] Construir sistema de diseño UI: Modal, Table, Pagination, Toggle, Toast, Skeleton, EmptyState
- [x] Construir PublicLayout (Navbar, Footer, MobileMenu)
- [x] Construir LoginPage
- [x] Construir AdminLayout (AdminSidebar, AdminTopbar, Breadcrumbs)

**Dependencias:** Puede usar datos mock de auth hasta que el Módulo BE 1 esté listo

#### Módulo 2: Inicio y Carreras Públicas
**Tareas:**
- [x] Construir HomePage (Hero, Stats, CareerCards, NewsSection, TestimonialsCarousel)
- [x] Construir CarrerasPage (listado)
- [x] Construir CarreraDetailPage (CareerTabs: descripción, plan de estudios, requisitos, horarios)
- [x] Construir componentes: CareerCards, CareerCard, StatItem, Hero, TestimonialsCarousel
- [x] Construir componente HorariosTable
- [x] Implementar carrerasStore

**Dependencias:** Puede usar datos mock de carreras hasta que el Módulo BE 2 esté listo
**Contraparte BE:** Módulo BE 2

#### Módulo 3: Noticias y Contacto Público
**Tareas:**
- [x] Construir NoticiasPage (listado con filtros, búsqueda, paginación)
- [x] Construir NoticiaDetailPage
- [x] Construir componentes: NewsCard, NewsSidebar
- [x] Construir ContactoPage, ContactForm
- [x] Construir EstudiantesPage, QuickLinks
- [x] Implementar noticiasStore
- [x] Agregar imagen de fondo `carrera1.png` en portada de CarrerasPage
- [x] Agregar imagen de fondo `noticia1.png` en portada y cards de NoticiasPage
- [x] Agregar imagen de fondo `estudiantes1.png` en portada de EstudiantesPage
- [x] Agregar imagen de fondo `contac.png` en portada de ContactoPage
- [x] Crear EventosSection + EventosCard (carrusel en Home)
- [x] Crear eventosService.js con fallback a mock
- [x] Conectar EventosSection en HomePage

**Dependencias:** Puede usar datos mock de noticias hasta que el Módulo BE 4 esté listo
**Contraparte BE:** Módulo BE 4

---

### FE Dev 2: Páginas de Admin y Personalización
#### Módulo 4: Gestión de Contenido Admin
**Tareas:**
- [x] Construir DashboardPage (StatCards, ActivityFeed, QuickActions)
- [x] Construir Admin NoticiasPage + NoticiaFormModal (editor TipTap)
- [x] Construir Admin EventosPage + EventoFormModal
- [x] Construir Admin TestimoniosPage + TestimonioFormModal
- [x] Construir GaleriaPage + ImageUploadModal (drag & drop)
- [x] Construir UsuariosPage + UsuarioFormModal
- [x] Construir DataTable
- [x] Construir ImageUploader
- [x] Construir RichEditor
- [x] Construir UserAvatar
- [x] Implementar eventosStore
- [x] Implementar testimoniosStore
- [x] Implementar galeriaStore
- [x] Implementar usuariosStore

**Dependencias:** Puede usar datos mock hasta que los Módulos BE 4,5,6 estén listos
**Contraparte BE:** Módulos BE 4,5,6

#### Módulo 5: Personalización y Configuración del Sitio
**Tareas:**
- [x] Construir PersonalizarPage (ColorConfig, ThemePresets, LayoutSelector, SectionsConfig con drag & drop, TypographyConfig, PreviewPanel)
- [x] Construir ThemePresets
- [x] Construir AjustesPage (GeneralSettings, SEOSettings, SocialSettings)
- [x] Implementar siteConfigStore
- [x] Construir ColorPicker
- [x] Construir SectionManager
- [x] Construir DraggableSection

**Dependencias:** Módulo BE 3 (Site Config)
**Contraparte BE:** Módulo BE 3

#### Módulo 6: Gestión de Consultas (Admin)
**Tareas:**
- [x] Construir ConsultasPage (listado con DataTable, filtros por estado/fecha)
- [x] Construir ConsultaDetailModal (ver mensaje, campo de respuesta, marcar como leída)
- [x] Implementar consultasStore (listar, responder, eliminar)
- [x] Agregar badge de notificación en AdminTopbar (count de mensajes sin leer)
- [x] Agregar ruta /admin/consultas en AppRouter

**Dependencias:** Módulo BE 8
**Contraparte BE:** Módulo BE 8

---

## Guía de Ejecución en Paralelo
| Módulo | Puede Comenzar Con | Bloqueado Por |
|--------|-------------------|---------------|
| BE 1 | BE 4, FE 1 | Ninguno |
| BE 2 | BE 5, FE 2 | Ninguno |
| BE 3 | BE 4, FE 4 | BE 1 |
| BE 4 | BE 7, FE 5 | Ninguno |
| BE 5 | BE 3, FE 3 | BE 1 |
| BE 6 | BE 4, FE 4 | Ninguno |
| BE 7 | BE 6, FE 4 | Ninguno |
| BE 8 | FE 6 | Ninguno |
| FE 1 | BE 1, FE 4 | Ninguno (usar mocks) |
| FE 2 | BE 2, FE 3 | Ninguno (usar mocks) |
| FE 3 | BE 4, FE 2 | Ninguno (usar mocks) |
| FE 4 | BE 3, BE 5, BE 6, BE 7, FE 5 | Ninguno (usar mocks) |
| FE 5 | BE 7, FE 4 | BE 4 |
| FE 6 | BE 8 | Módulo BE 8 |
