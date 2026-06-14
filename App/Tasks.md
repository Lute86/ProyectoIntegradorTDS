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

#### Módulo 12: Refactorización Carrera-Materia (Tabla Intermedia)
**Tareas:**
- [x] Crear modelo CarreraMateria (carreraMateria.model.js)
- [x] Crear migración para tabla intermedia y modificar horarios/materias
- [x] Crear servicio CarreraMateria (sub-resource de carrera)
- [x] Crear controlador CarreraMateria
- [x] Crear validador CarreraMateria
- [x] Crear rutas CarreraMateria (GET/POST/PUT/DELETE /api/carreras/:carreraId/materias)
- [x] Actualizar materia.model.js (quitar carrera_id, cuatrimestre, carga_horaria)
- [x] Actualizar horario.model.js (materia_id → carrera_materia_id)
- [x] Actualizar carrera.model.js (asociación con CarreraMateria)
- [x] Actualizar services: materia, horario, carrera, stats
- [x] Actualizar controllers: materia, horario
- [x] Actualizar validators: materia, horario
- [x] Crear seeder 08-carreraMateria-seeder.js
- [x] Actualizar seeders 06 y 07
- [x] Actualizar tests unitarios existentes (materia, horario, carrera, stats)
- [x] Crear tests unitarios de carreraMateria.services
- [x] Crear tests de integración carreraMateria.test.js
- [x] Documentación PR

**Dependencias:** Módulo BE 2 (Carreras y Materias), Módulo BE 9 (Horarios)
**Contraparte FE:** Módulo FE 2

**Descripción:** Se refactoriza el modelo de datos para permitir que una materia pertenezca a múltiples carreras con cuatrimestre y carga horaria independientes. Se crea una tabla intermedia `carrera_materias` que conecta Carrera con Materia (relación M:N). Los horarios ahora referencian la asignación carrera-materia en vez de la materia directamente.

#### Módulo 15: Comisiones
**Tareas:**
- [x] Implementar modelo Comision (id, carrera_materia_id, nombre, anio_lectivo, semestre, encargado_id, activo, timestamps, paranoid)
- [x] Crear migración de comisiones (14-create-comisiones-table.js)
- [x] Crear migración que agrega comision_id FK a horarios y elimina columna string (15-add-comision-id-to-horarios.js)
- [x] Registrar modelo Comision en models/index.js
- [x] Crear validadores comision.validator.js (create, update, idParam)
- [x] Implementar servicio comision.services.js (getAll con filtros, getById, create, update, remove)
- [x] Implementar controlador comision.controller.js (CRUD HTTP)
- [x] Crear rutas comision.routes.js (GET público, POST/PUT/DELETE admin)
- [x] Registrar rutas en routes/index.js (/api/comisiones)
- [x] Crear seeder 09-comision-seeder.js
- [x] Crear tests de integración comision.test.js (27 tests)
- [x] Documentación PR (docs/PR-BE1Module15.md) con breaking changes y guía frontend

**Dependencias:** Módulo BE 12 (CarreraMateria), Módulo BE 9 (Horarios)
**Contraparte FE:** Módulo FE 2

**Descripción:** Se crea el módulo de Comisiones como entidad independiente para gestionar comisiones de forma flexibles (nombres con letras, números o mixtos, encargado opcional). Se reemplaza el campo string `comision` en horarios por una FK `comision_id` que referencia la tabla `comisiones`. Esto permite un CRUD de comisiones independiente y filtrado de horarios por comisión. Breaking change en la API de horarios: el campo `comision` (string) se reemplaza por `comision_id` (integer) y `comisionInfo` (objeto con datos de la comisión).

#### Módulo 16: Refactor Comisiones — N:M con CarreraMaterias
**Tareas:**
- [x] Crear migración 16-refactor-comisiones-many-materias.js (add carrera_id, drop carrera_materia_id, create junction table, migrate data)
- [x] Crear modelo comisionCarreraMateria.model.js
- [x] Actualizar comision.model.js (add carrera_id, belongsToMany CarreraMateria, remove single FK)
- [x] Registrar nuevo modelo en models/index.js
- [x] Actualizar comision.services.js (create/update/getAll/getAll con N:M)
- [x] Actualizar comision.validator.js (carrera_id required, carrera_materias_ids optional array)
- [x] Actualizar comision.controller.js (remove carrera_materia_id filter, add carrera_id direct filter)
- [x] Actualizar comision.routes.js (add POST /:id/materias, DELETE /:id/materias/:cmId)
- [x] Actualizar horario.services.js (validate comision+carrera_materia pair exists in junction)
- [x] Actualizar tests comision.test.js
- [x] Actualizar tests horario.test.js
- [x] Documentación PR (docs/PR-BE1Module16.md) con breaking changes y guía frontend

