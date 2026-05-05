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
- [ ✓] Implementar modelo User (id, nombre, apellido, email, password_hash, rol, avatar_url, activo, ultimo_acceso)
- [ ✓] Crear migración de users
- [ ✓] Crear seeder de usuario admin (admin@ifts29.edu.ar / admin1234)
- [ ✓] Implementar JWT auth (generación y verificación de tokens)
- [ ✓] Middleware de autenticación (validación JWT)
- [ ✓] Middleware de roles (RBAC: admin/profesor/tutor)
- [ ✓] Controlador de auth (login, register, refresh token)
- [ ✓] Rutas de auth (POST /api/auth/login, /register, /refresh)
- [ ✓] Validadores de auth (email, password, rol)
- [ ✓] Middleware global de manejo de errores
- [ ✓] Configuración base de multer para uploads

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 1

#### Módulo 2: Carreras y Materias
**Tareas:**
- [ ✓] Implementar modelo Carrera (id, nombre, slug, descripcion, duracion, modalidad, icono, color, activa)
- [ ✓] Implementar modelo Materia (id, nombre, carrera_id, cuatrimestre, carga_horaria_semanal, descripcion)
- [ ] Crear migración de carreras
- [ ] Crear migración de materias
- [ ] Seeder de carreras de ejemplo
- [ ] Controlador de Carrera (CRUD, filtrar por modalidad/estado)
- [ ] Controlador de Materia (CRUD, filtrar por carrera)
- [ ] Rutas de Carrera (GET/POST/PUT/DELETE /api/carreras)
- [ ] Rutas de Materia (GET/POST/PUT/DELETE /api/materias)
- [ ] Validadores de Carrera y Materia

**Dependencias:** Ninguna (Materia solo referencia a Carrera dentro de este módulo)
**Contraparte FE:** Módulo FE 2

#### Módulo 3: Configuración del Sitio y Estadísticas
**Tareas:**
- [ ] Implementar modelo SiteConfig (id, site_name, site_subtitle, contact_email, contact_phone, address, seo_description, footer_text, colors, layout, sections, typography, theme_preset)
- [ ] Crear migración de site-config
- [ ] Seeder de configuración por defecto del sitio
- [ ] Controlador de SiteConfig (GET/PUT /api/config)
- [ ] Controlador de Stats (contadores para dashboard: usuarios, noticias, eventos)
- [ ] Rutas de SiteConfig (GET/PUT /api/config)
- [ ] Rutas de Stats (GET /api/stats)
- [ ] Validadores de SiteConfig

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 5

---

### BE Dev 2: Modelos de Contenido
#### Módulo 4: Categorías y Noticias
**Tareas:**
- [ ] Implementar modelo Categoria (id, nombre, slug, color)
- [ ] Implementar modelo Noticia (id, titulo, slug, contenido, imagen_destacada_url, categoria_id, autor_id, estado, fecha_publicacion)
- [ ] Crear migración de categorias
- [ ] Crear migración de noticias
- [ ] Seeder de categorías de ejemplo
- [ ] Seeder de noticias de ejemplo
- [ ] Controlador de Categoria (CRUD)
- [ ] Controlador de Noticia (CRUD, filtrar por categoría/estado/fecha, paginación, búsqueda)
- [ ] Rutas de Categoria (GET/POST/PUT/DELETE /api/categorias)
- [ ] Rutas de Noticia (GET/POST/PUT/DELETE /api/noticias)
- [ ] Validadores de Categoria y Noticia
- [ ] Upload de imágenes para noticias destacadas

**Dependencias:** Modelo User (Módulo BE 1), Categoria (mismo módulo)
**Contraparte FE:** Módulo FE 3

#### Módulo 5: Eventos y Testimonios
**Tareas:**
- [ ] Implementar modelo Evento (id, nombre, descripcion, fecha, ubicacion, estado)
- [ ] Implementar modelo Testimonio (id, autor_nombre, autor_carrera, texto, visible)
- [ ] Crear migración de eventos
- [ ] Crear migración de testimonios
- [ ] Seeder de eventos de ejemplo
- [ ] Seeder de testimonios de ejemplo
- [ ] Controlador de Evento (CRUD, filtrar por estado/fecha)
- [ ] Controlador de Testimonio (CRUD, toggle visibilidad)
- [ ] Rutas de Evento (GET/POST/PUT/DELETE /api/eventos)
- [ ] Rutas de Testimonio (GET/POST/PUT/DELETE /api/testimonios)
- [ ] Validadores de Evento y Testimonio

**Dependencias:** Ninguna
**Contraparte FE:** Módulo FE 4

#### Módulo 6: Galería y Gestión de Usuarios
**Tareas:**
- [ ] Implementar modelo Imagen (id, url, alt_text, categoria, entidad_id)
- [ ] Crear migración de imagenes
- [ ] Controlador de Galería (upload, listar, eliminar imágenes, filtrar por categoría/entidad)
- [ ] Controlador de User (CRUD, asignación de roles)
- [ ] Rutas de Galería (GET/POST/DELETE /api/imagenes)
- [ ] Rutas de User (GET/POST/PUT/DELETE /api/usuarios)
- [ ] Validadores de Galería y usuarios
- [ ] Upload de imágenes para galería

