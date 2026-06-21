# Auditoría del Frontend — archivos fantasma/duplicados y estado de TypeScript

**Fecha:** 2026-06-21
**Alcance:** `BASE/App/frontend` (React + Vite 6 + Zustand + TailwindCSS)

---

## 1. Resumen ejecutivo

Se detectaron y **eliminaron 9 archivos fantasma** (gemelos muertos `.jsx`/`.tsx` que la app
nunca usaba) y se documentó que **TypeScript no está realmente en uso**: existen archivos `.ts/.tsx`
con tipos, pero no hay compilador, ni configuración, ni verificación. Decisión del equipo:
**estandarizar a JavaScript**.

---

## 2. Por qué existían archivos fantasma (la causa raíz)

Varios componentes existían como **dos archivos con el mismo nombre** en el mismo directorio
(`Foo.jsx` y `Foo.tsx`). Vite resuelve **uno solo**; el otro queda como código muerto: nadie lo
usa, pero sigue en el repo y se edita por error.

**Orden de resolución de Vite** (no hay `resolve.extensions` custom en `vite.config.js`, así que
usa el default):

```
['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
```

Consecuencias:

- En un **import sin extensión** (`import X from './X'`), **`.jsx` gana a `.tsx`** y un archivo gana
  a un directorio del mismo nombre.
- En un **import con extensión explícita** (`import X from './X.tsx'`), gana exactamente lo escrito.

En `AppRouter.jsx` las 7 páginas admin se importan con `.tsx` **explícito**, por eso el gemelo vivo
es el `.tsx` y el muerto es el `.jsx` (un stub placeholder). En cambio `AdminLayout` se importa
**sin** extensión → ganó el `.jsx`, dejando muerto el `.tsx`. Este caso invertido es justamente el
más peligroso, porque el trabajo responsive reciente vivía en el `.jsx` mientras el `.tsx` viejo
quedaba como trampa.

---

## 3. Archivos eliminados (9)

| # | Archivo eliminado (muerto) | Vivo (conservado) | Motivo |
|---|---|---|---|
| 1 | `src/components/layout/AdminLayout/AdminLayout.tsx` | `AdminLayout.jsx` (responsive) | Import bare → gana `.jsx`; el `.tsx` quedó viejo |
| 2 | `src/pages/admin/AjustesPage/AjustesPage.jsx` | `AjustesPage.tsx` | Router importa `.tsx` explícito; el `.jsx` era stub |
| 3 | `src/pages/admin/DashboardPage/DashboardPage.jsx` | `DashboardPage.tsx` | ídem |
| 4 | `src/pages/admin/EventosPage/EventosPage.jsx` | `EventosPage.tsx` | ídem |
| 5 | `src/pages/admin/GaleriaPage/GaleriaPage.jsx` | `GaleriaPage.tsx` | ídem |
| 6 | `src/pages/admin/NoticiasPage/NoticiasPage.jsx` | `NoticiasPage.tsx` | ídem |
| 7 | `src/pages/admin/PersonalizarPage/PersonalizarPage.jsx` | `PersonalizarPage.tsx` | ídem |
| 8 | `src/pages/admin/TestimoniosPage/TestimoniosPage.jsx` | `TestimoniosPage.tsx` | ídem |
| 9 | `src/pages/admin/UsuariosPage/` (subdir: `UsuariosPage.jsx` + `.gitkeep`) | `src/pages/admin/UsuariosPage.tsx` | Import bare resuelve al archivo, no al subdirectorio |

Verificación previa al borrado: ningún archivo importaba explícitamente a estos 9.
Verificación posterior: 0 referencias rotas y 0 pares de basename duplicados restantes.

---

## 4. Estado de TypeScript: "de nombre", no real

Hay archivos `.ts/.tsx` con anotaciones de tipo reales (interfaces, generics, `z.infer`), pero
**no se verifican nunca**:

| Señal | Estado |
|---|---|
| Paquete `typescript` instalado | ❌ No está en `package.json` |
| `@types/*` | ❌ Ninguno |
| `tsconfig.json` / `jsconfig.json` | ❌ No existen |
| `tsc` en el build | ❌ El build es solo `vite build` |
| ESLint sobre `.ts/.tsx` | ❌ Solo cubre `--ext js,jsx` |
| Punto de entrada | `index.html` → `src/main.jsx` (JS) |

**Implicancia:** un error de tipos (`const x: string = 123`) **no rompería el build**. Los tipos
funcionan solo como documentación, sin seguridad real.

### Conteo de archivos por extensión (tras la limpieza)

| Extensión | Cantidad |
|---|---|
| `.jsx` | 112 |
| `.js`  | 32 |
| `.tsx` | 26 |
| `.ts`  | 13 |

≈ **78% JavaScript** (`.jsx/.js`) vs **22% TypeScript** (`.tsx/.ts`).

---

## 5. Decisión y pasos siguientes: estandarizar a JavaScript

Se eligió **estandarizar a JS** (coincide con la mayoría del código y con la toolchain actual).
Esta conversión **no se ejecutó** en esta tarea; queda como trabajo siguiente:

1. Convertir los `.ts/.tsx` vivos a `.jsx/.js`, quitando anotaciones de tipo:
   - Stores: `src/stores/*.ts` (`categoriasStore`, `eventosStore`, `noticiasStore`, `testimoniosStore`,
     `usuariosStore`, `galeriaStore`, `consultasStore`, `siteConfigStore`).
   - Páginas admin `.tsx` y modales `.tsx` (`src/components/admin/*.tsx`).
2. Quitar tipos: `interface`, generics `create<...>()`, `useForm<...>()`, `z.infer<...>`,
   anotaciones `: Tipo`, e imports de tipos (`Column`, `User`, etc.).
3. Actualizar imports `.tsx` explícitos en `src/AppRouter.jsx` a bare o `.jsx`.

**Alternativa futura** (si se quiere seguridad de tipos real, en vez de quitar TS): instalar
`typescript`, agregar `tsconfig.json` y `tsc --noEmit` al build, y `@typescript-eslint` al lint.
La decisión actual, no obstante, es JS.

---

## 6. Hallazgos secundarios (documentados, no modificados)

Duplicación de **funcionalidad** (no de nombre de archivo) detectada para futuras mejoras:

- **Modales de detalle ~95% idénticos:** `components/public/EventoDetailModal` y
  `components/public/NoticiaDetailModal` → extraer un `DetailModal` genérico configurable.
- **3 carruseles con lógica repetida:** `TestimonialsCarousel`, `CareerCarousel`, `GaleriaCarousel`
  (índice, navegación, paginación por puntos, `useScrollReveal`) → extraer un `BaseCarousel`.
- **Capa de Contexts redundante:** `ThemeContext`, `ToastContext`, `LayoutContext` son envoltorios
  delgados sobre `uiStore` (Zustand) → se podrían consumir los hooks de Zustand directamente.
  `AuthContext` sí tiene lógica propia, conviene mantenerlo.
- `src/utils/` está vacío (solo `.gitkeep`); utilidades como `categoriaUtils.js` podrían centralizarse ahí.

Estos puntos **no** afectan el funcionamiento actual; son deuda técnica de mantenibilidad.

---

## 7. Cómo verificar

1. `grep -rn "AdminLayout.tsx\|UsuariosPage/UsuariosPage" src/` → 0 resultados. ✅ (ya verificado)
2. `find src -name "*.jsx" -o -name "*.tsx" | sed -E 's/\.(jsx|tsx)$//' | sort | uniq -d` → vacío. ✅
3. Levantar el frontend (`npm run dev` en `BASE/App/frontend`) y recorrer `/admin/*`
   (dashboard, usuarios, eventos, noticias, testimonios, galería, personalizar, ajustes) +
   `AdminLayout` con sidebar responsive.
4. `npm run build` debe completar sin errores de módulo no encontrado.