**Dependencias:** Módulo BE 12 (CarreraMateria), Módulo BE 15 (Comisiones)
**Contraparte FE:** Pendiente

**Descripción:** Se refactoriza el módulo de Comisiones para permitir que una comisión tenga múltiples materias. Se elimina la FK directa `carrera_materia_id` y se crea una tabla intermedia `comision_carrera_materias` (N:M). Se agrega `carrera_id` a comisiones para scopear por carrera. Una comisión puede crearse sin materias y asignarlas después. Breaking change en la API de comisiones: `carrera_materia_id` se reemplaza por `carrera_id` + `carrera_materias_ids`.

#### Módulo 13: Configuración Backend Producción
**Tareas:**
- [x] Habilitar SSL en PostgreSQL para producción (database.js)
- [x] Crear archivo .env.prod (template de variables de entorno — commiteado)
- [x] Limpiar variable CORS no utilizada en .env, reemplazar por FRONTEND_URL
- [x] Health check `/api/health` valida conexión a DB con `sequelize.authenticate()`
- [x] Crear Dockerfile.frontend (nginx:alpine) y Dockerfile.backend (Node 22 Alpine)
- [x] Crear configuraciones nginx: ssl.conf, frontend.conf, backend.conf
- [x] Crear docker-compose.yml para producción (PostgreSQL + Node + Nginx HTTPS)
- [x] Crear scripts: generate-secrets.sh, generate-ssl.sh
- [x] Agregar security headers en nginx (HSTS, CSP, X-Frame-Options, etc.)
- [x] HTTP→HTTPS redirect en nginx
- [x] Frontend API URL usa window.location.origin (dev y prod)
- [x] Agregar targets Makefile: prod-first, prod, prod-down, prod-reset, setup-prod, ssl-selfsigned
- [x] Documentación PR

**Dependencias:** Ninguna
**Contraparte FE:** Ninguna

**Descripción:** Stack de producción completo: Dockerfiles multi-stage optimizados, nginx con TLS 1.2/1.3 y security headers, PostgreSQL con healthchecks, scripts de generación de secrets y certificados SSL, y despliegue con un solo comando (`make prod-first`). `.env.prod` es el template commiteado; `.env` se genera automáticamente con secrets aleatorios.

#### Módulo 14: Seguridad Backend
**Tareas:**
- [x] Eliminar fallback hardcoded de JWT_SECRET (crash si falta env var) — CRIT-01
- [x] Eliminar ruta pública POST /api/auth/register — CRIT-02
- [x] Eliminar handler, servicio y validator de registro — CRIT-02
- [x] Cambiar CORS fallback de '*' a 'https://localhost' — HIGH-02
- [x] Generar passwords aleatorios en seeder con crypto.randomBytes — HIGH-04
- [x] Reducir rate limit global de 200 a 100 req/min — MED-01
- [x] Agregar loginLimiter (10 intentos/15min) — MED-01
- [x] Eliminar envío de stack traces al cliente — MED-03
- [x] Aumentar mínimo de contraseña de 6 a 8 caracteres — MED-07
- [x] Crear tests/helpers.js con createUser, generateToken, createAndLogin
- [x] Refactorizar 13 archivos de test de integración (reemplazar register → createAndLogin)
- [x] Actualizar auth.test.js y auth.services.test.js
- [x] Documentación PR

**Dependencias:** Ninguna
**Contraparte FE:** Ninguna

**Descripción:** Correcciones de seguridad críticas y medias al backend basadas en el security audit del 2026-06-08. Se eliminan vulnerabilidades de autenticación (JWT fallback, registro público), se endurece la configuración (CORS, rate limiting, passwords), y se refactorizan todos los tests de integración para usar un helper compartido en vez del endpoint de registro eliminado. 480 tests pasan (33 suites).

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

#### Módulo 10: Unit Tests — Utils
- [x] Mocks compartidos de Sequelize
- [x] Tests de AppError
- [x] Tests de token
- [x] Tests de asyncHandler
- [x] Tests de dbErrorHandler
- [x] Tests de response

