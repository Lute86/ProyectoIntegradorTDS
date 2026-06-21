# IFTS 29 - Nueva Página Web Dinámica

> **Proyecto Integrador** - GoSoftware  
> Instituto de Formación Técnica Superior N° 29

## Descripción
Rediseño de la página web del IFTS 29 con un sitio público dinámico y un panel de administración (back office) para gestión de contenido, usuarios y personalización del sitio.

## ✅ Estado del Proyecto
**Funcional.** La aplicación full-stack (`App/`) está prácticamente terminada, con sitio público y back office implementados sobre una API REST con autenticación. Funciona en dos entornos:

- **Desarrollo**: Docker + SQLite + hot-reload (React/Vite + Nodemon)
- **Producción**: Docker + PostgreSQL + Nginx (HTTPS con certificado auto-firmado)

El proyecto sigue evolucionando: la gestión de usuarios en el admin está en progreso y se siguen puliendo detalles.

## Estructura del Repositorio

```
BASE/
├── App/                          # Aplicación Full-Stack (funcional)
│   ├── backend/                  # API REST (Express, Sequelize, SQLite/PostgreSQL)
│   ├── frontend/                 # Frontend (React, Vite, TailwindCSS)
│   ├── docker/                   # Dockerfiles para desarrollo y producción
│   ├── docker-compose.dev.yml    # Entorno de desarrollo
│   ├── docker-compose.yml        # Entorno de producción
│   ├── Makefile                  # Comandos de desarrollo y despliegue
│   ├── Tasks.md                  # Tareas del proyecto
│   ├── WORKFLOW.md               # Guía de flujo de trabajo
│   └── README.md                 # Guía de Docker, comandos y despliegue
│
├── Documentacion/                # Documentación técnica (14 documentos + índice)
│   ├── INICIO_RAPIDO.md          # ⭐ Empezá acá
│   ├── ARQUITECTURA.md           # Arquitectura y capas del sistema
│   ├── BASE_DE_DATOS.md          # Tablas, relaciones y seeders
│   ├── EJEMPLOS_API_REST.md      # Ejemplos de uso de la API
│   └── ...                       # Componentes, Docker, Testing, Troubleshooting, etc.
│
├── wireframe/                    # Prototipo estático inicial (HTML/CSS/JS) — referencia histórica
│   ├── public/                   # Sitio público (landing, carreras, noticias, etc.)
│   ├── admin/                    # Panel de administración (prototipo)
│   └── README.md                 # Documentación del wireframe
│
├── .github/                      # GitHub Actions (CI: lint + tests, branch check)
│
└── README.md                     # Este archivo
```

## Tecnologías

### App (Full-Stack)
- **Frontend**: React 19, Vite 6, TailwindCSS 4, Zustand, React Router 7, TipTap, React Hook Form, Zod
- **Backend**: Express 5, Sequelize 6, SQLite (desarrollo) / PostgreSQL (producción), JWT, bcryptjs, Winston
- **Testing**: Jest + Supertest (backend), Vitest + Testing Library (frontend)
- **Despliegue**: Docker, Docker Compose, Nginx, certificados SSL

### Wireframe (Prototipo Estático)
- HTML5, CSS3 (Variables, Grid, Flexbox), JavaScript Vanilla

> **Nota sobre el wireframe**: la carpeta `wireframe/` fue el prototipo estático inicial que sirvió de base para definir estructura y secciones. El proyecto evolucionó desde ahí hacia la app full-stack en `App/`, más moderna y visual: React + TailwindCSS, contenido dinámico desde la API y personalización del sitio en vivo. El wireframe se conserva solo como referencia histórica.

## Características Implementadas

### Sitio Público
- **Landing Page** con hero, estadísticas, carreras destacadas, noticias, eventos, testimonios y galería
- **Carreras**: listado y página de detalle (descripción, materias/malla, modalidad, horarios)
- **Noticias**: listado con filtros, búsqueda y categorías, más página de detalle
- **Eventos**: listado de eventos
- **Portal del Estudiante** con accesos rápidos (Aula Virtual, Horarios, Exámenes, Portal SIU)
- **Contacto** con formulario funcional (las consultas se gestionan desde el admin)

