# Estructura del Proyecto - IFTS 29 Nueva Web

> **GoSoftware** - Proyecto Integrador  
> Stack: React 19 + Vite + Zustand + Context API + Tailwind | Node/Express + Sequelize + SQLite/PostgreSQL

---

## Árbol Completo del Proyecto

```
PI/
│
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── frontend/                           # Aplicación React (Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── .env
│   ├── .env.production
│   │
│   ├── public/                         # Assets estáticos (no procesados por Vite)
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   └── og-image.png
│   │
│   └── src/
│       ├── main.jsx                    # Entry point de la app
│       ├── App.jsx                     # Componente raíz con Providers
│       ├── AppRouter.jsx               # Rutas (react-router-dom v7)
│       │
│       ├── assets/                     # Assets importados desde JS
│       │   ├── images/
│       │   │   ├── hero-bg.webp
│       │   │   ├── logo-dark.svg
│       │   │   └── logos/
│       │   ├── icons/
│       │   └── fonts/
│       │
│       ├── components/                 # Componentes reutilizables
│       │   ├── ui/                     # Primitivas UI (design system)
│       │   │   ├── Button/
│       │   │   │   ├── Button.jsx
│       │   │   │   ├── Button.test.jsx
│       │   │   │   └── index.js
│       │   │   ├── Input/
│       │   │   │   ├── Input.jsx
│       │   │   │   └── index.js
│       │   │   ├── Select/
│       │   │   │   ├── Select.jsx
│       │   │   │   └── index.js
│       │   │   ├── Textarea/
│       │   │   │   ├── Textarea.jsx
│       │   │   │   └── index.js
│       │   │   ├── Card/
│       │   │   │   ├── Card.jsx
│       │   │   │   └── index.js
│       │   │   ├── Badge/
│       │   │   │   ├── Badge.jsx
│       │   │   │   └── index.js
│       │   │   ├── Modal/
│       │   │   │   ├── Modal.jsx
│       │   │   │   └── index.js
│       │   │   ├── Table/
│       │   │   │   ├── Table.jsx
│       │   │   │   ├── TableHeader.jsx
│       │   │   │   ├── TableRow.jsx
│       │   │   │   └── index.js
│       │   │   ├── Pagination/
│       │   │   │   ├── Pagination.jsx
│       │   │   │   └── index.js
│       │   │   ├── Toggle/
│       │   │   │   ├── Toggle.jsx
│       │   │   │   └── index.js
│       │   │   ├── ColorPicker/
│       │   │   │   ├── ColorPicker.jsx
│       │   │   │   └── index.js
│       │   │   ├── Toast/
│       │   │   │   ├── Toast.jsx
│       │   │   │   ├── ToastContainer.jsx
│       │   │   │   └── index.js
│       │   │   ├── Skeleton/
│       │   │   │   ├── Skeleton.jsx
│       │   │   │   └── index.js
│       │   │   ├── EmptyState/
│       │   │   │   ├── EmptyState.jsx
│       │   │   │   └── index.js
│       │   │   └── index.js            # Barrel export
│       │   │
│       │   ├── layout/                 # Layouts estructurales
│       │   │   ├── PublicLayout/
│       │   │   │   ├── PublicLayout.jsx
│       │   │   │   ├── Navbar/
│       │   │   │   │   ├── Navbar.jsx
│       │   │   │   │   ├── NavLinks.jsx
│       │   │   │   │   └── MobileMenu.jsx
│       │   │   │   ├── Footer/
│       │   │   │   │   ├── Footer.jsx
│       │   │   │   │   ├── FooterLinks.jsx
│       │   │   │   │   └── FooterContact.jsx
│       │   │   │   └── SidebarLayout/  # Layout alternativo (configurable)
│       │   │   │       ├── SidebarLayout.jsx
│       │   │   │       └── SidebarNav.jsx
│       │   │   ├── AdminLayout/
│       │   │   │   ├── AdminLayout.jsx
│       │   │   │   ├── AdminSidebar/
│       │   │   │   │   ├── AdminSidebar.jsx
│       │   │   │   │   ├── SidebarNavGroup.jsx
│       │   │   │   │   └── SidebarNavItem.jsx
│       │   │   │   ├── AdminTopbar/
│       │   │   │   │   ├── AdminTopbar.jsx
│       │   │   │   │   ├── SearchBar.jsx
│       │   │   │   │   ├── NotificationsDropdown.jsx
│       │   │   │   │   └── UserDropdown.jsx
│       │   │   │   └── AdminBreadcrumbs/
│       │   │   │       └── AdminBreadcrumbs.jsx
│       │   │   └── index.js
│       │   │
│       │   ├── public/                 # Componentes específicos del sitio público
│       │   │   ├── Hero/
│       │   │   │   ├── Hero.jsx
│       │   │   │   └── HeroCTA.jsx
│       │   │   ├── Stats/
│       │   │   │   ├── Stats.jsx
│       │   │   │   └── StatItem.jsx
│       │   │   ├── CareerCards/
│       │   │   │   ├── CareerCards.jsx
│       │   │   │   └── CareerCard.jsx
│       │   │   ├── NewsSection/
│       │   │   │   ├── NewsSection.jsx
│       │   │   │   └── NewsCard.jsx
│       │   │   ├── EventsList/
│       │   │   │   ├── EventsList.jsx
│       │   │   │   └── EventItem.jsx
│       │   │   ├── TestimonialsCarousel/
│       │   │   │   ├── TestimonialsCarousel.jsx
│       │   │   │   ├── TestimonialSlide.jsx
│       │   │   │   └── CarouselControls.jsx
│       │   │   ├── Gallery/
│       │   │   │   ├── Gallery.jsx
│       │   │   │   ├── GalleryGrid.jsx
│       │   │   │   └── GalleryItem.jsx
│       │   │   ├── Breadcrumb/
│       │   │   │   └── Breadcrumb.jsx
│       │   │   ├── PageHeader/
│       │   │   │   └── PageHeader.jsx
│       │   │   ├── SearchBar/
│       │   │   │   └── SearchBar.jsx
│       │   │   ├── ContactForm/
│       │   │   │   ├── ContactForm.jsx
│       │   │   │   └── ContactInfo.jsx
│       │   │   ├── QuickLinks/
│       │   │   │   ├── QuickLinks.jsx
│       │   │   │   └── QuickLink.jsx
│       │   │   └── index.js
│       │   │
│       │   └── admin/                  # Componentes específicos del admin
│       │       ├── StatCards/
│       │       │   ├── StatCards.jsx
│       │       │   └── StatCard.jsx
│       │       ├── ActivityFeed/
│       │       │   ├── ActivityFeed.jsx
│       │       │   └── ActivityItem.jsx
│       │       ├── QuickActions/
│       │       │   ├── QuickActions.jsx
│       │       │   └── QuickAction.jsx
│       │       ├── DataTable/
│       │       │   ├── DataTable.jsx
│       │       │   ├── DataTableActions.jsx
│       │       │   └── DataTableFilters.jsx
│       │       ├── SectionManager/
│       │       │   ├── SectionManager.jsx
│       │       │   ├── DraggableSection.jsx
│       │       │   └── SectionToggle.jsx
│       │       ├── ThemePresets/
│       │       │   ├── ThemePresets.jsx
│       │       │   └── ThemePresetCard.jsx
│       │       ├── LayoutSelector/
│       │       │   ├── LayoutSelector.jsx
│       │       │   └── LayoutPreview.jsx
│       │       ├── ImageUploader/
│       │       │   ├── ImageUploader.jsx
│       │       │   └── ImagePreview.jsx
│       │       ├── UserAvatar/
│       │       │   └── UserAvatar.jsx
│       │       ├── RichEditor/
│       │       │   └── RichEditor.jsx
│       │       └── index.js
│       │
│       ├── pages/                      # Páginas / Vistas
│       │   ├── public/
│       │   │   ├── HomePage/
│       │   │   │   ├── HomePage.jsx
│       │   │   │   └── index.js
│       │   │   ├── CarrerasPage/
│       │   │   │   ├── CarrerasPage.jsx
│       │   │   │   ├── CarreraDetailPage.jsx
│       │   │   │   ├── CareerTabs.jsx
│       │   │   │   └── index.js
│       │   │   ├── NoticiasPage/
│       │   │   │   ├── NoticiasPage.jsx
│       │   │   │   ├── NoticiaDetailPage.jsx
│       │   │   │   ├── NewsSidebar.jsx
│       │   │   │   └── index.js
│       │   │   ├── EstudiantesPage/
│       │   │   │   ├── EstudiantesPage.jsx
│       │   │   │   ├── HorariosTable.jsx
│       │   │   │   └── index.js
│       │   │   ├── ContactoPage/
│       │   │   │   ├── ContactoPage.jsx
│       │   │   │   └── index.js
│       │   │   └── index.js
│       │   │
│       │   └── admin/
│       │       ├── DashboardPage/
│       │       │   ├── DashboardPage.jsx
│       │       │   └── index.js
│       │       ├── NoticiasPage/
│       │       │   ├── NoticiasPage.jsx
│       │       │   ├── NoticiaFormModal.jsx
│       │       │   └── index.js
│       │       ├── CarrerasPage/
│       │       │   ├── CarrerasPage.jsx
│       │       │   ├── CarreraFormModal.jsx
│       │       │   ├── CarreraDetailPage.jsx
│       │       │   └── index.js
│       │       ├── EventosPage/
│       │       │   ├── EventosPage.jsx
│       │       │   ├── EventoFormModal.jsx
│       │       │   └── index.js
│       │       ├── GaleriaPage/
│       │       │   ├── GaleriaPage.jsx
│       │       │   ├── ImageUploadModal.jsx
│       │       │   └── index.js
│       │       ├── TestimoniosPage/
│       │       │   ├── TestimoniosPage.jsx
│       │       │   ├── TestimonioFormModal.jsx
│       │       │   └── index.js
│       │       ├── UsuariosPage/
│       │       │   ├── UsuariosPage.jsx
│       │       │   ├── UsuarioFormModal.jsx
│       │       │   ├── UsuarioDetailPage.jsx
│       │       │   └── index.js
│       │       ├── PersonalizarPage/
│       │       │   ├── PersonalizarPage.jsx
│       │       │   ├── ColorConfig.jsx
│       │       │   ├── LayoutConfig.jsx
│       │       │   ├── SectionsConfig.jsx
│       │       │   ├── TypographyConfig.jsx
│       │       │   └── PreviewPanel.jsx
│       │       ├── AjustesPage/
│       │       │   ├── AjustesPage.jsx
│       │       │   ├── GeneralSettings.jsx
│       │       │   ├── SEOSettings.jsx
│       │       │   └── SocialSettings.jsx
│       │       ├── LoginPage/
│       │       │   ├── LoginPage.jsx
│       │       │   └── index.js
│       │       └── index.js
│       │
│       ├── stores/                     # Zustand stores
│       │   ├── authStore.js            # Estado de autenticación
│       │   ├── siteConfigStore.js      # Configuración del sitio (colores, layout, secciones)
│       │   ├── noticiasStore.js        # Estado de noticias
│       │   ├── carrerasStore.js        # Estado de carreras
│       │   ├── eventosStore.js         # Estado de eventos
│       │   ├── usuariosStore.js        # Estado de usuarios
│       │   ├── galeriaStore.js         # Estado de galería
│       │   ├── testimoniosStore.js     # Estado de testimonios
│       │   ├── uiStore.js              # Estado UI global (modales, toasts, sidebar)
│       │   └── index.js
│       │
│       ├── contexts/                   # React Context API
│       │   ├── AuthContext/
│       │   │   ├── AuthContext.jsx     # Provider de autenticación
│       │   │   ├── AuthProvider.jsx
│       │   │   └── useAuth.js          # Hook personalizado
│       │   ├── ThemeContext/
│       │   │   ├── ThemeContext.jsx    # Provider de tema dinámico
│       │   │   ├── ThemeProvider.jsx
│       │   │   └── useTheme.js         # Hook para acceder al tema activo
│       │   ├── LayoutContext/
│       │   │   ├── LayoutContext.jsx   # Provider de layout (navbar/sidebar)
│       │   │   ├── LayoutProvider.jsx
│       │   │   └── useLayout.js
│       │   └── ToastContext/
│       │       ├── ToastContext.jsx
│       │       ├── ToastProvider.jsx
│       │       └── useToast.js
│       │
│       ├── hooks/                      # Custom hooks reutilizables
│       │   ├── useApi.js               # Hook genérico para llamadas API
│       │   ├── useDebounce.js          # Debounce para búsqueda
│       │   ├── usePagination.js        # Lógica de paginación
│       │   ├── useModal.js             # Control de modales
│       │   ├── useLocalStorage.js      # Persistencia en localStorage
│       │   ├── useMediaQuery.js        # Responsive queries
│       │   ├── useDragAndDrop.js       # Lógica drag & drop
│       │   └── index.js
│       │
│       ├── services/                   # Capa de comunicación con API
│       │   ├── api.js                  # Instancia de axios configurada
│       │   ├── authService.js          # Login, logout, refresh token
│       │   ├── noticiasService.js
│       │   ├── carrerasService.js
│       │   ├── eventosService.js
│       │   ├── usuariosService.js
│       │   ├── galeriaService.js
│       │   ├── testimoniosService.js
│       │   ├── siteConfigService.js    # Obtener/guardar configuración del sitio
│       │   └── index.js
│       │
│       ├── utils/                      # Utilidades puras
│       │   ├── formatDate.js           # Formateo de fechas
│       │   ├── formatText.js           # Truncar texto, slugify
│       │   ├── validators.js           # Validaciones de formularios
│       │   ├── constants.js            # Constantes globales (roles, estados)
│       │   ├── helpers.js              # Funciones auxiliares
│       │   └── index.js
│       │
│       ├── styles/                     # Estilos globales y Tailwind
│       │   ├── globals.css             # @tailwind directives + custom base
│       │   ├── animations.css          # Keyframes y transiciones custom
│       │   └── components.css          # Estilos de componentes que Tailwind no cubre
│       │
│       └── tests/                      # Tests del frontend
│           ├── setup.js
│           ├── components/
│           ├── pages/
│           ├── stores/
│           └── hooks/
│
├── backend/                            # API REST (Node + Express)
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── .env.production
│   │
│   ├── src/
│   │   ├── server.js                   # Entry point (inicia el servidor)
│   │   ├── app.js                      # Configuración de Express (middleware, rutas)
│   │   │
│   │   ├── config/
│   │   │   ├── database.js             # Configuración de Sequelize (SQLite/PostgreSQL)
│   │   │   ├── cors.js                 # Configuración de CORS
│   │   │   ├── upload.js               # Configuración de multer (subida de archivos)
│   │   │   └── constants.js            # Constantes del backend
│   │   │
│   │   ├── models/                     # Modelos Sequelize
│   │   │   ├── index.js                # Inicialización y asociación de modelos
│   │   │   ├── User.js                 # Usuarios (admin, profesor, tutor)
│   │   │   ├── Noticia.js              # Noticias
│   │   │   ├── Categoria.js            # Categorías de noticias
│   │   │   ├── Carrera.js              # Carreras
│   │   │   ├── Materia.js              # Materias (relacionadas a carreras)
│   │   │   ├── Evento.js               # Eventos
│   │   │   ├── Testimonio.js           # Testimonios
│   │   │   ├── Imagen.js               # Imágenes de galería
│   │   │   └── SiteConfig.js           # Configuración del sitio (colores, layout, secciones)
│   │   │
│   │   ├── controllers/                # Controladores (lógica de request/response)
│   │   │   ├── authController.js       # Login, register, refresh token
│   │   │   ├── userController.js       # CRUD usuarios
│   │   │   ├── noticiaController.js    # CRUD noticias
│   │   │   ├── categoriaController.js  # CRUD categorías
│   │   │   ├── carreraController.js    # CRUD carreras
│   │   │   ├── materiaController.js    # CRUD materias
│   │   │   ├── eventoController.js     # CRUD eventos
│   │   │   ├── testimonioController.js # CRUD testimonios
│   │   │   ├── galeriaController.js    # CRUD imágenes
│   │   │   ├── siteConfigController.js # Obtener/guardar config del sitio
│   │   │   ├── statsController.js      # Estadísticas para el dashboard
│   │   │   └── uploadController.js     # Manejo de subida de archivos
│   │   │
│   │   ├── services/                   # Lógica de negocio (separada de controllers)
│   │   │   ├── authService.js          # Lógica de autenticación
│   │   │   ├── userService.js
│   │   │   ├── noticiaService.js
│   │   │   ├── carreraService.js
│   │   │   ├── eventoService.js
│   │   │   ├── testimonioService.js
│   │   │   ├── galeriaService.js
│   │   │   ├── siteConfigService.js
│   │   │   └── statsService.js
│   │   │
│   │   ├── routes/                     # Definición de rutas
│   │   │   ├── index.js                # Router principal (monta todos los routers)
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── noticia.routes.js
│   │   │   ├── categoria.routes.js
│   │   │   ├── carrera.routes.js
│   │   │   ├── materia.routes.js
│   │   │   ├── evento.routes.js
│   │   │   ├── testimonio.routes.js
│   │   │   ├── galeria.routes.js
│   │   │   ├── siteConfig.routes.js
│   │   │   └── stats.routes.js
│   │   │
│   │   ├── middlewares/                # Middlewares de Express
│   │   │   ├── auth.middleware.js      # Verificación de JWT
│   │   │   ├── role.middleware.js      # Verificación de roles (RBAC)
│   │   │   ├── validator.middleware.js # Validación de requests (express-validator)
│   │   │   ├── error.middleware.js     # Manejo global de errores
│   │   │   ├── upload.middleware.js    # Middleware de multer para archivos
│   │   │   └── logger.middleware.js    # Logging de requests
│   │   │
│   │   ├── validators/                 # Esquemas de validación (express-validator)
│   │   │   ├── auth.validators.js
│   │   │   ├── user.validators.js
│   │   │   ├── noticia.validators.js
│   │   │   ├── carrera.validators.js
│   │   │   ├── evento.validators.js
│   │   │   └── testimonio.validators.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js                  # Generación y verificación de JWT
│   │   │   ├── hash.js                 # Hash de contraseñas (bcrypt)
│   │   │   ├── response.js             # Formato estándar de respuestas
│   │   │   ├── AppError.js             # Clase de error personalizada
│   │   │   ├── asyncHandler.js         # Wrapper para async/await en controllers
│   │   │   └── logger.js               # Configuración de Winston/morgan
│   │   │
│   │   └── migrations/                 # Migraciones de Sequelize
│   │       ├── 20250401000000-create-users.js
│   │       ├── 20250401000001-create-categorias.js
│   │       ├── 20250401000002-create-noticias.js
│   │       ├── 20250401000003-create-carreras.js
│   │       ├── 20250401000004-create-materias.js
│   │       ├── 20250401000005-create-eventos.js
│   │       ├── 20250401000006-create-testimonios.js
│   │       ├── 20250401000007-create-imagenes.js
│   │       └── 20250401000008-create-site-configs.js
│   │
│   ├── seeders/                        # Seeders para datos iniciales
│   │   ├── 20250401000000-admin-user.js
│   │   ├── 20250401000001-sample-users.js
│   │   ├── 20250401000002-sample-carreras.js
│   │   ├── 20250401000003-sample-noticias.js
│   │   ├── 20250401000004-sample-eventos.js
│   │   ├── 20250401000005-sample-testimonios.js
│   │   └── 20250401000006-default-site-config.js
│   │
│   ├── uploads/                        # Archivos subidos (gitignored)
│   │   ├── noticias/
│   │   ├── carreras/
│   │   ├── galeria/
│   │   └── avatars/
│   │
│   └── tests/                          # Tests del backend
│       ├── setup.js
│       ├── helpers/
│       ├── unit/
│       │   ├── services/
│       │   └── utils/
│       ├── integration/
│       │   ├── auth.test.js
│       │   ├── users.test.js
│       │   ├── noticias.test.js
│       │   └── carreras.test.js
│       └── fixtures/
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml              # Servicios: backend, frontend, postgres (prod)
│   └── docker-compose.dev.yml          # Dev: backend, sqlite, frontend hot-reload
│
└── docs/                               # Documentación adicional
    ├── API.md                          # Documentación de endpoints
    ├── DATABASE.md                     # Diagrama ER y decisiones de BD
    ├── DEPLOY.md                       # Guía de despliegue
    └── CONTRIBUTING.md                 # Guía de contribución al proyecto
```

