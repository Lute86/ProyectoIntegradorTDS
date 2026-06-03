import { useState, useMemo, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import logo from '../../../../assets/images/logo.jpeg';
import { useSiteConfigStore } from '../../../../stores/siteConfigStore';

const NAV_MAP = {
  hero:    { to: '/',        label: 'Inicio' },
  careers: { to: '/carreras', label: 'Carreras' },
  news:    { to: '/noticias', label: 'Noticias' },
  students:{ to: '/estudiantes', label: 'Estudiantes' },
  contact: { to: '/contacto', label: 'Contacto' },
}

export default function Navbar() {
  const { config, fetchConfig } = useSiteConfigStore()
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { fetchConfig() }, [fetchConfig])

  const links = useMemo(() => {
    return config.sections
      .filter((s) => s.visible && NAV_MAP[s.id])
      .sort((a, b) => a.order - b.order)
      .map((s) => NAV_MAP[s.id])
  }, [config.sections])

  return (
    <nav className="sticky top-0 z-50 shadow" style={{ backgroundColor: 'var(--clr-surface)' }}>
      <div className="max-w-content mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl">
          <img src={logo} alt="IFTS 29" className="w-10 h-10 rounded-lg object-cover" />
          <span>{config.siteName}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              {l.label === 'Noticias' ? (
                <div className="relative group">
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-white/70 hover:text-white'
                      }`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: 'var(--clr-secondary)' } : {}}
                  >
                    {l.label}
                  </NavLink>
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="rounded-lg shadow-lg border py-1 min-w-[160px]" style={{ backgroundColor: 'var(--clr-primary)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <Link
                        to="/noticias"
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Noticias
                      </Link>
                      <Link
                        to="/eventos"
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Eventos
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: 'var(--clr-secondary)' } : {}}
                >
                  {l.label}
                </NavLink>
              )}
            </li>
          ))}
          <li className="ml-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors hover:brightness-110"
              style={{ backgroundColor: 'var(--clr-accent)' }}
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

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} />
    </nav>
  );
}