### Back Office (Admin Dashboard)
- **Dashboard** con estadísticas y actividad reciente
- **Gestión de contenido** (CRUD completo): Noticias, Carreras, Materias, Eventos, Testimonios y Galería
- **Gestión de Consultas**: ver, buscar, responder y eliminar mensajes del formulario de contacto
- **Personalización del Sitio**: colores, tipografía, layout, visibilidad/orden de secciones, presets de tema y vista previa en vivo
- **Gestión de Usuarios** con roles (Administrador, Profesor, Tutor) — *en progreso*

### Backend / API
- API REST con autenticación **JWT** y control de acceso por **roles** (admin, profesor, tutor) y por *ownership*
- Validación de entrada, manejo de errores estandarizado, uploads de imágenes, paginación y filtros
- Cobertura de tests (integración + unitarios) ejecutada en CI antes de cada merge

## Comenzar

### App (Desarrollo)
1. Clonar el repositorio
2. Entrar a `App/` y seguir la guía de Docker y comandos en [App/README.md](./App/README.md)
3. Usar Docker con Makefile:
   ```bash
   cd App
   cp .env.example .env   # En dev, los valores por defecto funcionan
   make help              # Ver comandos disponibles
   make dev               # Iniciar entorno de desarrollo
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000/api
   - Admin de prueba: `admin@ifts29.edu.ar` / `admin1234`

> 📖 Guía paso a paso para empezar: [Documentacion/INICIO_RAPIDO.md](./Documentacion/INICIO_RAPIDO.md)

### Wireframe (Prototipo)
- Sitio público: abrir `wireframe/public/index.html` en un navegador
- Panel admin: abrir `wireframe/admin/dashboard.html` en un navegador

## Documentación

La documentación técnica completa está en [`Documentacion/`](./Documentacion/) (índice en [Documentacion/README.md](./Documentacion/README.md)):

- **[INICIO_RAPIDO.md](./Documentacion/INICIO_RAPIDO.md)** ⭐ — instalación en 5 minutos y primeros pasos
- **[INSTALACION_COMPLETA.md](./Documentacion/INSTALACION_COMPLETA.md)** — instalación detallada (Docker y manual)
- **[ARQUITECTURA.md](./Documentacion/ARQUITECTURA.md)** — arquitectura, capas y componentes
- **[BASE_DE_DATOS.md](./Documentacion/BASE_DE_DATOS.md)** — tablas, relaciones y seeders
- **[EJEMPLOS_API_REST.md](./Documentacion/EJEMPLOS_API_REST.md)** — ejemplos de peticiones y respuestas
- **[GUIA_DESARROLLO.md](./Documentacion/GUIA_DESARROLLO.md)** — convenciones y cómo agregar funcionalidades
- **[COMPONENTES.md](./Documentacion/COMPONENTES.md)** · **[DOCKER.md](./Documentacion/DOCKER.md)** · **[TESTING.md](./Documentacion/TESTING.md)** · **[TROUBLESHOOTING.md](./Documentacion/TROUBLESHOOTING.md)** · **[VALIDACIONES.md](./Documentacion/VALIDACIONES.md)** · **[CREDENCIALES.md](./Documentacion/CREDENCIALES.md)** · **[COMANDOS_MAKEFILE.md](./Documentacion/COMANDOS_MAKEFILE.md)**

Además, en `App/`: [README.md](./App/README.md) (Docker y despliegue) y [WORKFLOW.md](./App/WORKFLOW.md) (flujo de trabajo Git).

## Equipo

**GoSoftware** - Proyecto Integrador  
IFTS 29 - Desarrollo de Software

---

> ⚠️ **Nota**: El proyecto sigue evolucionando. La estructura, tecnologías y funcionalidades descritas reflejan el estado actual y pueden ajustarse a medida que avanza el desarrollo.