---

## Decisiones de Arquitectura

### Frontend

| Decisión | Herramienta | Por qué |
|----------|-------------|---------|
| Framework | React 19 | Últimas features (Actions, use, hooks mejorados) |
| Bundler | Vite 6 | HMR rápido, configuración mínima |
| Routing | React Router v7 | Routing declarativo con nested layouts |
| State global | Zustand | Boilerplate mínimo, devtools, persistencia nativa |
| Context API | React.createContext | Para auth, theme, layout (valores que cambian poco) |
| Estilos | Tailwind CSS 4 | Utility-first, customización vía config |
| HTTP Client | Axios | Interceptors, cancel tokens, tipado |
| Formularios | React Hook Form + Zod | Performance + validación type-safe |
| Drag & Drop | @dnd-kit/core | Moderno, accesible, sin dependencias pesadas |
| Editor de texto | TipTap / Quill | Rich text editor para noticias |

### Backend

| Decisión | Herramienta | Por qué |
|----------|-------------|---------|
| Runtime | Node.js 22 LTS | Estabilidad, performance |
| Framework | Express 5 | Maduro, ecosistema amplio |
| ORM | Sequelize 6 | Migraciones, seeders, soporte SQLite + PostgreSQL |
| BD Dev | SQLite 3 | Cero configuración, archivo local |
| BD Prod | PostgreSQL 16 | Robusto, escalable, producción |
| Auth | JWT + bcrypt | Stateless, sin sesiones en servidor |
| Validación | express-validator + Zod | Validación en middleware y en servicios |
| Uploads | Multer | Manejo de multipart/form-data |
| Logging | Winston + Morgan | Logs estructurados |
| Tests | Jest + Supertest | Testing unitario e integración |

