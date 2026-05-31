import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout/PublicLayout'
import HomePage from './pages/public/HomePage/HomePage'
import CarrerasPage from './pages/public/CarrerasPage/CarrerasPage'
import CarreraDetailPage from './pages/public/CarrerasPage/CarreraDetailPage'
import ContactoPage from './pages/public/ContactoPage/ContactoPage'
import EstudiantesPage from './pages/public/EstudiantesPage/EstudiantesPage'
import NoticiasPage from './pages/public/NoticiasPage/NoticiasPage'
import NoticiaDetailPage from './pages/public/NoticiaDetailPage/NoticiaDetailPage'
import LoginPage from './pages/admin/LoginPage/LoginPage'
import DashboardPage from './pages/admin/DashboardPage/DashboardPage.tsx'
import UsuariosPage from './pages/admin/UsuariosPage'
import PersonalizarPage from './pages/admin/PersonalizarPage/PersonalizarPage.tsx'
import TestimoniosPage from './pages/admin/TestimoniosPage/TestimoniosPage.tsx'
import GaleriaPage from './pages/admin/GaleriaPage/GaleriaPage.tsx'
import EventosPage from './pages/admin/EventosPage/EventosPage.tsx'
import AdminNoticiasPage from './pages/admin/NoticiasPage/NoticiasPage.tsx'
import AdminCarrerasPage from './pages/admin/CarrerasPage/CarrerasPage'
import AjustesPage from './pages/admin/AjustesPage/AjustesPage.tsx'
import ConsultasPage from './pages/admin/ConsultasPage/ConsultasPage'
import { useAuth } from './contexts/AuthContext/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/carreras" element={<CarrerasPage />} />
          <Route path="/carreras/:slug" element={<CarreraDetailPage />} />
          <Route path="/noticias" element={<NoticiasPage />} />
          <Route path="/noticias/:slug" element={<NoticiaDetailPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/estudiantes" element={<EstudiantesPage />} />
        </Route>

        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/admin/dashboard" replace />} />

        <Route path="/admin" element={<ProtectedRoute user={user} loading={loading} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><DashboardPage /></ProtectedRoute>} />
          <Route path="noticias" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><AdminNoticiasPage /></ProtectedRoute>} />
          <Route path="carreras" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><AdminCarrerasPage /></ProtectedRoute>} />
          <Route path="eventos" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><EventosPage /></ProtectedRoute>} />
          <Route path="galeria" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor']}><GaleriaPage /></ProtectedRoute>} />
          <Route path="testimonios" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><TestimoniosPage /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><UsuariosPage /></ProtectedRoute>} />
          <Route path="personalizar" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><PersonalizarPage /></ProtectedRoute>} />
          <Route path="ajustes" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><AjustesPage /></ProtectedRoute>} />
          <Route path="consultas" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><ConsultasPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
