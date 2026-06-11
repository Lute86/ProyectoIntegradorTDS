# IFTS 29 - Nuevo Sistema de Estilos

> Documentacion completa de los estilos modernizados del sitio publico IFTS 29.
> Incluye animaciones, patrones de componentes, sistema de colores y dark/light mode.

---

## Tabla de Contenidos

1. [Resumen de Cambios](#1-resumen-de-cambios)
2. [Sistema de Animaciones](#2-sistema-de-animaciones)
3. [Patrones de Componentes](#3-patrones-de-componentes)
4. [Sistema de Colores](#4-sistema-de-colores)
5. [Modo Oscuro / Claro](#5-modo-oscuro--claro)
6. [Plan de Implementacion](#6-plan-de-implementacion)
7. [Checklist de Componentes](#7-checklist-de-componentes)
8. [Riesgos y Mitigaciones](#8-riesgos-y-mitigaciones)

---

## 1. Resumen de Cambios

### Objetivo
Modernizar la visual del sitio publico con:
- Animaciones suaves y progresivas
- Tarjetas con efecto glassmorphism en fondos oscuros
- Gradientes fluidos entre secciones
- Paleta de colores coherente
- Soporte para modo oscuro/claro

### Estado actual vs. requerido

| Aspecto | Estado actual | Estado requerido |
|---------|--------------|------------------|
| `dark:` variants | 0% - ningun componente usa dark: | 100% - todos los componentes publicos |
| Keyframes/animaciones | 0% - no existe ningun @keyframes | 10 keyframes + 9 clases + 7 delays |
| useScrollReveal | 0% - no existe el hook | Hook + integrado en 7 secciones |
| Glass card pattern | 0% - border-gray-200 rounded-xl | glass (oscuro) + light (claro) con hover effects |
| Section backgrounds | bg-slate-50 o var(--clr-bg) | Gradientes from-slate-X to-slate-Y |
| Theme toggle en Navbar | 0% - no existe boton | Icono sol/luna en Navbar |
| prefers-reduced-motion | 0% - no existe en CSS | Media query en globals.css |
| Transicion de tema | 0% - cambio instantaneo | transition 0.3s en * |

### Paleta Principal

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-primary` | `#2563eb` | Acciones principales, enlaces |
| `--color-secondary` | `#10b981` | Elementos secundarios, nav activo |
| `--color-accent` | `#f59e0b` | CTA, badges, highlights |
| `--color-bg` | `#ffffff` | Fondo de pagina (claro) |
| `--color-text` | `#111827` | Texto principal |
| `--clr-surface` | `#1e293b` | Superficie navbar/header |

**Nota:** Estas variables YA EXISTEN en `globals.css` y se inyectan via `App.jsx`. No requiere cambios.

---

## 2. Sistema de Animaciones

### 2.1 Archivo destino: `src/styles/globals.css`

Agregar al final del archivo, despues de `.layout-full`.

### 2.2 Keyframes (10 animaciones)

Ver `src/styles/animations-addendum.css` para el codigo exacto a copiar.

| Keyframe | Propiedades | Uso |
|----------|-------------|-----|
| `fadeInUp` | `opacity: 0→1`, `translateY: 24px→0` | Entrada de contenido general |
| `fadeIn` | `opacity: 0→1` | Aparicion simple |
| `scaleIn` | `opacity: 0→1`, `scale: 0.95→1` | Elementos que crecen |
| `slideInLeft` | `opacity: 0→1`, `translateX: -24px→0` | Contenido desde izquierda |
| `slideInRight` | `opacity: 0→1`, `translateX: 24px→0` | Contenido desde derecha |
| `shimmer` | `background-position: -200%→200%` | Loading states (infinito) |
| `float` | `translateY: 0→-6px→0` | Elementos decorativos (3s infinito) |
| `countUp` | `opacity: 0→1`, `translateY: 8px→0` | Numeros estadisticos |
| `pulseGlow` | `box-shadow: 0→8px→0` | Botones CTA pulsantes (2s infinito) |
| `gradientShift` | `background-position: 0%→100%` | Fondos animados (3s infinito) |

### 2.3 Clases Utilitarias de Animacion

| Clase | Keyframe | Duracion | Uso esperado |
|-------|----------|----------|-------------|
| `.animate-fade-in-up` | fadeInUp | 0.6s | Secciones al hacer scroll |
| `.animate-fade-in` | fadeIn | 0.5s | Aparicion simple |
| `.animate-scale-in` | scaleIn | 0.4s | Cards al hover |
| `.animate-slide-in-left` | slideInLeft | 0.5s | Contenido lateral |
| `.animate-slide-in-right` | slideInRight | 0.5s | Contenido lateral |
| `.animate-float` | float | 3s | Iconos decorativos |
| `.animate-pulse-glow` | pulseGlow | 2s | Botones CTA |
| `.animate-gradient` | gradientShift | 3s | Fondos de seccion |
| `.animate-shimmer` | shimmer | 1.5s | Skeleton loading |

### 2.4 Clases de Delay

| Clase | Delay |
|-------|-------|
| `.delay-75` | 75ms |
| `.delay-100` | 100ms |
| `.delay-150` | 150ms |
| `.delay-200` | 200ms |
| `.delay-300` | 300ms |
| `.delay-400` | 400ms |
| `.delay-500` | 500ms |

### 2.5 Scroll Reveal Hook

**Archivo nuevo:** `src/hooks/useScrollReveal.js`

Ya existe como archivo separado listo para copiar (ver `src/hooks/useScrollReveal.js`).

**Secciones que lo usaran:**
| Seccion | Duracion | Notas |
|---------|----------|-------|
| Stats | 700ms | Default |
| CareerCarousel | 700ms | Default |
| NewsSection | 700ms | Default |
| EventosSection | **1000ms** | Mas lento (solicitado) |
| TestimonialsCarousel | 700ms | Default |
| GaleriaCarousel | 700ms | Default |

### 2.6 prefers-reduced-motion

Agregar en `globals.css` (incluido en `animations-addendum.css`).

---

## 3. Patrones de Componentes

### 3.1 Tarjetas (Cards) - Mapa de cambios

#### Tipo 1: Glass Card (Modo Oscuro)
**Uso:** NewsCard, EventosCard, Galeria, Testimonios

**Cambio exacto en cada componente:**
```
// ANTES:
className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"

// DESPUES:
className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 
           hover:bg-white/15 hover:shadow-xl hover:-translate-y-1 
           transition-all duration-300"
```

#### Tipo 2: Light Card (Modo Claro)
**Uso:** CarrerasPage, NoticiasPage, EventosPage

```
// ANTES:
className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"

// DESPUES:
className="bg-white rounded-2xl shadow-sm border border-gray-100 
           hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
```

#### Tipo 3: Stat Card
**Uso:** Stats.jsx, StatItem.jsx

```
// Contenedor icono - ANTES:
className="text-3xl md:text-4xl font-bold text-blue-600"

// Contenedor icono - DESPUES (dark: agregado):
className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400"
```

#### Tipo 4: Carousel Card (Galeria)
```
// ANTES (contenedor):
className="rounded-xl shadow-sm overflow-hidden"

// DESPUES (glass):
className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"

// Imagen hover - ANTES:
className="hover:scale-105 transition-transform duration-500"

// DESPUES:
className="group-hover:scale-110 transition-transform duration-500"
```

### 3.2 Botones - Mapa de cambios

#### Nav buttons (carousel prev/next)
```
// ANTES:
className="w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm hover:bg-slate-100 text-sm transition-colors"

// DESPUES (modo oscuro):
className="w-12 h-12 flex items-center justify-center bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-full shadow-lg hover:bg-white/20 dark:hover:bg-white/20 text-white dark:text-white transition-all"

// DESPUES (modo claro):
className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-100 border border-slate-200 dark:border-slate-200 rounded-full shadow-lg hover:bg-slate-200 dark:hover:bg-slate-200 text-slate-700 dark:text-slate-700 transition-all"
```

#### CTA primary
```
// ANTES (seccion clara):
className="inline-flex... bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"

// DESPUES (seccion clara):
className="inline-flex... bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
```

#### CTA secondary (Hero outline)
```
// ANTES:
className="inline-flex... border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"

// DESPUES:
className="inline-flex... border-2 border-white/80 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white hover:shadow-lg transition-all duration-300"
```

### 3.3 Badges - Mapa de cambios

**Archivo:** `src/components/ui/Badge/Badge.jsx`

```
// ANTES (variants):
const variants = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  ...
}

// DESPUES (con dark:):
const variants = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  ...
}
```

### 3.4 Carruseles - Patron Compartido

**Archivos afectados:** NewsSection, EventosSection, CareerCarousel, GaleriaCarousel

Cambios:
- `rounded-xl` → `rounded-2xl`
- Botones nav: patron de boton carousel (ver 3.2)
- Dots: patron del sistema de estilos
- `transition-transform duration-500 ease-in-out` se mantiene

### 3.5 Gradientes de Texto

Agregar a titulos principales donde corresponda:
```jsx
className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
```

### 3.6 Etiquetas de Seccion

Badge tipo "section tag" para encabezados de seccion (Novedades, Calendario, etc.):
```jsx
// Modo oscuro:
className="inline-block px-4 py-1.5 bg-white/10 text-{color}-300 rounded-full text-xs font-semibold uppercase tracking-wider"

// Modo claro:
className="inline-block px-4 py-1.5 bg-{color}-100 text-{color}-700 rounded-full text-xs font-semibold uppercase tracking-wider"
```

---

## 4. Sistema de Colores

### 4.1 Variables CSS - YA EXISTEN en globals.css

No requiere cambios. Las variables `--color-*` y `--clr-*` ya estan definidas y se inyectan desde `App.jsx`.

### 4.2 Mapeo Tailwind (@theme) - YA EXISTE en globals.css

No requiere cambios.

### 4.3 Fuentes - YA EXISTEN

### 4.4 Ancho de Contenido

Agregar a `globals.css` en `@theme`:
```
--width-content-narrow: 81rem;
```

---

## 5. Modo Oscuro / Claro

### 5.1 Arquitectura - YA EXISTE

| Componente | Estado |
|------------|--------|
| `uiStore.js` | ✅ Tema en estado, persiste a localStorage |
| `ThemeContext.jsx` | ✅ Escucha cambios, toggle clase `dark`, respeta prefers-color-scheme |
| `useThemeStyles.js` | ✅ Inyecta variables CSS `--clr-*` |
| `App.jsx` | ✅ Inyecta variables CSS `--color-*` y `--clr-*` |

**Lo que falta:** Ningun componente usa las clases `dark:` de Tailwind. El toggle de clase `dark` en `<html>` funciona pero no produce cambios visuales.

### 5.2 Toggle en Navbar - NUEVO

**Archivo:** `src/components/layout/PublicLayout/Navbar/Navbar.jsx`

Agregar boton de alternar tema entre `Admin` y el hamburger menu:
```jsx
import { useTheme } from '../../../../contexts/ThemeContext/ThemeContext';

// Dentro del componente:
const { theme, toggleTheme } = useTheme();

// En el JSX, antes del boton Admin:
<button
  onClick={toggleTheme}
  className="px-2 py-2 rounded-md text-sm text-white/70 hover:text-white transition-colors"
  aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
```

**Archivo:** `src/components/layout/PublicLayout/Navbar/MobileMenu.jsx`

Agregar mismo boton en el menu movil.

### 5.3 Tabla de Cambios por Componente

#### Secciones Homepage - Backgrounds

| Seccion | Modo Oscuro (NUEVO) | Modo Claro (ACTUAL) |
|---------|--------------------|---------------------|
| **Hero** | `from-black/60 via-black/40 to-transparent` (sin cambios) | Igual |
| **Stats** | `from-slate-900 via-slate-800 to-slate-900` | `var(--clr-bg)` → `from-slate-100 via-white to-slate-100` |
| **CareerCarousel** | `from-slate-800 to-slate-700` | `var(--clr-bg)` → `from-white to-slate-50` |
| **NewsSection** | `from-slate-700 to-slate-600` | `var(--clr-bg)` → `from-slate-50 to-white` |
| **EventosSection** | `from-slate-600 to-slate-500` | `var(--clr-bg)` → `from-white to-slate-50` |
| **Testimonials** | `from-slate-500 to-slate-400` | `var(--clr-bg)` → `from-slate-50 to-slate-100` |
| **Galeria** | `from-slate-400 to-slate-300` | `var(--clr-bg)` → `from-slate-100 to-slate-200` |
| **Footer** | `from-slate-900 via-slate-800 to-slate-900` (sin cambios) | Igual |

#### Paginas Publicas - Backgrounds

| Pagina | Modo Oscuro (NUEVO) | Modo Claro (ACTUAL) |
|--------|--------------------|---------------------|
| **CarrerasPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |
| **CarreraDetailPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |
| **NoticiasPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |
| **NoticiaDetailPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |
| **EventosPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |
| **ContactoPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |
| **EstudiantesPage** | `from-slate-600 to-slate-500` | `bg-slate-50` |

#### Cards

| Tipo | Modo Oscuro (NUEVO) | Modo Claro (NUEVO) |
|------|--------------------|--------------------|
| **Glass card** | `bg-white/10 backdrop-blur-sm border-white/20` | `bg-white border-gray-100 shadow-sm` |
| **Light card** | `bg-white/10 backdrop-blur-sm border-white/20` | `bg-white border-gray-100 shadow-sm` |
| **Stat icon** | `bg-white/10 text-white` | `bg-blue-50 text-blue-600` |
| **Carousel card** | `bg-white/10 backdrop-blur-sm` | `bg-white shadow-sm` |

#### Textos

| Elemento | Modo Oscuro (NUEVO) | Modo Claro (ACTUAL) |
|----------|--------------------|---------------------|
| **Titulos** | `text-white` | `text-slate-900` |
| **Subtitulos** | `text-white/80` | `text-slate-600` |
| **Cuerpo** | `text-white/70` | `text-slate-600` |
| **Muted** | `text-white/50` | `text-slate-400` |
| **Enlaces** | `text-blue-400 hover:text-blue-300` | `text-blue-600 hover:text-blue-700` |

### 5.4 Transicion Global de Tema

Agregar en `globals.css`:
```css
* { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
```

---

## 6. Plan de Implementacion

### Fase 1: Infraestructura (archivos nuevos, sin tocar componentes existentes)
**Orden:** 1

| # | Tarea | Archivos | Tiempo |
|---|-------|----------|--------|
| 1.1 | Agregar keyframes + animaciones + prefers-reduced-motion + transition a globals.css | `src/styles/globals.css` | 10 min |
| 1.2 | Crear hook useScrollReveal.js | `src/hooks/useScrollReveal.js` | 10 min |
| 1.3 | Agregar --width-content-narrow a @theme | `src/styles/globals.css` | 2 min |

### Fase 2: Theme Toggle en Navbar
**Orden:** 2 (depende de ThemeContext que ya existe)

| # | Tarea | Archivos | Tiempo |
|---|-------|----------|--------|
| 2.1 | Agregar boton theme toggle en Navbar | `Navbar.jsx` | 10 min |
| 2.2 | Agregar boton theme toggle en MobileMenu | `MobileMenu.jsx` | 5 min |

### Fase 3: Componentes Publicos (seccion por seccion)
**Orden:** 3 (depende de Fase 1)

| # | Tarea | Archivos | Tiempo |
|---|-------|----------|--------|
| 3.1 | Actualizar Badge.jsx con dark: variants | `Badge.jsx` | 5 min |
| 3.2 | Actualizar Hero (botones rounded-xl, hover efectos) | `Hero.jsx` | 10 min |
| 3.3 | Actualizar Stats + StatItem (dark: text, animacion) | `Stats.jsx`, `StatItem.jsx` | 10 min |
| 3.4 | Actualizar CareerCard (glass/light card, dark:) | `CareerCard.jsx` | 10 min |
| 3.5 | Actualizar CareerCarousel (background gradiente, botones) | `CareerCarousel.jsx` | 10 min |
| 3.6 | Actualizar NewsCard (glass/light card, dark:) | `NewsCard.jsx` | 10 min |
| 3.7 | Actualizar NewsSection (background gradiente, botones, scroll reveal) | `NewsSection.jsx` | 15 min |
| 3.8 | Actualizar EventosCard (glass/light card, dark:) | `EventosCard.jsx` | 10 min |
| 3.9 | Actualizar EventosSection (background gradiente, botones, scroll reveal) | `EventosSection.jsx` | 15 min |
| 3.10 | Actualizar TestimonialSlide (dark: text) | `TestimonialSlide.jsx` | 5 min |
| 3.11 | Actualizar TestimonialsCarousel (background gradiente, scroll reveal) | `TestimonialsCarousel.jsx` | 10 min |
| 3.12 | Actualizar GaleriaCarousel (glass/light card, gradiente, scroll reveal) | `GaleriaCarousel.jsx` | 15 min |
| 3.13 | Actualizar Footer (gradiente) | `Footer.jsx` | 5 min |

### Fase 4: Paginas Publicas
**Orden:** 4 (independiente, puede ir en paralelo con Fase 3)

| # | Tarea | Archivos | Tiempo |
|---|-------|----------|--------|
| 4.1 | Actualizar CarrerasPage (background gradiente, dark:) | `CarrerasPage.jsx` | 10 min |
| 4.2 | Actualizar CarreraDetailPage (background gradiente) | `CarreraDetailPage.jsx` | 5 min |
| 4.3 | Actualizar NoticiasPage (background gradiente, dark:) | `NoticiasPage.jsx` | 10 min |
| 4.4 | Actualizar NoticiaDetailPage (dark:) | `NoticiaDetailPage.jsx` | 5 min |
| 4.5 | Actualizar EventosPage (background gradiente, dark:) | `EventosPage.jsx` | 10 min |
| 4.6 | Actualizar ContactoPage (background gradiente, dark:) | `ContactoPage.jsx` | 10 min |
| 4.7 | Actualizar EstudiantesPage (background gradiente, dark:) | `EstudiantesPage.jsx` | 10 min |

### Fase 5: Verificacion
**Orden:** 5

| # | Tarea | Tiempo |
|---|-------|--------|
| 5.1 | Build sin errores (`npm run build`) | 2 min |
| 5.2 | Verificar modo claro en homepage | 5 min |
| 5.3 | Verificar modo oscuro en homepage | 5 min |
| 5.4 | Verificar todas las paginas publicas en ambos modos | 10 min |
| 5.5 | Verificar prefers-reduced-motion | 3 min |
| 5.6 | Verificar que admin sigue funcionando (sin cambios de estilo) | 5 min |
| 5.7 | Ejecutar tests existentes | `make tests-frontend` |

---

## 7. Checklist de Componentes

### Componentes a modificar (~25 archivos)

| # | Archivo | Cambios principales |
|---|---------|-------------------|
| 1 | `src/styles/globals.css` | +keyframes, +animaciones, +transition, +prefers-reduced-motion, +width-content-narrow |
| 2 | `src/hooks/useScrollReveal.js` | ARCHIVO NUEVO |
| 3 | `src/components/ui/Badge/Badge.jsx` | dark: variants en colores |
| 4 | `src/components/public/Hero/Hero.jsx` | CTA buttons: rounded-xl + shadow + scale |
| 5 | `src/components/public/Stats/Stats.jsx` | background gradient + scroll reveal |
| 6 | `src/components/public/Stats/StatItem.jsx` | dark:text-blue-400, scroll reveal |
| 7 | `src/components/public/CareerCards/CareerCard.jsx` | glass/light card pattern + dark: text |
| 8 | `src/components/public/CareerCards/CareerCards.jsx` | bg gradient + dark: |
| 9 | `src/components/public/CareerCarousel/CareerCarousel.jsx` | bg gradient + botones carousel + dark: + scroll reveal |
| 10 | `src/components/public/NewsSection/NewsCard.jsx` | glass/light card + dark: text |
| 11 | `src/components/public/NewsSection/NewsSection.jsx` | bg gradient + botones carousel + dark: + scroll reveal |
| 12 | `src/components/public/EventosSection/EventosCard.jsx` | glass/light card + dark: text |
| 13 | `src/components/public/EventosSection/EventosSection.jsx` | bg gradient + botones carousel + dark: + scroll reveal |
| 14 | `src/components/public/TestimonialsCarousel/TestimonialSlide.jsx` | dark: text colors |
| 15 | `src/components/public/TestimonialsCarousel/TestimonialsCarousel.jsx` | bg gradient + botones + dark: + scroll reveal |
| 16 | `src/components/public/GaleriaCarousel/GaleriaCarousel.jsx` | glass/light card + bg gradient + botones + dark: + scroll reveal |
| 17 | `src/components/layout/PublicLayout/Footer/Footer.jsx` | gradient bg (ya es oscuro) |
| 18 | `src/components/layout/PublicLayout/Navbar/Navbar.jsx` | +theme toggle button |
| 19 | `src/components/layout/PublicLayout/Navbar/MobileMenu.jsx` | +theme toggle button |
| 20 | `src/pages/public/CarrerasPage/CarrerasPage.jsx` | bg gradient + dark: |
| 21 | `src/pages/public/CarrerasPage/CarreraDetailPage.jsx` | bg gradient + dark: |
| 22 | `src/pages/public/NoticiasPage/NoticiasPage.jsx` | bg gradient + dark: |
| 23 | `src/pages/public/NoticiasPage/NoticiaDetailPage.jsx` | dark: |
| 24 | `src/pages/public/EventosPage/EventosPage.jsx` | bg gradient + dark: |
| 25 | `src/pages/public/ContactoPage/ContactoPage.jsx` | bg gradient + dark: |
| 26 | `src/pages/public/EstudiantesPage/EstudiantesPage.jsx` | bg gradient + dark: |

### Componentes que NO se tocan

| Archivo | Motivo |
|---------|--------|
| Todo `components/admin/` | Admin debe mantener su estilo actual (Tailwind puro) |
| Todo `pages/admin/` | Admin debe mantener su estilo actual |
| Todo `components/ui/` excepto Badge | Componentes base UI no cambian |
| `stores/*` | Sin cambios logicos |
| `services/*` | Sin cambios logicos |
| `contexts/*` | Ya implementan el sistema de tema |
| `App.jsx`, `AppRouter.jsx` | Sin cambios necesarios |

---

## 8. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| `* { transition }` global causa parpadeo al cargar | Baja | Medio | Limitar a `background-color`, `color`, `border-color` (evitar `all`) |
| Glassmorphism (backdrop-blur) no funciona en Firefox Linux | Baja | Bajo | El fallback natural (bg-white/10 sin blur) se ve bien igual |
| Regresion en componentes admin por cambios globales | Ninguna | Critico | Admin usa Tailwind puro sin `var(--clr-*)` ni `dark:` — aislado por diseno |
| Scroll reveal causa layout shift en SSR | Baja | Medio | El hook inicia con `isVisible: true` (SSR-safe) y solo cambia a `false` en cliente |
| Tests existentes se rompen por cambios de clases | Media | Medio | Tests usan getByText, no selectores de clase. Correr tests despues de cada fase |
| Tema oscuro no persiste al recargar | Baja | Medio | uiStore ya persiste a localStorage. Verificar que se lee al iniciar |

---

## Apendice: Dependencias entre fases

```
Fase 1 (infraestructura CSS + hook)
  |
  v
Fase 2 (theme toggle Navbar) ──┐
                               ├── pueden ejecutarse en paralelo
Fase 3 (componentes publicos) ─┘
  |
  v
Fase 4 (paginas publicas) ── puede ejecutarse en paralelo con Fase 3
  |
  v
Fase 5 (verificacion)
```

Tiempo total estimado: **2-3 horas** distribuidas en 5 fases.

---

## Archivos Relacionados

| Archivo | Proposito |
|---------|----------|
| `src/styles/globals.css` | Keyframes, clases utilitarias, variables |
| `src/styles/animations-addendum.css` | Codigo exacto a copiar a globals.css |
| `src/hooks/useScrollReveal.js` | IntersectionObserver para scroll reveal (ARCHIVO NUEVO) |
| `src/hooks/useThemeStyles.js` | Inyeccion de variables CSS `--clr-*` (YA EXISTE) |
| `src/stores/uiStore.js` | Estado del tema light/dark (YA EXISTE) |
| `src/contexts/ThemeContext.jsx` | Toggle y persistencia del tema (YA EXISTE) |
| `src/stores/siteConfigStore.ts` | Configuracion por defecto de colores (YA EXISTE) |

---

## Changelog

| Fecha | Cambio |
|-------|--------|
| 2026-06-10 | Documentacion inicial del sistema de estilos |
| 2026-06-10 | Propuesta de dark/light mode |
| 2026-06-10 | Agregado Plan de Implementacion con fases, checklist y riesgos |

---

*Documento generado para el proyecto IFTS 29 Nueva Web*
