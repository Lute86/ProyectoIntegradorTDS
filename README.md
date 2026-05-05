# IFTS 29 - Nueva Página Web Dinámica

> **Proyecto Integrador** - GoSoftware  
> Instituto de Formación Técnica Superior N° 29

## Descripción
Rediseño de la página web del IFTS 29 con un sitio público dinámico y un panel de administración (back office) para gestión de contenido, usuarios y personalización del sitio.

## 🚧 Estado del Proyecto
**En desarrollo** - Se está construyendo la estructura base de la aplicación (App) con tecnologías modernas. El proyecto es evolutivo y los componentes, tecnologías y estructura pueden cambiar.

## Estructura del Repositorio

```
BASE/
├── App/                          # Aplicación Full-Stack (en desarrollo)
│   ├── backend/                  # API REST (Express, Sequelize, SQLite/PostgreSQL)
│   ├── frontend/                 # Frontend (React, Vite, TailwindCSS)
│   ├── docker/                   # Dockerfiles para desarrollo y producción
│   ├── Makefile                  # Comandos de desarrollo (Makefile)
│   ├── Tasks.md                  # Tareas del proyecto
│   ├── WORKFLOW.md               # Guía de flujo de trabajo
│   └── .github/                 # GitHub Actions (CI/CD)
│
├── wireframe/                    # Prototipo estático (HTML/CSS/JS)
│   ├── public/                   # Sitio público (landing, carreras, noticias, etc.)
│   ├── admin/                    # Panel de administración (prototipo)
│   └── README.md                # Documentación del wireframe
│
└── README.md                    # Este archivo
```

## Tecnologías

### App (Full-Stack - En Desarrollo)
- **Frontend**: React 19, Vite 6, TailwindCSS 4, Zustand, React Router 7, TipTap, React Hook Form, Zod
- **Backend**: Express 5, Sequelize, SQLite (desarrollo) / PostgreSQL (producción), JWT, bcryptjs, Winston
- **Testing**: Jest + Supertest (backend), Vitest + Testing Library (frontend)
- **Despliegue**: Docker, Nginx, certificados SSL

### Wireframe (Prototipo Estático)
- HTML5, CSS3 (Variables, Grid, Flexbox), JavaScript Vanilla

## Características Planificadas

### Sitio Público
- Landing Page con hero, estadísticas, carreras destacadas, noticias, eventos, testimonios y galería
- Página de Carreras con tabs interactivos (descripción, malla curricular, requisitos, horarios)
- Página de Noticias con filtros, búsqueda, categorías y paginación
- Portal del Estudiante con accesos rápidos y tabla de horarios
- Página de Contacto con formulario funcional

### Back Office (Admin Dashboard)
- Dashboard principal con estadísticas y actividad reciente
- Gestión de Noticias, Carreras, Eventos, Testimonios y Galería
- Gestión de Usuarios con roles (Administrador, Profesor, Tutor)
- Personalización del Sitio (colores, temas, layout, secciones, tipografía)

## Comenzar

### App (Desarrollo)
1. Clonar el repositorio
2. Entrar a `App/` y seguir las instrucciones de `README.md`
3. Usar Docker con Makefile:
   ```bash
   cd App
   make help          # Ver comandos disponibles
   make dev           # Iniciar entorno de desarrollo
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000/api

### Wireframe (Prototipo)
- Sitio público: abrir `wireframe/public/index.html` en un navegador
- Panel admin: abrir `wireframe/admin/dashboard.html` en un navegador

## Equipo

**GoSoftware** - Proyecto Integrador  
IFTS 29 - Desarrollo de Software

---

> ⚠️ **Nota**: Este proyecto está en fase de desarrollo. La estructura, tecnologías y funcionalidades descritas son la base actual y pueden sufrir modificaciones a medida que avance el proyecto.
