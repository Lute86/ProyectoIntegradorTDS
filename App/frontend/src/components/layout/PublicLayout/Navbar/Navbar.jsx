import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import logo from '../../../../assets/images/logo.jpeg';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/carreras', label: 'Carreras' },
  { to: '/noticias', label: 'Noticias' },
  { to: '/estudiantes', label: 'Estudiantes' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-900 sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl">
          <img src={logo} alt="IFTS 29" className="w-10 h-10 rounded-lg object-cover" />
          <span>IFTS 29</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="ml-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
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
