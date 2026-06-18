import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import logo from '../../../../assets/images/logo.jpeg';
import { useSiteConfigStore } from '../../../../stores/siteConfigStore';
import { useTheme } from '../../../../contexts/ThemeContext/ThemeContext';

const NAV_LINKS = [
  { to: '/',            label: 'Inicio' },
  { to: '/carreras',    label: 'Carreras' },
  { to: '/noticias',    label: 'Noticias', children: [
    { to: '/noticias',  label: 'Noticias' },
    { to: '/eventos',   label: 'Eventos' },
  ]},
  { to: '/estudiantes', label: 'Estudiantes' },
  { to: '/contacto',    label: 'Contacto' },
]

export default function Navbar() {
  const siteName = useSiteConfigStore((s) => s.config.siteName)
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 shadow bg-surface">
      <div className="max-w-content mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl">
          <img src={logo} alt="IFTS 29" className="w-10 h-10 rounded-lg object-cover" />
          <span>{siteName}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              {l.children ? (
                <div className="relative group">
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'text-white bg-blue-700' : 'text-white/70 hover:text-white'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="rounded-lg shadow-lg border border-white/10 py-1 min-w-[160px] bg-slate-800">
                      {l.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'text-white bg-blue-700' : 'text-white/70 hover:text-white'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className="px-2 py-2 rounded-md text-sm text-white/70 hover:text-white transition-colors"
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
          <li className="ml-1">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors hover:brightness-110 bg-blue-600"
            >
              Admin
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-white text-2xl p-1"
          aria-label="Abrir menu"
        >
          &#9776;
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </nav>
  );
}
