import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext/AuthContext';
import AdminBreadcrumbs from '../AdminBreadcrumbs/AdminBreadcrumbs';
import { useConsultasStore } from '../../../../stores/consultasStore';

const titles = {
  dashboard: 'Dashboard',
  noticias: 'Noticias',
  carreras: 'Carreras',
  eventos: 'Eventos',
  galeria: 'Galeria',
  testimonios: 'Testimonios',
  usuarios: 'Usuarios',
  personalizar: 'Personalizar Sitio',
  ajustes: 'Ajustes Generales',
  consultas: 'Consultas',
};

export default function AdminTopbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const segment = pathname.split('/')[1] || 'dashboard';
  const title = titles[segment] || 'Dashboard';

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
        <button className="text-gray-400 hover:text-gray-600 text-lg" title="Buscar">{'\u{1F50D}'}</button>
        <button
          onClick={() => {
            navigate('/admin/consultas');
            useConsultasStore.getState().setUnreadCount(0);
          }}
          className="text-gray-400 hover:text-gray-600 text-lg relative"
          title="Notificaciones"
        >
          {'\u{1F514}'}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {user?.nombre || 'Admin'} {user?.apellido || ''}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Administrador'}</p>
          </div>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition-colors" title="Cerrar sesion">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
