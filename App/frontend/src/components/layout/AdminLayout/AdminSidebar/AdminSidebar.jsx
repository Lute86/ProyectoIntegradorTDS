import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const sections = [
  {
    title: 'Principal',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: '\u{1F4CA}' },
    ],
  },
  {
    title: 'Contenido',
    items: [
      { to: '/admin/noticias', label: 'Noticias', icon: '\u{1F4F0}' },
      { to: '/admin/carreras', label: 'Carreras', icon: '\u{1F393}' },
      { to: '/admin/eventos', label: 'Eventos', icon: '\u{1F4C5}' },
      { to: '/admin/galeria', label: 'Galeria', icon: '\u{1F4F7}' },
      { to: '/admin/testimonios', label: 'Testimonios', icon: '\u{1F4AC}' },
    ],
  },
  {
    title: 'Usuarios',
    items: [
      { to: '/admin/usuarios', label: 'Usuarios', icon: '\u{1F465}' },
    ],
  },
  {
    title: 'Configuracion',
    items: [
      { to: '/admin/personalizar', label: 'Personalizar Sitio', icon: '\u{1F3A8}' },
      { to: '/admin/ajustes', label: 'Ajustes Generales', icon: '\u{2699}\u{FE0F}' },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">29</div>
        <div>
          <h2 className="text-base font-bold leading-tight">IFTS 29</h2>
          <p className="text-xs text-gray-400">Panel de Administracion</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-slate-800'
                      )
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-700 px-3 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="text-base">{'\u{1F310}'}</span>
          <span>Ver Sitio Publico</span>
        </NavLink>
      </div>
    </aside>
  );
}
