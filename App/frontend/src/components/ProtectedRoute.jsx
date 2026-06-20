import { Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout/AdminLayout';
import ForbiddenPage from '../pages/admin/ForbiddenPage/ForbiddenPage';

export default function ProtectedRoute({ user, loading, allowedRoles, children }) {
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return children ? <ForbiddenPage /> : <Navigate to="/admin/dashboard" replace />;
  }

  return children ? children : <AdminLayout />;
}