### Sobre MongoDB como alternativa

**Recomendación: NO usar MongoDB para este proyecto.** Razones:

1. **Los datos son altamente relacionales**: Usuarios ↔ Roles, Carreras ↔ Materias, Noticias ↔ Categorías. Esto encaja naturalmente en un modelo relacional.

2. **Sequelize ya resuelve la config dinámica**: El modelo `SiteConfig` puede almacenar la configuración del sitio (colores, layout, secciones visibles, orden) como un campo JSON dentro de PostgreSQL. PostgreSQL soporta columnas `JSONB` nativamente, lo que permite flexibilidad tipo documento sin salir del modelo relacional.

3. **Menos complejidad operativa**: Mantener dos motores de BD (SQL + NoSQL) añade overhead de deployment, backups y monitoreo sin beneficio real para este caso de uso.

4. **JSONB en PostgreSQL**: Para lo que MongoDB resolvería (widgets dinámicos, configuraciones flexibles), PostgreSQL con `JSONB` ofrece:
   - Consultas sobre campos JSON
   - Índices sobre propiedades JSON
   - Transacciones ACID
   - Un solo motor de BD

**Si en el futuro se necesitan widgets completamente dinámicos** (estructura arbitraria definida por el admin), se puede:
- Usar una tabla `widgets` con columna `config JSONB`
- Almacenar la estructura del layout como JSON en `site_config.layout_schema`

