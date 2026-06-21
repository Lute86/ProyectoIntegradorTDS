import { useLocation, Link } from 'react-router-dom';

const labels = {
  dashboard: 'Dashboard',
  noticias: 'Noticias',
  carreras: 'Carreras',
  eventos: 'Eventos',
  galeria: 'Galeria',
  testimonios: 'Testimonios',
  usuarios: 'Usuarios',
  personalizar: 'Personalizar Sitio',
  ajustes: 'Ajustes',

};

export default function AdminBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <div className="text-sm text-gray-500 dark:text-slate-400">
      <Link to="/admin/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</Link>
      {segments.length > 1 && (
        <span>
          {' '}/{' '}
          <span className="text-gray-800 dark:text-slate-200 font-medium">
            {labels[segments[1]] || segments[1]}
          </span>
        </span>
      )}
    </div>
  );
}
