diff --git a/App/backend/src/controllers/siteconfig.controller.js b/App/backend/src/controllers/siteconfig.controller.js
index 6eb2d6f..c765bc5 100644
--- a/App/backend/src/controllers/siteconfig.controller.js
+++ b/App/backend/src/controllers/siteconfig.controller.js
@@ -39,6 +39,8 @@ export const updateConfig = asyncHandler(async (req, res) => {
     if (disabledCount > MAX_DISABLED_SECTIONS) {
       return validationError(res, [{ msg: `No se pueden deshabilitar más de ${MAX_DISABLED_SECTIONS} secciones de la página principal` }]);
     }
+
+    req.body.sections = merged;
   }
 
   const config = await siteConfigService.updateConfig(req.body);
diff --git a/App/frontend/src/App.jsx b/App/frontend/src/App.jsx
index 429be1f..3b91e39 100644
--- a/App/frontend/src/App.jsx
+++ b/App/frontend/src/App.jsx
@@ -46,12 +46,9 @@ function ThemeInitializer({ children }) {
     inyectarVariables(config);
   }, [config]);
 
-  // Solo trae datos de la API si es la primera visita (no hay nada persistido aun)
+  // Siempre trae datos de la API para mantener el sitio actualizado
   useEffect(() => {
-    const persistido = localStorage.getItem('site-config-storage');
-    if (!persistido) {
-      fetchConfig();
-    }
+    fetchConfig();
   }, [fetchConfig]);
 
   return children;