---

## Modelo de Base de Datos (Entidades principales)

```
Users
├── id (PK)
├── nombre
├── apellido
├── email (unique)
├── password_hash
├── rol (FK -> Roles)
├── avatar_url
├── activo (boolean)
├── ultimo_acceso
├── created_at
└── updated_at

Roles
├── id (PK)
├── nombre
├── descripcion
└── created_at

Categorias
├── id (PK)
├── nombre
├── slug (unique)
├── color
└── created_at

Noticias
├── id (PK)
├── titulo
├── slug (unique)
├── contenido (text)
├── imagen_destacada_url
├── categoria_id (FK → Categorias)
├── autor_id (FK → Users)
├── estado (enum: borrador, publicada, programada)
├── fecha_publicacion
├── created_at
└── updated_at

Carreras
├── id (PK)
├── nombre
├── slug (unique)
├── descripcion (text)
├── duracion
├── modalidad
├── icono
├── color
├── activa (boolean)
├── created_at
└── updated_at

Materias
├── id (PK)
├── nombre
├── carrera_id (FK → Carreras)
├── cuatrimestre
├── carga_horaria_semanal
├── descripcion
├── created_at
└── updated_at

Eventos
├── id (PK)
├── nombre
├── descripcion (text)
├── fecha
├── ubicacion
├── estado (enum: confirmado, pendiente, cancelado)
├── created_at
└── updated_at

Testimonios
├── id (PK)
├── autor_nombre
├── autor_carrera
├── texto (text)
├── visible (boolean)
├── created_at
└── updated_at

Imagenes
├── id (PK)
├── url
├── alt_text
├── categoria (enum: galeria, noticia, carrera, avatar)
├── entidad_id (FK polimórfica)
├── created_at
└── updated_at

SiteConfig
├── id (PK)
├── site_name
├── site_subtitle
├── contact_email
├── contact_phone
├── address
├── seo_description
├── footer_text
├── colors (JSONB)          → { primary, secondary, accent, bg }
├── layout (JSONB)           → { type: 'navbar'|'sidebar'|'minimal' }
├── sections (JSONB)         → [{ id, visible, order }]
├── typography (JSONB)       → { font, base_size, border_radius }
├── theme_preset
├── created_at
└── updated_at
```

