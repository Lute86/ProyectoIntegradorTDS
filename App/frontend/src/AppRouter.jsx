import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PublicLayout from './components/layout/PublicLayout/PublicLayout'
import HomePage from './pages/public/HomePage/HomePage'
import CarrerasPage from './pages/public/CarrerasPage/CarrerasPage'
import CarreraDetailPage from './pages/public/CarrerasPage/CarreraDetailPage'
import ContactoPage from './pages/public/ContactoPage/ContactoPage'
import EstudiantesPage from './pages/public/EstudiantesPage/EstudiantesPage'
import NoticiasPage from './pages/public/NoticiasPage/NoticiasPage'
import NoticiaDetailPage from './pages/public/NoticiaDetailPage/NoticiaDetailPage'
import EventosPagePublic from './pages/public/EventosPage/EventosPage'
import NotFoundPage from './pages/public/NotFoundPage/NotFoundPage'
import LoginPage from './pages/admin/LoginPage/LoginPage'
import DashboardPage from './pages/admin/DashboardPage/DashboardPage.jsx'
import UsuariosPage from './pages/admin/UsuariosPage'
import PersonalizarPage from './pages/admin/PersonalizarPage/PersonalizarPage.jsx'
import TestimoniosPage from './pages/admin/TestimoniosPage/TestimoniosPage.jsx'
import GaleriaPage from './pages/admin/GaleriaPage/GaleriaPage.jsx'
import AdminEventosPage from './pages/admin/EventosPage/EventosPage.jsx'
import AdminNoticiasPage from './pages/admin/NoticiasPage/NoticiasPage.jsx'
import AdminCarrerasPage from './pages/admin/CarrerasPage/CarrerasPage'
import CarreraDetailAdmin from './pages/admin/CarrerasPage/CarreraDetailAdmin'
import AdminMateriasPage from './pages/admin/MateriasPage/MateriasPage'

import AjustesPage from './pages/admin/AjustesPage/AjustesPage.jsx'
import ConsultasPage from './pages/admin/ConsultasPage/ConsultasPage'
import { useAuth } from './contexts/AuthContext/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SectionGuard from './components/SectionGuard'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/carreras" element={<SectionGuard sectionId="careers"><CarrerasPage /></SectionGuard>} />
          <Route path="/carreras/:slug" element={<SectionGuard sectionId="careers"><CarreraDetailPage /></SectionGuard>} />
          <Route path="/noticias" element={<SectionGuard sectionId="news"><NoticiasPage /></SectionGuard>} />
          <Route path="/noticias/:slug" element={<SectionGuard sectionId="news"><NoticiaDetailPage /></SectionGuard>} />
          <Route path="/eventos" element={<SectionGuard sectionId="events"><EventosPagePublic /></SectionGuard>} />
          <Route path="/contacto" element={<SectionGuard sectionId="contact"><ContactoPage /></SectionGuard>} />
          <Route path="/estudiantes" element={<SectionGuard sectionId="students"><EstudiantesPage /></SectionGuard>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/admin/dashboard" replace />} />

        <Route path="/admin" element={<ProtectedRoute user={user} loading={loading} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><DashboardPage /></ProtectedRoute>} />
          <Route path="noticias" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><AdminNoticiasPage /></ProtectedRoute>} />
          <Route path="carreras" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><AdminCarrerasPage /></ProtectedRoute>} />
          <Route path="carreras/:id" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><CarreraDetailAdmin /></ProtectedRoute>} />
          <Route path="materias" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><AdminMateriasPage /></ProtectedRoute>} />

          <Route path="eventos" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor', 'tutor']}><AdminEventosPage /></ProtectedRoute>} />
          <Route path="galeria" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin', 'profesor']}><GaleriaPage /></ProtectedRoute>} />
          <Route path="testimonios" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><TestimoniosPage /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><UsuariosPage /></ProtectedRoute>} />
          <Route path="personalizar" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><PersonalizarPage /></ProtectedRoute>} />
          <Route path="ajustes" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><AjustesPage /></ProtectedRoute>} />
          <Route path="consultas" element={<ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}><ConsultasPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
