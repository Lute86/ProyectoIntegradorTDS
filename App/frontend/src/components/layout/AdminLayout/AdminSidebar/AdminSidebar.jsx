import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../../../contexts/AuthContext/AuthContext';

const roleAccess = {
  admin: ['dashboard', 'noticias', 'carreras', 'materias', 'eventos', 'galeria', 'testimonios', 'consultas', 'usuarios', 'personalizar', 'ajustes'],
  profesor: ['dashboard', 'noticias', 'carreras', 'materias', 'eventos', 'galeria'],
  tutor: ['dashboard', 'noticias', 'carreras', 'materias', 'eventos'],
};

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
      { to: '/admin/materias', label: 'Materias', icon: '\u{1F4D6}' },
      { to: '/admin/eventos', label: 'Eventos', icon: '\u{1F4C5}' },
      { to: '/admin/galeria', label: 'Galeria', icon: '\u{1F4F7}' },
      { to: '/admin/testimonios', label: 'Testimonios', icon: '\u{1F4AC}' },
      { to: '/admin/consultas', label: 'Consultas', icon: '\u{1F4E8}' },
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

export default function AdminSidebar({ expanded, collapsible, onClose }) {
  const { user } = useAuth();
  const allowed = roleAccess[user?.rol] || roleAccess.admin;

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const route = item.to.replace('/admin/', '');
        return allowed.includes(route);
      }),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {collapsible && expanded && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'shrink-0 bg-slate-900 text-white flex flex-col h-screen overflow-y-auto transition-all duration-300 z-50',
          collapsible
            ? expanded
              ? 'fixed top-0 left-0 w-64'
              : 'relative w-16'
            : 'relative w-64'
        )}
      >
        <div
          className={clsx(
            'flex items-center border-b border-slate-700',
            expanded ? 'gap-3 px-5 py-4' : 'justify-center px-2 py-4'
          )}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
            29
          </div>
          {expanded && (
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-tight truncate">IFTS 29</h2>
              <p className="text-xs text-gray-400 truncate">Panel de Administracion</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-6">
          {filteredSections.map((section) => (
            <div key={section.title}>
              {expanded && (
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={collapsible ? onClose : undefined}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center rounded-md text-sm transition-colors',
                          expanded ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-2.5',
                          isActive
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'text-gray-300 hover:text-white hover:bg-slate-800'
                        )
                      }
                      title={!expanded ? item.label : undefined}
                    >
                      <span className="text-base shrink-0">{item.icon}</span>
                      {expanded && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-700 px-2 py-4">
          <NavLink
            to="/"
            className={clsx(
              'flex items-center rounded-md text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors',
              expanded ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-2.5'
            )}
            title={!expanded ? 'Ver Sitio Publico' : undefined}
          >
            <span className="text-base shrink-0">{'\u{1F310}'}</span>
            {expanded && <span>Ver Sitio Publico</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