#### Módulo 11: Unit Tests — Services
- [x] Tests de auth.services
- [x] Tests de user.services
- [x] Tests de carrera.services
- [x] Tests de materia.services
- [x] Tests de noticia.services
- [x] Tests de categoria.services
- [x] Tests de evento.services
- [x] Tests de testimonio.services
- [x] Tests de horario.services
- [x] Tests de consulta.services
- [x] Tests de imagen.services
- [x] Tests de stats.services
- [x] Tests de siteconfig.services

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
- [x] Post-FE7: Select/Select.jsx — dark: variants agregadas
- [x] Post-FE7: Footer.jsx — style={{ color }} → clases Tailwind

**Dependencias:** Puede usar datos mock de auth hasta que el Módulo BE 1 esté listo

#### Módulo 2: Inicio y Carreras Públicas
**Tareas:**
- [x] Construir HomePage (Hero, Stats, CareerCards, NewsSection, TestimonialsCarousel)
- [x] Construir CarrerasPage (listado)
- [x] Construir CarreraDetailPage (CareerTabs: descripción, plan de estudios, requisitos, horarios)
- [x] Construir componentes: CareerCards, CareerCard, StatItem, Hero, TestimonialsCarousel
- [x] Construir componente HorariosTable
- [x] Implementar carrerasStore
- [x] Rediseno cards de carreras: titulo en header con color de fondo
- [x] Post-FE7: Hero overlay bg-surface/50 → bg-black/40 en CarrerasPage y CarreraDetailPage
- [x] Post-FE7: CarreraDetailPage bg-slate-50 → bg-site-bg
- [x] Post-FE7: CareerCarousel gradiente light mode → bg-site-bg
- [x] Post-FE7: Carruseles modo claro — botones/dots en CareerCarousel, NewsSection, TestimonialsCarousel
- [x] Post-FE7: Layout boxed/full-width en CarrerasPage y CarreraDetailPage

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
- [x] Agregar imagenes de fondo a las distintas secciones
- [x] Crear EventosSection + EventosCard (carrusel en Home)
- [x] Crear eventosService.js con fallback a mock
- [x] Conectar EventosSection en HomePage
- [x] Fix guardado batch de horarios: guardado secuencial, preservar datos en fallos, notificacion local
- [x] NoticiasPage: reemplazar placeholder NOT por icono SVG de categoria
- [x] Horarios: agregar opcion "Todas" en comisiones + filtro por cuatrimestre en CarreraDetailPage y EstudiantesPage
- [x] Eventos: EventosSection siempre visible en Home (titulo + mensaje si vacio)
- [x] Eventos: EventosCard adaptado a campos dual mock/API
- [x] EventosPage: campos adaptados, descripcion truncada a 2 lineas, card clickeable abre modal
- [x] EventoDetailModal: nuevo componente modal flotante con info completa del evento
- [x] Post-FE7: Dropdowns dark mode — EstudiantesPage <select> dark:bg-slate-800
- [x] Post-FE7: Hero overlay bg-surface/50 → bg-black/40 en NoticiasPage, EventosPage, EstudiantesPage
- [x] Post-FE7: text-slate-500/600/700 → text-body y bg-slate-50 → bg-site-bg en paginas publicas
- [x] Post-FE7: NoticiasPage overflow-x-hidden removido
- [x] Post-FE7: Carruseles modo claro — botones/dots en EventosSection y GaleriaCarousel
- [x] Post-FE7: Layout boxed/full-width en NoticiasPage, NoticiaDetailPage, EventosPage, ContactoPage, EstudiantesPage

**Dependencias:** Puede usar datos mock de noticias hasta que el Módulo BE 4 esté listo
**Contraparte BE:** Módulo BE 4

### Issues conocidos (pendientes)
- Cards usan bg-white fijo (token card-bg comentado)
- Hero boton "Ver Carreras" usa text-slate-800 hardcodeado
- Navbar dropdown usa bg-slate-800 hardcodeado
- Footer gradiente fijo from-slate-900
- layout-boxed/layout-full CSS muerto (--content-width no referenciado)

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
- [x] Fix persistencia stores y feedback de errores en admin

**Dependencias:** Puede usar datos mock hasta que los Módulos BE 4,5,6 estén listos
**Contraparte BE:** Módulos BE 4,5,6

