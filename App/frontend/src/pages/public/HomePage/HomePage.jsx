import Hero from '../../../components/public/Hero/Hero'
import Stats from '../../../components/public/Stats/Stats'
import CareerCarousel from '../../../components/public/CareerCarousel/CareerCarousel'
import NewsSection from '../../../components/public/NewsSection/NewsSection'
import GaleriaCarousel from '../../../components/public/GaleriaCarousel/GaleriaCarousel'
import TestimonialsCarousel from '../../../components/public/TestimonialsCarousel/TestimonialsCarousel'
import { useEffect, useMemo } from 'react'
import useCarrerasStore from '../../../stores/carrerasStore'
import { useNoticiasStore } from '../../../stores/noticiasStore'
import { MOCK_NOTICIAS } from '../../../data/mockNoticias'
import { MOCK_TESTIMONIOS } from '../../../data/mockTestimonios'
import { MOCK_STATS } from '../../../data/mockStats'

function adaptNoticia(n) {
  return {
    id: n.id,
    slug: n.slug,
    titulo: n.titulo,
    contenido: n.contenido,
    categoria: n.categoria?.nombre || n.categoria || 'Sin categoria',
    autor: n.autor
      ? `${n.autor.nombre || ''} ${n.autor.apellido || ''}`.trim() || 'Admin'
      : n.autor || 'Admin',
    fecha: n.fecha_publicacion
      ? new Date(n.fecha_publicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
      : n.fecha || '',
    resumen: n.resumen || n.contenido?.replace(/<[^>]*>/g, '').replace(/[#*]/g, '').trim().substring(0, 120) + '...' || '',
  }
}

export default function HomePage() {
  const { carreras, fetchCarreras } = useCarrerasStore()
  const { noticias: storeNoticias, fetchNoticias } = useNoticiasStore()

  useEffect(() => { fetchCarreras() }, [fetchCarreras])
  useEffect(() => { fetchNoticias({ estado: 'publicado' }) }, [fetchNoticias])

  const noticias = useMemo(() => {
    const lista = Array.isArray(storeNoticias) ? storeNoticias : []
    if (lista.length > 0) return lista.map(adaptNoticia)
    return MOCK_NOTICIAS
  }, [storeNoticias])

  return (
    <>
      <Hero />
      <Stats items={MOCK_STATS} />
      <CareerCarousel carreras={carreras} />
      <NewsSection noticias={noticias} />
      <GaleriaCarousel />
      <TestimonialsCarousel testimonios={MOCK_TESTIMONIOS} />
    </>
  )
}
