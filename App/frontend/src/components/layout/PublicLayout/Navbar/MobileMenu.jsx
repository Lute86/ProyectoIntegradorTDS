import { NavLink, Link } from 'react-router-dom';

export default function MobileMenu({ open, onClose, links }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 right-0 w-72 h-full bg-slate-900 shadow-xl p-6">
        <div className="flex justify-end mb-6">
          <button onClick={onClose} className="text-white text-2xl" aria-label="Cerrar menu">
            &times;
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-4">
            <Link
              to="/login"
              onClick={onClose}
              className="block text-center px-4 py-3 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
