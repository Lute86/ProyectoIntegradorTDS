import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout/AdminLayout';
import UsuariosPage from '../pages/admin/UsuariosPage';
import DashboardPage from '../pages/admin/DashboardPage/DashboardPage';
import NoticiasPage from '../pages/admin/NoticiasPage/NoticiasPage';
import EventosPage from '../pages/admin/EventosPage/EventosPage';
import TestimoniosPage from '../pages/admin/TestimoniosPage/TestimoniosPage';

/**
 * AppRouter - Definición central de rutas de la aplicación.
 * Implementa la estructura de rutas protegidas para el panel de administración.
 * Siguiendo Karpathy Guidelines: Estructura clara y directa.
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial al Dashboard de Admin o Home Pública */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Rutas de Administración (Módulos 4 y 5) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Pagina por defecto: Dashboard */}
          <Route index element={<DashboardPage />} />
          
          {/* Gestión de Usuarios (Tarea Actual) */}
          <Route path="usuarios" element={<UsuariosPage />} />

          {/* Gestion de Noticias */}
          <Route path="noticias" element={<NoticiasPage />} />
          <Route path="eventos" element={<EventosPage />} />
          <Route path="testimonios" element={<TestimoniosPage />} />
        </Route>

        {/* Manejo de errores 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <h1 className="text-6xl font-bold text-blue-600">404</h1>
            <p className="mt-4 text-xl text-gray-600 font-medium">Lo sentimos, la página que buscas no existe.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Volver al inicio
            </button>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
