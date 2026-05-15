import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout/PublicLayout'
import HomePage from './pages/public/HomePage/HomePage'
import CarrerasPage from './pages/public/CarrerasPage/CarrerasPage'
import ContactoPage from './pages/public/ContactoPage/ContactoPage'
import EstudiantesPage from './pages/public/EstudiantesPage/EstudiantesPage'
import NoticiasPage from './pages/public/NoticiasPage/NoticiasPage'
import NoticiaDetailPage from './pages/public/NoticiaDetailPage/NoticiaDetailPage'
import LoginPage from './pages/admin/LoginPage/LoginPage'
import DashboardPage from './pages/admin/DashboardPage/DashboardPage'
import UsuariosPage from './pages/admin/UsuariosPage/UsuariosPage'
import PersonalizarPage from './pages/admin/PersonalizarPage/PersonalizarPage'
import TestimoniosPage from './pages/admin/TestimoniosPage/TestimoniosPage'
import GaleriaPage from './pages/admin/GaleriaPage/GaleriaPage'
import EventosPage from './pages/admin/EventosPage/EventosPage'
import AdminNoticiasPage from './pages/admin/NoticiasPage/NoticiasPage'
import AdminCarrerasPage from './pages/admin/CarrerasPage/CarrerasPage'
import AjustesPage from './pages/admin/AjustesPage/AjustesPage'
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
          <Route path="/noticias" element={<NoticiasPage />} />
          <Route path="/noticias/:slug" element={<NoticiaDetailPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/estudiantes" element={<EstudiantesPage />} />
        </Route>

        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/admin/dashboard" replace />} />

        <Route path="/admin" element={<ProtectedRoute user={user} loading={loading} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="personalizar" element={<PersonalizarPage />} />
          <Route path="testimonios" element={<TestimoniosPage />} />
          <Route path="galeria" element={<GaleriaPage />} />
          <Route path="eventos" element={<EventosPage />} />
          <Route path="noticias" element={<AdminNoticiasPage />} />
          <Route path="carreras" element={<AdminCarrerasPage />} />
          <Route path="ajustes" element={<AjustesPage />} />
        </Route>

        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
