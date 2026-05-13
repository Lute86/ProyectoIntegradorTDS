import { Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout/AdminLayout';

export default function ProtectedRoute({ user, loading }) {
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <AdminLayout />;
}
