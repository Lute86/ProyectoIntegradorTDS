import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext/AuthContext';
import AdminBreadcrumbs from '../AdminBreadcrumbs/AdminBreadcrumbs';
import { useConsultasStore } from '../../../../stores/consultasStore';

const titles = {
  dashboard: 'Dashboard', noticias: 'Noticias', carreras: 'Carreras',
  eventos: 'Eventos', galeria: 'Galeria', testimonios: 'Testimonios',
  usuarios: 'Usuarios', personalizar: 'Personalizar Sitio',
  ajustes: 'Ajustes Generales', consultas: 'Consultas',
};

export default function AdminTopbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const segment = pathname.split('/')[1] || 'dashboard';
  const title = titles[segment] || 'Dashboard';
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadCount = useConsultasStore((s) => s.unreadCount);

  useEffect(() => {
    useConsultasStore.getState().fetchUnreadCount();
  }, []);

  const initials = user
    ? `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`.toUpperCase() || 'AD'
    : 'AD';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <AdminBreadcrumbs />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => { navigate('/admin/consultas'); useConsultasStore.getState().setUnreadCount(0); }}
          className="text-gray-400 hover:text-gray-600 text-lg relative" title="Notificaciones">
          {'\u{1F514}'}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative pl-4 border-l border-gray-200">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {user?.nombre || 'Admin'} {user?.apellido || ''}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Administrador'}</p>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.nombre} {user?.apellido}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">Rol: {user?.rol}</p>
                </div>
                <button onClick={() => { setMenuOpen(false); navigate('/admin/usuarios'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Mi Perfil
                </button>
                <button onClick={() => { setMenuOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                  Cerrar Sesion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