**Dependencias:** Modelo User (Módulo BE 1)
**Contraparte FE:** Módulo FE 4

---

## Módulos de Frontend

### FE Dev 1: Sitio Público y Fundación
#### Módulo 1: Fundación y Autenticación
**Tareas:**
- [ ] Configurar React Router (todas las rutas públicas/admin)
- [ ] Crear capa de servicios API (axios con interceptores)
- [ ] Implementar AuthContext, ThemeContext, LayoutContext, ToastContext
- [ ] Crear authStore, uiStore
- [ ] Construir sistema de diseño UI: Button, Input, Select, Textarea, Card, Badge, Modal, Table, Pagination, Toggle, Toast, Skeleton, EmptyState
- [ ] Construir PublicLayout (Navbar, Footer, MobileMenu)
- [ ] Construir LoginPage
- [ ] Construir AdminLayout (AdminSidebar, AdminTopbar, Breadcrumbs)

**Dependencias:** Puede usar datos mock de auth hasta que el Módulo BE 1 esté listo
**Contraparte BE:** Módulo BE 1

#### Módulo 2: Inicio y Carreras Públicas
**Tareas:**
- [ ] Construir HomePage (Hero, Stats, CareerCards, NewsSection, TestimonialsCarousel)
- [ ] Construir CarrerasPage (listado)
- [ ] Construir CarreraDetailPage (CareerTabs: descripción, plan de estudios, requisitos, horarios)
- [ ] Construir componentes: CareerCards, CareerCard, StatItem, Hero, TestimonialsCarousel
- [ ] Construir componente HorariosTable
- [ ] Implementar carrerasStore

**Dependencias:** Puede usar datos mock de carreras hasta que el Módulo BE 2 esté listo
**Contraparte BE:** Módulo BE 2

#### Módulo 3: Noticias y Contacto Público
**Tareas:**
- [ ] Construir NoticiasPage (listado con filtros, búsqueda, paginación)
- [ ] Construir NoticiaDetailPage
- [ ] Construir componentes: NewsCard, NewsSidebar
- [ ] Construir ContactoPage, ContactForm
- [ ] Construir EstudiantesPage, QuickLinks
- [ ] Implementar noticiasStore

**Dependencias:** Puede usar datos mock de noticias hasta que el Módulo BE 4 esté listo
**Contraparte BE:** Módulo BE 4

---

### FE Dev 2: Páginas de Admin y Personalización
#### Módulo 4: Gestión de Contenido Admin
**Tareas:**
- [ ] Construir DashboardPage (StatCards, ActivityFeed, QuickActions)
- [ ] Construir Admin NoticiasPage + NoticiaFormModal (editor TipTap)
- [ ] Construir Admin EventosPage + EventoFormModal
- [ ] Construir Admin TestimoniosPage + TestimonioFormModal
- [ ] Construir GaleriaPage + ImageUploadModal (drag & drop)
- [ ] Construir UsuariosPage + UsuarioFormModal
- [ ] Construir componentes: DataTable, ImageUploader, RichEditor, UserAvatar
- [ ] Implementar eventosStore, testimoniosStore, galeriaStore, usuariosStore

**Dependencias:** Puede usar datos mock hasta que los Módulos BE 4,5,6 estén listos
**Contraparte BE:** Módulos BE 4,5,6

#### Módulo 5: Personalización y Configuración del Sitio
**Tareas:**
- [ ] Construir PersonalizarPage (ColorConfig, ThemePresets, LayoutSelector, SectionsConfig con drag & drop, TypographyConfig, PreviewPanel)
- [ ] Construir AjustesPage (GeneralSettings, SEOSettings, SocialSettings)
- [ ] Implementar siteConfigStore
- [ ] Construir componentes: ColorPicker, SectionManager, DraggableSection

**Dependencias:** Módulo BE 3 (Site Config)
**Contraparte BE:** Módulo BE 3

---

## Guía de Ejecución en Paralelo
| Módulo | Puede Comenzar Con | Bloqueado Por |
|--------|-------------------|---------------|
| BE 1 | BE 4, FE 1 | Ninguno |
| BE 2 | BE 5, FE 2 | Ninguno |
| BE 3 | BE 6, FE 5 | Ninguno |
| BE 4 | BE 2, FE 3 | BE 1 |
| BE 5 | BE 3, FE 4 | Ninguno |
| BE 6 | BE 5, FE 4 | BE 1 |
| FE 1 | BE 1, FE 4 | Ninguno (usar mocks) |
| FE 2 | BE 2, FE 3 | Ninguno (usar mocks) |
| FE 3 | BE 4, FE 2 | Ninguno (usar mocks) |
| FE 4 | BE 3, FE 5 | Ninguno (usar mocks) |
| FE 5 | BE 6, FE 4 | BE 3 |
