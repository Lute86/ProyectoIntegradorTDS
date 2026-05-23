import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout/PublicLayout'
import { useAuth } from './contexts/AuthContext/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const HomePage = lazy(() => import('./pages/public/HomePage/HomePage'))
const CarrerasPage = lazy(() => import('./pages/public/CarrerasPage/CarrerasPage'))
const CarreraDetailPage = lazy(() => import('./pages/public/CarrerasPage/CarreraDetailPage'))
const ContactoPage = lazy(() => import('./pages/public/ContactoPage/ContactoPage'))
const EstudiantesPage = lazy(() => import('./pages/public/EstudiantesPage/EstudiantesPage'))
const NoticiasPage = lazy(() => import('./pages/public/NoticiasPage/NoticiasPage'))
const NoticiaDetailPage = lazy(() => import('./pages/public/NoticiaDetailPage/NoticiaDetailPage'))
const LoginPage = lazy(() => import('./pages/admin/LoginPage/LoginPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage/DashboardPage'))
const UsuariosPage = lazy(() => import('./pages/admin/UsuariosPage/UsuariosPage'))
const PersonalizarPage = lazy(() => import('./pages/admin/PersonalizarPage/PersonalizarPage'))
const TestimoniosPage = lazy(() => import('./pages/admin/TestimoniosPage/TestimoniosPage'))
const GaleriaPage = lazy(() => import('./pages/admin/GaleriaPage/GaleriaPage'))
const EventosPage = lazy(() => import('./pages/admin/EventosPage/EventosPage'))
const AdminNoticiasPage = lazy(() => import('./pages/admin/NoticiasPage/NoticiasPage'))
const AdminCarrerasPage = lazy(() => import('./pages/admin/CarrerasPage/CarrerasPage'))
const AjustesPage = lazy(() => import('./pages/admin/AjustesPage/AjustesPage'))

export default function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">Cargando...</div>}>
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
    </Suspense>
    </BrowserRouter>
  )
}