---

## Flujo de Trabajo

### Desarrollo local

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev

# Frontend (en otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Scripts disponibles

**Frontend:**
```
npm run dev          # Vite dev server
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # ESLint
npm run test         # Vitest/Jest
```

**Backend:**
```
npm run dev          # Nodemon + Express
npm run start        # Producción
npm run lint         # ESLint
npm run test         # Jest
npm run test:watch   # Jest watch mode
npx sequelize db:migrate
npx sequelize db:seed:all
npx sequelize db:migrate:undo
```

---

## Roles y Permisos

| Recurso | Admin | Profesor | Tutor |
|---------|-------|----------|-------|
| Dashboard | ✅ Full | ✅ Solo lectura | ✅ Solo lectura |
| Noticias | ✅ CRUD | ✅ CRUD propias | 👁️ Ver |
| Carreras | ✅ CRUD | 👁️ Ver | 👁️ Ver |
| Materias | ✅ CRUD | ✅ CRUD propias | 👁️ Ver |
| Eventos | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| Galería | ✅ CRUD | ✅ Subir | 👁️ Ver |
| Testimonios | ✅ CRUD | ❌ | ❌ |
| Usuarios | ✅ CRUD | ❌ | ❌ |
| Personalizar | ✅ Full | ❌ | ❌ |
| Ajustes | ✅ Full | ❌ | ❌ |
