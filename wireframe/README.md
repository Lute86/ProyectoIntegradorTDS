# IFTS 29 - Nueva Página Web Dinámica

> **Proyecto Integrador** - GoSoftware  
> Instituto de Formación Técnica Superior N° 29

## Descripción

Wireframe interactivo y funcional para el rediseño de la página web del IFTS 29. Este prototipo incluye tanto el sitio público como un panel de administración completo (back office) que permite gestionar contenido, usuarios y la apariencia del sitio de forma dinámica.

## Estructura del Proyecto

```
PI/
├── public/                     # Sitio público
│   ├── index.html              # Landing page principal
│   ├── carreras.html           # Detalle de carreras
│   ├── noticias.html           # Listado de noticias
│   ├── estudiantes.html        # Portal del estudiante
│   ├── contacto.html           # Formulario de contacto
│   ├── styles/
│   │   └── main.css            # Estilos del sitio público
│   └── js/
│       └── main.js             # Scripts del sitio público
│
└── admin/                      # Panel de administración
    ├── dashboard.html          # Back office completo
    ├── styles/
    │   └── admin.css           # Estilos del admin
    └── js/
        └── admin.js            # Scripts del admin
```

## Características

### Sitio Público

- **Landing Page** con hero, estadísticas, carreras destacadas, noticias, eventos, testimonios en carousel y galería
- **Página de Carreras** con tabs interactivos (descripción, malla curricular, requisitos, horarios)
- **Página de Noticias** con filtros, búsqueda, categorías y paginación
- **Portal del Estudiante** con accesos rápidos, tabla de horarios y enlaces útiles
- **Página de Contacto** con formulario funcional e información de contacto
- **Diseño responsive** adaptado a móviles y tablets

### Back Office (Admin Dashboard)

- **Dashboard principal** con estadísticas, actividad reciente y accesos rápidos
- **Gestión de Noticias** - Crear, editar, eliminar y publicar noticias con categorías
- **Gestión de Carreras** - Administrar carreras, duración, modalidad y estado
- **Gestión de Eventos** - Crear y administrar eventos del instituto
- **Galería** - Subir, organizar y eliminar imágenes
- **Testimonios** - Administrar testimonios de estudiantes/egresados
- **Gestión de Usuarios** - Crear y administrar usuarios con roles:
  - **Administrador** - Control total del sitio
  - **Profesor** - Gestión de contenido académico
  - **Tutor** - Acompañamiento estudiantil

### Personalización del Sitio

- **Colores** - Color picker individual para primario, secundario, acento y fondo
- **Temas predefinidos** - Clásico, Oscuro, Naturaleza, Cálido
- **Layout** - Selector de disposición: Navbar superior, Sidebar lateral o Minimalista
- **Secciones visibles** - Drag & drop para reordenar y toggles para mostrar/ocultar:
  - Hero/Banner principal
  - Estadísticas
  - Carreras
  - Últimas noticias
  - Próximos eventos
  - Testimonios
  - Galería
- **Tipografía** - Selección de fuente, tamaño base y redondeo de bordes
- **Ajustes generales** - Nombre del sitio, contacto, SEO, footer

## Cómo Usar

1. Abrir `public/index.html` en un navegador para ver el sitio público
2. Abrir `admin/dashboard.html` en un navegador para acceder al panel de administración
3. Navegar entre las secciones del admin usando el menú lateral
4. Probar la personalización del sitio en la sección "Personalizar Sitio"

## Tecnologías

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox)
- JavaScript Vanilla (sin frameworks)

## Equipo

**GoSoftware** - Proyecto Integrador  
IFTS 29 - Desarrollo de Software

---

> Este wireframe es un prototipo funcional a nivel frontend. La persistencia de datos, autenticación y backend se implementarán en fases posteriores del proyecto.