#### Módulo 4b: Admin Carreras, Materias, Horarios y Comisiones
**Tareas:**
- [x] Carreras admin: CRUD con modales y validacion
- [x] Materias admin: CRUD con store y manejo de errores
- [x] Horarios admin: CRUD con comisiones en detalle de carrera
- [x] Stores carrerasStore/materiasStore: cooldown, relanzan errores
- [x] Tests: materiasStore, MateriasPage, EstudiantesPage, CarreraDetailAdmin
- [x] Boton "Plan" en admin Carreras (navega a detalle/plan)
- [x] Boton "Asignar carrera" en admin Materias con modal inline (selecciona carrera + cuatrimestre)
- [x] DataTable: prop `selectable` con columna de checkbox y select-all
- [x] CarrerasPage: tabla reemplazada por DataTable searchable
- [x] MateriasPage: DataTable searchable + selectable + bulk "Asignar a carrera"
- [x] AsignarCarreraModal inline con materias agrupadas por cuatrimestre
- [x] CarreraDetailAdmin: validacion omite filas sin dia/horario, permite guardar solo materias con datos

**Dependencias:** Módulo FE 4 (mismo dev), Módulo BE 12 (tabla intermedia)
**Contraparte BE:** Módulo BE 12

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
- [x] Campana navega a /admin/consultas y resetea contador al hacer clic

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

---

## Modulo FE 7: Nuevo Sistema de Estilos (Directiva Critica)

**Lider:** Lucas
**Prioridad:** CRITICA - sin margen de error
**Estimacion:** 2-3 horas
**Archivo de referencia:** `App/frontend/new-styles.md` (plan detallado con fases)

### Fase 1: Infraestructura (archivos nuevos)
- [x] Agregar keyframes + animaciones + prefers-reduced-motion + transicion global a globals.css
- [x] Agregar --width-content-narrow a @theme en globals.css
- [x] Hook useScrollReveal.js (archivo ya creado, listo para usar)

### Fase 2: Theme Toggle en Navbar
- [x] Agregar boton theme toggle (sol/luna) en Navbar.jsx
- [x] Agregar boton theme toggle en MobileMenu.jsx

### Fase 3: Componentes Publicos
- [x] Badge.jsx - dark: variants en colores
- [x] Hero.jsx - botones rounded-xl + shadow + scale hover
- [x] Stats.jsx + StatItem.jsx - dark: text + animacion scroll reveal
- [x] CareerCard.jsx - glass/light card pattern + dark: text
- [x] CareerCards.jsx - bg gradient + dark:
- [x] CareerCarousel.jsx - bg gradient + botones carousel + dark: + scroll reveal
- [x] NewsCard.jsx - glass/light card + dark: text
- [x] NewsSection.jsx - bg gradient + botones carousel + dark: + scroll reveal
- [x] EventosCard.jsx - glass/light card + dark: text
- [x] EventosSection.jsx - bg gradient + botones carousel + dark: + scroll reveal
- [x] TestimonialSlide.jsx - dark: text colors
- [x] TestimonialsCarousel.jsx - bg gradient + botones + dark: + scroll reveal
- [x] GaleriaCarousel.jsx - glass/light card + bg gradient + botones + dark: + scroll reveal
- [x] Footer.jsx - gradient bg (ya es oscuro, ajustes menores)

### Fase 4: Paginas Publicas
- [x] CarrerasPage.jsx - bg gradient + dark:
- [x] CarreraDetailPage.jsx - bg gradient + dark:
- [x] NoticiasPage.jsx - bg gradient + dark:
- [x] NoticiaDetailPage.jsx - dark:
- [x] EventosPage.jsx - bg gradient + dark:
- [x] ContactoPage.jsx - bg gradient + dark:
- [x] EstudiantesPage.jsx - bg gradient + dark:

### Fase 5: Verificacion
- [x] Build sin errores (`npm run build`)
- [x] Verificar modo claro en homepage y todas las paginas
- [x] Verificar modo oscuro en homepage y todas las paginas
- [x] Verificar prefers-reduced-motion
- [x] Verificar que admin sigue funcionando sin cambios
- [x] Ejecutar tests existentes (make tests-frontend)

### Componentes que NO se tocan
- Todo `components/admin/` (CarreraFormModal, NoticiaFormModal, etc.)
- Todo `pages/admin/` (DashboardPage, PersonalizarPage, etc.)
- Todo `components/ui/` excepto Badge
- Stores, services, contexts (ya implementan el sistema de tema)

