import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext/AuthContext';

export default function ForbiddenPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="text-center px-6">
        <h1 className="text-7xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mb-2">
          Acceso denegado
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          No tenes permisos suficientes para acceder a esta seccion.
          {user && (
            <span>
              {' '}Tu rol actual es <strong className="capitalize">{user.rol}</strong>.
            </span>
          )}
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}