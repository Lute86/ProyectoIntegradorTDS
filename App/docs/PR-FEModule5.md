# Pull Request - Modulo 5: Personalizacion y Configuracion del Sitio

**Autor:** Andres (FE Dev 2)
**Rama:** `feature/fe-modulo5-personalizacion`
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, @dnd-kit/core, @dnd-kit/sortable

---

## Resumen

Implementacion completa del motor de personalizacion visual y configuracion del sitio del IFTS 29. Se construyeron 2 paginas principales con 7 sub-componentes especializados, un store centralizado de configuracion y un sistema de drag & drop para reordenar secciones. Toda la personalizacion se refleja en tiempo real a traves del PreviewPanel.

---

## Paginas Construidas

| Pagina | Ruta | Componentes Integrados |
|--------|------|-----------------------|
| PersonalizarPage | `/admin/personalizar` | ThemePresets, ColorPicker, TypographyConfig, LayoutSelector, SectionManager, PreviewPanel |
| AjustesPage | `/admin/ajustes` | GeneralSettings, SEOSettings, SocialSettings |

---

## Componentes Base y de UI Creados

| Componente | Ubicacion | Proposito |
|------------|-----------|-----------|
| ColorPicker | `src/components/ui/ColorPicker.tsx` | Selector de color con input type="color" oculto y 15 colores predefinidos en circulos. Resalta el color activo con `scale-110` |
| ThemePresets | `src/components/admin/ThemePresets.tsx` | 4 tarjetas (Moderno, Clasico, Oscuro, Vibrante) con barra visual de colores. Al hacer clic aplica la paleta completa via `updateColors` |
| TypographyConfig | `src/components/admin/TypographyConfig.tsx` | 3 selects para fuente de titulos (5 opciones), fuente de texto (5 opciones) y tamano base, con preview en vivo |
| LayoutSelector | `src/components/admin/LayoutSelector.tsx` | 2 tarjetas visuales (Ancho Completo / Centrado) con representacion grafica del layout |
| SectionManager | `src/components/admin/SectionManager.tsx` | Integra `DndContext` + `closestCenter` + `SortableContext` de @dnd-kit para reordenar secciones via drag & drop |
| DraggableSection | `src/components/admin/DraggableSection.tsx` | Bloque arrastrable con asa de 3 lineas, nombre de seccion y switch de visibilidad iOS (verde/gris con `translate-x`) |
| PreviewPanel | `src/components/admin/PreviewPanel.tsx` | Mini-navegador con barra de direcciones simulada. Renderiza bloques abstractos coloreados que reflejan en vivo colores, fuentes, layout y orden del store |

---

## Store de Estado (Zustand)

| Store | Estado | Metodos |
|-------|--------|---------|
| `siteConfigStore` | `config` (SiteConfig con colors, typography, layout, sections, socialLinks), `isDirty` | updateConfig, updateColors, updateTypography, toggleSectionVisibility, resetConfig |

### Estructura de SiteConfig

```typescript
{
  siteName, siteSubtitle, contactEmail, contactPhone, address,
  seoDescription, footerText,
  colors: { primary, secondary, accent, background, text },
  typography: { headingFont, bodyFont, baseSize },
  layout: 'boxed' | 'full-width',
  themePreset: string,
  sections: { id: string; visible: boolean }[],
  socialLinks: { instagram, facebook }
}
```

---

## Detalles Tecnicos

- **Drag & Drop:** Implementado con `@dnd-kit/core` (DndContext, closestCenter) y `@dnd-kit/sortable` (SortableContext, useSortable, arrayMove). El asa de arrastre usa `{...listeners}` separado del resto del componente para no interferir con el switch de visibilidad
- **Switches de Visibilidad:** Estilo iOS con `translate-x-5` y `bg-green-500` / `bg-gray-300`. Al desactivar una seccion, el bloque se vuelve `opacity-60`. No interfieren con el drag porque el `onClick` del boton y los `listeners` de `useSortable` estan en elementos separados
- **PreviewPanel:** Es una representacion abstracta por diseno (Simplicity First). No intenta ser un iframe ni un render fiel del sitio real, sino una herramienta visual para validar combinaciones de colores, tipografia, layout y orden de secciones en tiempo real
- **Layout de PersonalizarPage:** Grid de 2 columnas en lg (`lg:grid-cols-3`). Las configuraciones ocupan `lg:col-span-2` y el PreviewPanel queda en la columna derecha con `sticky top-8` para seguimiento en vivo
- **Persistencia:** El store no usa middleware `persist` ya que los datos son mock. En produccion se integrara con el endpoint `GET/PUT /api/config` del backend

---

## Pendientes

- Integracion con API real del Modulo BE 3 (Site Config)
- Agregar middleware `persist` de Zustand para mantener la configuracion entre sesiones
- Implementar subida real de imagenes en ImageUploader
- Escribir tests unitarios (Vitest) para stores y componentes de personalizacion