diff --git a/App/frontend/src/components/SectionGuard.jsx b/App/frontend/src/components/SectionGuard.jsx
index 7f6c073..d983e5c 100644
--- a/App/frontend/src/components/SectionGuard.jsx
+++ b/App/frontend/src/components/SectionGuard.jsx
@@ -1,9 +1,3 @@
-import { Navigate } from 'react-router-dom'
-import { useSiteConfigStore } from '../stores/siteConfigStore'
-
-export default function SectionGuard({ sectionId, children }) {
-  const { config } = useSiteConfigStore()
-  const section = config.sections.find((s) => s.id === sectionId)
-  if (!section?.navVisible) return <Navigate to="/" replace />
+export default function SectionGuard({ children }) {
   return children
 }
diff --git a/App/frontend/src/components/admin/DraggableSection.tsx b/App/frontend/src/components/admin/DraggableSection.tsx
index cd8a113..6910977 100644
--- a/App/frontend/src/components/admin/DraggableSection.tsx
+++ b/App/frontend/src/components/admin/DraggableSection.tsx
@@ -7,45 +7,36 @@ interface DraggableSectionProps {
   id: string;
   nombre: string;
   visible: boolean;
-  navVisible: boolean;
 }
 
-const DraggableSection = ({ id, nombre, visible, navVisible }: DraggableSectionProps) => {
-  const { toggleSectionVisibility, toggleNavVisibility } = useSiteConfigStore();
+const DraggableSection = ({ id, nombre, visible }: DraggableSectionProps) => {
+  const { toggleSectionVisibility } = useSiteConfigStore();
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
 
   return (
     <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
-      className={clsx('flex items-center gap-3 px-4 py-3 bg-white rounded-lg border transition-shadow',
+      className={clsx('flex items-center md:items-center items-start gap-3 px-4 py-3 bg-white rounded-lg border transition-shadow',
         isDragging ? 'border-blue-400 shadow-lg opacity-50 z-10' : 'border-gray-200 shadow-sm hover:shadow-md',
         !visible && 'opacity-60'
       )}
     >
       <button type="button" {...attributes} {...listeners}
-        className="flex flex-col gap-0.5 p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded" title="Arrastrar">
+        className="flex flex-col gap-0.5 p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded shrink-0" title="Arrastrar">
         <span className="block w-4 h-0.5 bg-gray-300 rounded" />
         <span className="block w-4 h-0.5 bg-gray-300 rounded" />
         <span className="block w-4 h-0.5 bg-gray-300 rounded" />
       </button>
 
-      <span className="text-sm font-medium text-gray-700 flex-1 capitalize">{nombre}</span>
-
-      <div className="flex items-center gap-3">
-        <label className="text-[10px] text-gray-400">Inicio</label>
-        <button type="button" onClick={() => toggleSectionVisibility(id)}
-          className={clsx('relative w-9 h-4 rounded-full transition-colors', visible ? 'bg-green-500' : 'bg-gray-300')}
-          title={visible ? 'Ocultar en inicio' : 'Mostrar en inicio'}>
-          <span className={clsx('absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform', visible && 'translate-x-[18px]')} />
-        </button>
-      </div>
-
-      <div className="flex items-center gap-3">
-        <label className="text-[10px] text-gray-400">Menu</label>
-        <button type="button" onClick={() => toggleNavVisibility(id)}
-          className={clsx('relative w-9 h-4 rounded-full transition-colors', navVisible ? 'bg-blue-500' : 'bg-gray-300')}
-          title={navVisible ? 'Ocultar en menu' : 'Mostrar en menu'}>
-          <span className={clsx('absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform', navVisible && 'translate-x-[18px]')} />
-        </button>
+      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3">
+        <span className="text-sm font-medium text-gray-700 capitalize">{nombre}</span>
+        <div className="flex items-center gap-2 shrink-0">
+          <button type="button" onClick={() => toggleSectionVisibility(id)}
+            className={clsx('relative w-9 h-4 rounded-full transition-colors', visible ? 'bg-green-500' : 'bg-gray-300')}
+            title={visible ? 'Ocultar en inicio' : 'Mostrar en inicio'}>
+            <span className={clsx('absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform', visible && 'translate-x-[18px]')} />
+          </button>
+          <span className="text-[10px] text-gray-400">{visible ? 'Visible' : 'Oculto'}</span>
+        </div>
       </div>
     </div>
   );
diff --git a/App/frontend/src/components/admin/LayoutSelector.tsx b/App/frontend/src/components/admin/LayoutSelector.tsx
index 4f1d347..bf56832 100644
--- a/App/frontend/src/components/admin/LayoutSelector.tsx
+++ b/App/frontend/src/components/admin/LayoutSelector.tsx
@@ -18,7 +18,7 @@ const LayoutSelector = () => {
   const { config, updateConfig } = useSiteConfigStore();
 
   return (
-    <div className="grid grid-cols-2 gap-4">
+    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
       {LAYOUTS.map((layout) => {
         const activo = config.layout === layout.id;
         return (
@@ -27,25 +27,22 @@ const LayoutSelector = () => {
             type="button"
             onClick={() => updateConfig({ layout: layout.id as 'boxed' | 'full-width' })}
             className={clsx(
-              'text-left p-4 rounded-xl border-2 transition-all',
+              'text-left p-3 lg:p-4 rounded-xl border-2 transition-all',
               activo
                 ? 'border-blue-500 bg-blue-50 shadow-md'
                 : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
             )}
           >
-            {/* Icono visual simple: representa el layout */}
             <div className={clsx(
-              'flex mb-3 border border-gray-300 rounded-lg p-2',
-              layout.id === 'full-width' ? 'justify-stretch' : 'justify-center'
+              'flex border border-gray-300 rounded-lg p-1.5 mb-2 justify-center'
             )}>
               <div className={clsx(
-                'h-12 bg-blue-200 rounded',
+                'h-8 bg-blue-200 rounded',
                 layout.id === 'full-width' ? 'w-full' : 'w-3/4'
               )} />
             </div>
-
             <h3 className="text-sm font-bold text-gray-900">{layout.nombre}</h3>
-            <p className="text-xs text-gray-500 mt-1">{layout.descripcion}</p>
+            <p className="text-[10px] text-gray-500 mt-0.5">{layout.descripcion}</p>
           </button>
         );
       })}
diff --git a/App/frontend/src/components/admin/SectionManager.tsx b/App/frontend/src/components/admin/SectionManager.tsx
index 42bd56a..ba2f739 100644
--- a/App/frontend/src/components/admin/SectionManager.tsx
+++ b/App/frontend/src/components/admin/SectionManager.tsx
@@ -3,8 +3,6 @@ import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-ki
 import { useSiteConfigStore } from '../../stores/siteConfigStore';
 import DraggableSection from './DraggableSection';
 
-const EXCLUIDAS = ['students', 'contact'];
-
 const SECTION_LABELS: Record<string, string> = {
   hero: 'Hero / Portada',
   statistics: 'Estadisticas',
@@ -17,28 +15,27 @@ const SECTION_LABELS: Record<string, string> = {
 
 const SectionManager = () => {
   const { config, updateConfig } = useSiteConfigStore();
-  const visibles = config.sections.filter((s) => !EXCLUIDAS.includes(s.id));
+  const sections = config.sections;
 
   const handleDragEnd = (event: DragEndEvent) => {
     const { active, over } = event;
     if (!over || active.id === over.id) return;
 
-    const oldIndex = visibles.findIndex((s) => s.id === active.id);
-    const newIndex = visibles.findIndex((s) => s.id === over.id);
-    const reordenado = arrayMove(visibles, oldIndex, newIndex);
+    const oldIndex = sections.findIndex((s) => s.id === active.id);
+    const newIndex = sections.findIndex((s) => s.id === over.id);
+    const reordenado = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i + 1 }));
 
-    const otras = config.sections.filter((s) => EXCLUIDAS.includes(s.id));
-    updateConfig({ sections: [...reordenado, ...otras] });
+    updateConfig({ sections: reordenado });
   };
 
   return (
     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
-      <SortableContext items={visibles.map((s) => s.id)} strategy={verticalListSortingStrategy}>
+      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
         <div className="space-y-2">
-          {visibles.map((s) => (
+          {sections.map((s) => (
             <DraggableSection
               key={s.id} id={s.id} nombre={SECTION_LABELS[s.id] || s.id}
-              visible={s.visible} navVisible={s.navVisible ?? true}
+              visible={s.visible}
             />
           ))}
         </div>
diff --git a/App/frontend/src/components/admin/ThemePresets.tsx b/App/frontend/src/components/admin/ThemePresets.tsx
index 5473a93..75e52fa 100644
--- a/App/frontend/src/components/admin/ThemePresets.tsx
+++ b/App/frontend/src/components/admin/ThemePresets.tsx
@@ -59,8 +59,8 @@ const ThemePresets = () => {
 
   return (
     <div className="space-y-6">
-      {/* Grilla de temas predefinidos */}
-      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
+      {/* Lista de temas predefinidos */}
+      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4">
         {TEMAS.map((tema) => {
           const activo = config.themePreset === tema.id;
           return (
@@ -72,20 +72,19 @@ const ThemePresets = () => {
                 useSiteConfigStore.getState().updateConfig({ themePreset: tema.id });
               }}
               className={clsx(
-                "text-left p-4 rounded-xl border-2 transition-all",
+                "text-left p-3 lg:p-4 rounded-xl border-2 transition-all",
                 activo
                   ? "border-blue-500 bg-blue-50 shadow-md"
                   : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
               )}
             >
-              <h3 className="text-sm font-bold text-gray-900 mb-1">{tema.nombre}</h3>
-              <p className="text-[10px] text-gray-500 mb-3">{tema.descripcion}</p>
-              <div className="flex h-5 rounded-lg overflow-hidden border border-gray-200">
+              <h3 className="text-sm font-bold text-gray-900 mb-0.5">{tema.nombre}</h3>
+              <p className="text-[10px] text-gray-500 mb-2">{tema.descripcion}</p>
+              <div className="flex h-4 rounded-lg overflow-hidden border border-gray-200">
                 {Object.values(tema.colores).map((color) => (
                   <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                 ))}
               </div>
-              <p className="text-[10px] text-gray-400 mt-2 font-mono">{Object.values(tema.colores).join(" | ")}</p>
             </button>
           );
         })}
diff --git a/App/frontend/src/components/layout/AdminLayout/AdminLayout.jsx b/App/frontend/src/components/layout/AdminLayout/AdminLayout.jsx
index ca5860d..93f2f55 100644
--- a/App/frontend/src/components/layout/AdminLayout/AdminLayout.jsx
+++ b/App/frontend/src/components/layout/AdminLayout/AdminLayout.jsx
@@ -1,14 +1,47 @@
+import { useState, useEffect, useCallback } from 'react';
 import { Outlet } from 'react-router-dom';
 import AdminSidebar from './AdminSidebar/AdminSidebar';
 import AdminTopbar from './AdminTopbar/AdminTopbar';
 
 export default function AdminLayout() {
+  const [sidebarExpanded, setSidebarExpanded] = useState(false);
+  const [isDesktop, setIsDesktop] = useState(false);
+
+  useEffect(() => {
+    const prev = document.body.style.overflow;
+    document.body.style.overflow = 'hidden';
+    return () => { document.body.style.overflow = prev; };
+  }, []);
+
+  useEffect(() => {
+    const mql = window.matchMedia('(min-width: 1024px)');
+    setIsDesktop(mql.matches);
+    const handler = (e) => {
+      setIsDesktop(e.matches);
+      if (e.matches) setSidebarExpanded(false);
+    };
+    mql.addEventListener('change', handler);
+    return () => mql.removeEventListener('change', handler);
+  }, []);
+
+  const toggleSidebar = useCallback(() => {
+    setSidebarExpanded((prev) => !prev);
+  }, []);
+
+  const closeSidebar = useCallback(() => {
+    if (!isDesktop) setSidebarExpanded(false);
+  }, [isDesktop]);
+
   return (
-    <div className="flex h-screen bg-gray-50">
-      <AdminSidebar />
-      <div className="flex-1 flex flex-col overflow-hidden">
-        <AdminTopbar />
-        <main className="flex-1 overflow-y-auto p-6">
+    <div className="h-screen flex overflow-hidden bg-gray-50">
+      <AdminSidebar
+        expanded={isDesktop || sidebarExpanded}
+        collapsible={!isDesktop}
+        onClose={closeSidebar}
+      />
+      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
+        <AdminTopbar onToggleSidebar={toggleSidebar} />
+        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
           <Outlet />
         </main>
       </div>
diff --git a/App/frontend/src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx b/App/frontend/src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx
index 5b2371e..b9e9899 100644
--- a/App/frontend/src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx
+++ b/App/frontend/src/components/layout/AdminLayout/AdminSidebar/AdminSidebar.jsx
@@ -21,7 +21,6 @@ const sections = [
       { to: '/admin/noticias', label: 'Noticias', icon: '\u{1F4F0}' },
       { to: '/admin/carreras', label: 'Carreras', icon: '\u{1F393}' },
       { to: '/admin/materias', label: 'Materias', icon: '\u{1F4D6}' },
-
       { to: '/admin/eventos', label: 'Eventos', icon: '\u{1F4C5}' },
       { to: '/admin/galeria', label: 'Galeria', icon: '\u{1F4F7}' },
       { to: '/admin/testimonios', label: 'Testimonios', icon: '\u{1F4AC}' },
@@ -43,7 +42,7 @@ const sections = [
   },
 ];
 
-export default function AdminSidebar() {
+export default function AdminSidebar({ expanded, collapsible, onClose }) {
   const { user } = useAuth();
   const allowed = roleAccess[user?.rol] || roleAccess.admin;
 
@@ -58,54 +57,90 @@ export default function AdminSidebar() {
     .filter((section) => section.items.length > 0);
 
   return (
-    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
-      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
-        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">29</div>
-        <div>
-          <h2 className="text-base font-bold leading-tight">IFTS 29</h2>
-          <p className="text-xs text-gray-400">Panel de Administracion</p>
-        </div>
-      </div>
+    <>
+      {collapsible && expanded && (
+        <div
+          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
+          onClick={onClose}
+        />
+      )}
 
-      <nav className="flex-1 px-3 py-4 space-y-6">
-        {filteredSections.map((section) => (
-          <div key={section.title}>
-            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
-              {section.title}
-            </p>
-            <ul className="space-y-1">
-              {section.items.map((item) => (
-                <li key={item.to}>
-                  <NavLink
-                    to={item.to}
-                    className={({ isActive }) =>
-                      clsx(
-                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
-                        isActive
-                          ? 'bg-[var(--color-primary)] text-white'
-                          : 'text-gray-300 hover:text-white hover:bg-slate-800'
-                      )
-                    }
-                  >
-                    <span className="text-base">{item.icon}</span>
-                    <span>{item.label}</span>
-                  </NavLink>
-                </li>
-              ))}
-            </ul>
+      <aside
+        className={clsx(
+          'shrink-0 bg-slate-900 text-white flex flex-col h-screen overflow-y-auto transition-all duration-300 z-50',
+          collapsible
+            ? expanded
+              ? 'fixed top-0 left-0 w-64'
+              : 'relative w-16'
+            : 'relative w-64'
+        )}
+      >
+        <div
+          className={clsx(
+            'flex items-center border-b border-slate-700',
+            expanded ? 'gap-3 px-5 py-4' : 'justify-center px-2 py-4'
+          )}
+        >
+          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
+            29
           </div>
-        ))}
-      </nav>
+          {expanded && (
+            <div className="min-w-0">
+              <h2 className="text-base font-bold leading-tight truncate">IFTS 29</h2>
+              <p className="text-xs text-gray-400 truncate">Panel de Administracion</p>
+            </div>
+          )}
+        </div>
 
-      <div className="border-t border-slate-700 px-3 py-4">
-        <NavLink
-          to="/"
-          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
-        >
-          <span className="text-base">{'\u{1F310}'}</span>
-          <span>Ver Sitio Publico</span>
-        </NavLink>
-      </div>
-    </aside>
+        <nav className="flex-1 px-2 py-4 space-y-6">
+          {filteredSections.map((section) => (
+            <div key={section.title}>
+              {expanded && (
+                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
+                  {section.title}
+                </p>
+              )}
+              <ul className="space-y-1">
+                {section.items.map((item) => (
+                  <li key={item.to}>
+                    <NavLink
+                      to={item.to}
+                      onClick={collapsible ? onClose : undefined}
+                      className={({ isActive }) =>
+                        clsx(
+                          'flex items-center rounded-md text-sm transition-colors',
+                          expanded ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-2.5',
+                          isActive
+                            ? 'bg-[var(--color-primary)] text-white'
+                            : 'text-gray-300 hover:text-white hover:bg-slate-800'
+                        )
+                      }
+                      title={!expanded ? item.label : undefined}
+                    >
+                      <span className="text-base shrink-0">{item.icon}</span>
+                      {expanded && <span className="truncate">{item.label}</span>}
+                    </NavLink>
+                  </li>
+                ))}
+              </ul>
+            </div>
+          ))}
+        </nav>
+
+        <div className="border-t border-slate-700 px-2 py-4">
+          <NavLink
+            to="/"
+            className={clsx(
+              'flex items-center rounded-md text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors',
+              expanded ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-2.5'
+            )}
+            title={!expanded ? 'Ver Sitio Publico' : undefined}
+          >
+            <span className="text-base shrink-0">{'\u{1F310}'}</span>
+            {expanded && <span>Ver Sitio Publico</span>}
+          </NavLink>
+        </div>
+      </aside>
+    </>
   );
 }
diff --git a/App/frontend/src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx b/App/frontend/src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx
index 0c07b0b..665a1cf 100644
--- a/App/frontend/src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx
+++ b/App/frontend/src/components/layout/AdminLayout/AdminTopbar/AdminTopbar.jsx
@@ -6,16 +6,16 @@ import { useConsultasStore } from '../../../../stores/consultasStore';
 
 const titles = {
   dashboard: 'Dashboard', noticias: 'Noticias', carreras: 'Carreras',
-  eventos: 'Eventos', galeria: 'Galeria', testimonios: 'Testimonios',
+  materias: 'Materias', eventos: 'Eventos', galeria: 'Galeria', testimonios: 'Testimonios',
   usuarios: 'Usuarios', personalizar: 'Personalizar Sitio',
   ajustes: 'Ajustes Generales', consultas: 'Consultas',
 };
 
-export default function AdminTopbar() {
+export default function AdminTopbar({ onToggleSidebar }) {
   const { pathname } = useLocation();
   const navigate = useNavigate();
   const { user, logout } = useAuth();
-  const segment = pathname.split('/')[1] || 'dashboard';
+  const segment = pathname.split('/')[2] || 'dashboard';
   const title = titles[segment] || 'Dashboard';
   const [menuOpen, setMenuOpen] = useState(false);
 
@@ -30,15 +30,28 @@ export default function AdminTopbar() {
     : 'AD';
 
   return (
-    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
-      <div>
-        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
-        <AdminBreadcrumbs />
+    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shrink-0">
+      <div className="flex items-center gap-3 min-w-0">
+        <button
+          onClick={onToggleSidebar}
+          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
+          aria-label="Abrir menu"
+        >
+          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
+            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
+          </svg>
+        </button>
+        <div className="min-w-0">
+          <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">{title}</h1>
+          <div className="hidden sm:block">
+            <AdminBreadcrumbs />
+          </div>
+        </div>
       </div>
 
-      <div className="flex items-center gap-4">
+      <div className="flex items-center gap-2 md:gap-4 shrink-0">
         <button onClick={() => { navigate('/admin/consultas'); useConsultasStore.getState().setUnreadCount(0); }}
-          className="text-gray-400 hover:text-gray-600 text-lg relative" title="Notificaciones">
+          className="text-gray-400 hover:text-gray-600 text-lg relative p-1" title="Notificaciones">
           {'\u{1F514}'}
           {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
@@ -47,9 +60,9 @@ export default function AdminTopbar() {
           )}
         </button>
 
-        <div className="relative pl-4 border-l border-gray-200">
-          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3">
-            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
+        <div className="relative pl-2 md:pl-4 border-l border-gray-200">
+          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 md:gap-3">
+            <div className="w-8 h-8 md:w-9 md:h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
               {initials}
             </div>
             <div className="hidden sm:block text-left">
diff --git a/App/frontend/src/components/layout/PublicLayout/Navbar/MobileMenu.jsx b/App/frontend/src/components/layout/PublicLayout/Navbar/MobileMenu.jsx
index b040a09..6e2103c 100644
--- a/App/frontend/src/components/layout/PublicLayout/Navbar/MobileMenu.jsx
+++ b/App/frontend/src/components/layout/PublicLayout/Navbar/MobileMenu.jsx
@@ -15,7 +15,9 @@ export default function MobileMenu({ open, onClose, links }) {
           </button>
         </div>
         <ul className="flex flex-col gap-2">
-          {links.map((l) => (
+          {links.flatMap((l) =>
+            l.children ? l.children : [l]
+          ).map((l) => (
             <li key={l.to}>
               <NavLink
                 to={l.to}
diff --git a/App/frontend/src/components/layout/PublicLayout/Navbar/Navbar.jsx b/App/frontend/src/components/layout/PublicLayout/Navbar/Navbar.jsx
index 3fed0f6..46ea4e6 100644
--- a/App/frontend/src/components/layout/PublicLayout/Navbar/Navbar.jsx
+++ b/App/frontend/src/components/layout/PublicLayout/Navbar/Navbar.jsx
@@ -1,48 +1,38 @@
-import { useState, useMemo } from 'react';
+import { useState } from 'react';
 import { Link, NavLink } from 'react-router-dom';
 import MobileMenu from './MobileMenu';
 import logo from '../../../../assets/images/logo.jpeg';
 import { useSiteConfigStore } from '../../../../stores/siteConfigStore';
 import { useTheme } from '../../../../contexts/ThemeContext/ThemeContext';
 
-const NAV_MAP = {
-  hero:    { to: '/',        label: 'Inicio' },
-  careers: { to: '/carreras', label: 'Carreras' },
-  news:    { to: '/noticias', label: 'Noticias' },
-  events:  { to: '/eventos',  label: 'Eventos' },
-  students:{ to: '/estudiantes', label: 'Estudiantes' },
-  contact: { to: '/contacto', label: 'Contacto' },
-}
+const NAV_LINKS = [
+  { to: '/',            label: 'Inicio' },
+  { to: '/carreras',    label: 'Carreras' },
+  { to: '/noticias',    label: 'Noticias', children: [
+    { to: '/noticias',  label: 'Noticias' },
+    { to: '/eventos',   label: 'Eventos' },
+  ]},
+  { to: '/estudiantes', label: 'Estudiantes' },
+  { to: '/contacto',    label: 'Contacto' },
+]
 
 export default function Navbar() {
-  const { config } = useSiteConfigStore()
+  const siteName = useSiteConfigStore((s) => s.config.siteName)
   const { theme, toggleTheme } = useTheme()
   const [mobileOpen, setMobileOpen] = useState(false);
 
-  const links = useMemo(() => {
-    const newsVisible = config.sections.find(s => s.id === 'news')?.visible
-    return config.sections
-      .filter((s) => {
-        if (!s.navVisible || !NAV_MAP[s.id]) return false
-        if (s.id === 'events' && newsVisible) return false
-        return true
-      })
-      .sort((a, b) => a.order - b.order)
-      .map((s) => NAV_MAP[s.id])
-  }, [config.sections])
-
   return (
     <nav className="sticky top-0 z-50 shadow bg-surface">
       <div className="max-w-content mx-auto px-5 h-16 flex items-center justify-between">
         <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl">
           <img src={logo} alt="IFTS 29" className="w-10 h-10 rounded-lg object-cover" />
-          <span>{config.siteName}</span>
+          <span>{siteName}</span>
         </Link>
 
         <ul className="hidden md:flex items-center gap-1">
-          {links.map((l) => (
+          {NAV_LINKS.map((l) => (
             <li key={l.to}>
-              {l.label === 'Noticias' ? (
+              {l.children ? (
                 <div className="relative group">
                   <NavLink
                     to={l.to}
@@ -57,18 +47,15 @@ export default function Navbar() {
                   </NavLink>
                   <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                     <div className="rounded-lg shadow-lg border border-white/10 py-1 min-w-[160px] bg-slate-800">
-                      <Link
-                        to="/noticias"
-                        className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
-                      >
-                        Noticias
-                      </Link>
-                      <Link
-                        to="/eventos"
-                        className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
-                      >
-                        Eventos
-                      </Link>
+                      {l.children.map((child) => (
+                        <Link
+                          key={child.to}
+                          to={child.to}
+                          className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
+                        >
+                          {child.label}
+                        </Link>
+                      ))}
                     </div>
                   </div>
                 </div>
@@ -115,7 +102,7 @@ export default function Navbar() {
         </button>
       </div>
 
-      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} />
+      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
     </nav>
   );
 }
diff --git a/App/frontend/src/components/ui/DataTable.tsx b/App/frontend/src/components/ui/DataTable.tsx
index d4a8793..b440e69 100644
--- a/App/frontend/src/components/ui/DataTable.tsx
+++ b/App/frontend/src/components/ui/DataTable.tsx
@@ -110,23 +110,23 @@ export const DataTable = <T extends { id?: string | number }>({
     <div className={clsx('w-full bg-white rounded-lg shadow-sm border border-gray-200', className)}>
       {/* Busqueda */}
       {searchable && (
-        <div className="px-4 py-3 border-b border-gray-200">
+        <div className="px-3 md:px-4 py-3 border-b border-gray-200">
           <input
             type="text"
             value={search}
             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
-            placeholder="Buscar en la tabla..."
-            className="w-full max-w-sm px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
+            placeholder="Buscar..."
+            className="w-full sm:max-w-sm px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
           />
         </div>
       )}
 
       <div className="w-full overflow-x-auto block">
-        <table className="w-full min-w-[850px] text-left border-collapse">
+        <table className="w-full min-w-[600px] text-left border-collapse">
           <thead className="bg-gray-50/80 border-b border-gray-200">
             <tr>
               {selectable && (
-                <th className="px-4 py-4 w-10">
+                <th className="px-3 md:px-4 py-3 md:py-4 w-10">
                   <input
                     type="checkbox"
                     checked={paginated.length > 0 && paginated.every((item) => item.id != null && selectedIds.has(item.id))}
@@ -139,7 +139,7 @@ export const DataTable = <T extends { id?: string | number }>({
                 <th
                   key={index}
                   className={clsx(
-                    'px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider',
+                    'px-3 md:px-6 py-3 md:py-4 text-xs font-bold text-gray-500 uppercase tracking-wider',
                     col.sortable && 'cursor-pointer select-none hover:text-gray-700',
                     col.className
                   )}
@@ -154,7 +154,7 @@ export const DataTable = <T extends { id?: string | number }>({
                 </th>
               ))}
               {actions && (
-                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
+                <th className="px-3 md:px-6 py-3 md:py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                   Acciones
                 </th>
               )}
@@ -168,7 +168,7 @@ export const DataTable = <T extends { id?: string | number }>({
                   className="hover:bg-blue-50/30 transition-colors duration-150 group"
                 >
                   {selectable && (
-                    <td className="px-4 py-4 w-10" onClick={(e) => e.stopPropagation()}>
+                    <td className="px-3 md:px-4 py-3 md:py-4 w-10" onClick={(e) => e.stopPropagation()}>
                       <input
                         type="checkbox"
                         checked={item.id != null && selectedIds.has(item.id)}
@@ -180,7 +180,7 @@ export const DataTable = <T extends { id?: string | number }>({
                   {columns.map((col, colIndex) => (
                     <td
                       key={colIndex}
-                      className={clsx('px-6 py-4 text-sm text-gray-600 whitespace-nowrap', col.className)}
+                      className={clsx('px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600 whitespace-nowrap', col.className)}
                     >
                       {typeof col.accessor === 'function'
                         ? col.accessor(item)
@@ -188,15 +188,15 @@ export const DataTable = <T extends { id?: string | number }>({
                     </td>
                   ))}
                   {actions && (
-                    <td className="px-6 py-4 text-right whitespace-nowrap">
-                      <div className="flex justify-end gap-2 whitespace-nowrap">{actions(item)}</div>
+                    <td className="px-3 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
+                      <div className="flex justify-end gap-1 md:gap-2 whitespace-nowrap">{actions(item)}</div>
                     </td>
                   )}
                 </tr>
               ))
             ) : (
               <tr>
-                <td colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-gray-400 italic text-sm">
+                <td colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="px-3 md:px-6 py-12 text-center text-gray-400 italic text-sm">
                   {search ? 'No se encontraron resultados para la busqueda.' : emptyMessage}
                 </td>
               </tr>
@@ -207,24 +207,27 @@ export const DataTable = <T extends { id?: string | number }>({
 
       {/* Paginacion */}
       {totalPages > 1 && (
-        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-sm">
-          <span className="text-gray-500">
+        <div className="flex items-center justify-between px-3 md:px-6 py-3 border-t border-gray-200 text-xs md:text-sm">
+          <span className="text-gray-500 hidden sm:inline">
             {sorted.length} registro{sorted.length !== 1 ? 's' : ''} — Pag. {page} de {totalPages}
           </span>
+          <span className="text-gray-500 sm:hidden">
+            {page}/{totalPages}
+          </span>
           <div className="flex gap-1">
             <button
               disabled={page <= 1}
               onClick={() => setPage((p) => Math.max(1, p - 1))}
-              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
+              className="px-2 md:px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
             >
-              Anterior
+              Ant.
             </button>
             <button
               disabled={page >= totalPages}
               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
-              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
+              className="px-2 md:px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
             >
-              Siguiente
+              Sig.
             </button>
           </div>
         </div>
diff --git a/App/frontend/src/pages/admin/PersonalizarPage/PersonalizarPage.tsx b/App/frontend/src/pages/admin/PersonalizarPage/PersonalizarPage.tsx
index ccc4196..b60d056 100644
--- a/App/frontend/src/pages/admin/PersonalizarPage/PersonalizarPage.tsx
+++ b/App/frontend/src/pages/admin/PersonalizarPage/PersonalizarPage.tsx
@@ -59,8 +59,8 @@ const PersonalizarPage = () => {
       )}
 
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
-        <div className="lg:col-span-2 space-y-6">
-          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
+        <div className="lg:col-span-2 space-y-6 min-w-0">
+          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 space-y-4">
             <div>
               <h2 className="text-base font-bold text-gray-900">Temas y Colores</h2>
               <p className="text-xs text-gray-500">Seleccione un tema o ajuste cada color de forma individual.</p>
@@ -68,7 +68,7 @@ const PersonalizarPage = () => {
             <ThemePresets />
           </section>
 
-          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
+          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 space-y-4">
             <div>
               <h2 className="text-base font-bold text-gray-900">Tipografia</h2>
               <p className="text-xs text-gray-500">Configure las fuentes y el tamano base del sitio.</p>
@@ -76,7 +76,7 @@ const PersonalizarPage = () => {
             <TypographyConfig />
           </section>
 
-          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
+          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 space-y-4">
             <div>
               <h2 className="text-base font-bold text-gray-900">Layout</h2>
               <p className="text-xs text-gray-500">Seleccione la disposicion del contenido.</p>
@@ -84,7 +84,7 @@ const PersonalizarPage = () => {
             <LayoutSelector />
           </section>
 
-          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
+          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 space-y-4">
             <div>
               <h2 className="text-base font-bold text-gray-900">Orden de Secciones</h2>
               <p className="text-xs text-gray-500">Active, desactive o reordene las secciones. Los cambios afectaran tanto a la Landing Page como al Menu de Navegacion (Navbar).</p>
diff --git a/App/frontend/src/pages/public/HomePage/HomePage.jsx b/App/frontend/src/pages/public/HomePage/HomePage.jsx
index 8439508..b874989 100644
--- a/App/frontend/src/pages/public/HomePage/HomePage.jsx
+++ b/App/frontend/src/pages/public/HomePage/HomePage.jsx
@@ -54,36 +54,30 @@ export default function HomePage() {
   }, [storeNoticias])
 
   const secciones = useMemo(() => {
-    const mapa = {
-      hero:        <Hero />,
-      statistics:  <Stats items={MOCK_STATS} />,
-      careers:     <CareerCarousel carreras={carreras} />,
-      news:        <NewsSection noticias={noticias} onVerDetalle={(n) => setSelectedNoticia(n)} />,
-      events:      <EventosSection eventos={eventos} onVerDetalle={(e) => setSelectedEvento(e)} />,
-      testimonials:<TestimonialsCarousel testimonios={testimonios} />,
-      gallery:     <GaleriaCarousel />,
+    const components = {
+      hero:        () => <Hero />,
+      statistics:  () => <Stats items={MOCK_STATS} />,
+      careers:     () => <CareerCarousel carreras={carreras} />,
+      news:        () => <NewsSection noticias={noticias} onVerDetalle={(n) => setSelectedNoticia(n)} />,
+      events:      () => <EventosSection eventos={eventos} onVerDetalle={(e) => setSelectedEvento(e)} />,
+      testimonials:() => <TestimonialsCarousel testimonios={testimonios} />,
+      gallery:     () => <GaleriaCarousel />,
     }
 
     const visibleItems = config.sections
       .filter((s) => s.visible && HOME_SECTION_IDS.includes(s.id))
       .sort((a, b) => a.order - b.order)
 
-    const heroSection = visibleItems.find(s => s.id === 'hero')
-    const otrasSecciones = visibleItems.filter(s => s.id !== 'hero')
-
-    return {
-      hero: heroSection ? <div key="hero">{mapa['hero']}</div> : null,
-      otras: otrasSecciones.map((s) => <div key={s.id}>{mapa[s.id]}</div>).filter(Boolean),
-    }
+    return visibleItems.map((s) => {
+      const render = components[s.id]
+      return render ? <div key={s.id}>{render()}</div> : null
+    }).filter(Boolean)
   }, [config.sections, carreras, noticias, eventos, testimonios, setSelectedNoticia])
 
   return (
     <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 bg-site-bg">
       <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
-        {secciones.hero}
-        <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4`}>
-          {secciones.otras}
-        </div>
+        {secciones}
       </div>
       {selectedEvento && (
         <EventoDetailModal
diff --git a/App/frontend/src/stores/siteConfigStore.ts b/App/frontend/src/stores/siteConfigStore.ts
index 33d0926..c8395cb 100644
--- a/App/frontend/src/stores/siteConfigStore.ts
+++ b/App/frontend/src/stores/siteConfigStore.ts
@@ -59,15 +59,13 @@ const DEFAULT_CONFIG: SiteConfig = {
   layout: 'full-width',
   themePreset: 'moderno',
   sections: [
-    { id: 'hero', visible: true, order: 1, navVisible: true },
-    { id: 'statistics', visible: true, order: 2, navVisible: true },
-    { id: 'careers', visible: true, order: 3, navVisible: true },
-    { id: 'news', visible: true, order: 4, navVisible: true },
-    { id: 'events', visible: true, order: 5, navVisible: true },
-    { id: 'testimonials', visible: true, order: 6, navVisible: true },
-    { id: 'gallery', visible: true, order: 7, navVisible: true },
-    { id: 'students', visible: true, order: 8, navVisible: true },
-    { id: 'contact', visible: true, order: 9, navVisible: true },
+    { id: 'hero', visible: true, order: 1 },
+    { id: 'statistics', visible: true, order: 2 },
+    { id: 'careers', visible: true, order: 3 },
+    { id: 'news', visible: true, order: 4 },
+    { id: 'events', visible: true, order: 5 },
+    { id: 'testimonials', visible: true, order: 6 },
+    { id: 'gallery', visible: true, order: 7 },
   ],
   socialLinks: {
     instagram: 'https://instagram.com/ifts29',
@@ -84,7 +82,6 @@ interface SiteConfigState {
   updateConfig: (data: Partial<SiteConfig>) => void;
   updateColors: (colors: Partial<SiteConfig['colors']>) => void;
   updateTypography: (typography: Partial<SiteConfig['typography']>) => void;
-  toggleNavVisibility: (sectionId: string) => void;
   resetConfig: () => void;
 }
 
@@ -166,7 +163,7 @@ export const useSiteConfigStore = create<SiteConfigState>()(
     if (cfg.seoDescription) payload.seo_description = cfg.seoDescription;
     try {
       const sectionsBackup = JSON.parse(JSON.stringify(state.config.sections));
-      await api.put('/config', payload);
+      const res = await api.put('/config', payload);
       set({ isDirty: false });
     } catch (err: any) {
       console.error('Error del backend:', err.response?.data);
@@ -212,17 +209,6 @@ export const useSiteConfigStore = create<SiteConfigState>()(
       isDirty: true,
     }));
   },
-  toggleNavVisibility: (sectionId) => {
-    set((state) => ({
-      config: {
-        ...state.config,
-        sections: state.config.sections.map((s) =>
-          s.id === sectionId ? { ...s, navVisible: !s.navVisible } : s
-        ),
-      },
-      isDirty: true,
-    }));
-  },
   resetConfig: () => {
     set({ config: DEFAULT_CONFIG, isDirty: false });
   },
@@ -232,12 +218,17 @@ export const useSiteConfigStore = create<SiteConfigState>()(
   merge: (persisted, current) => {
     const defaultSections = current.config.sections;
     const persistedSections = persisted?.config?.sections;
-    const mergedSections = persistedSections?.length
-      ? defaultSections.map((sec) => {
-          const p = persistedSections.find((ps) => ps.id === sec.id);
-          return p ? { ...sec, ...p } : sec;
-        })
-      : defaultSections;
+
+    let mergedSections = defaultSections;
+    if (persistedSections?.length) {
+      const merged = [...persistedSections];
+      for (const def of defaultSections) {
+        if (!merged.some((s) => s.id === def.id)) {
+          merged.push(def);
+        }
+      }
+      mergedSections = merged;
+    }
 
     return {
       ...current,
diff --git a/App/frontend/src/tests/components/AdminTopbar.test.jsx b/App/frontend/src/tests/components/AdminTopbar.test.jsx
index 37003b0..186ec75 100644
--- a/App/frontend/src/tests/components/AdminTopbar.test.jsx
+++ b/App/frontend/src/tests/components/AdminTopbar.test.jsx
@@ -26,6 +26,6 @@ describe('AdminTopbar', () => {
         </AuthProvider>
       </MemoryRouter>
     );
-    expect(screen.getByText('Noticias')).toBeInTheDocument();
+    expect(screen.getAllByText('Noticias').length).toBeGreaterThanOrEqual(1);
   });
 });
