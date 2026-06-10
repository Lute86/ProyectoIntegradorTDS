import Hero from '../../../components/public/Hero/Hero'
import Stats from '../../../components/public/Stats/Stats'
import CareerCarousel from '../../../components/public/CareerCarousel/CareerCarousel'
import NewsSection from '../../../components/public/NewsSection/NewsSection'
import GaleriaCarousel from '../../../components/public/GaleriaCarousel/GaleriaCarousel'
import TestimonialsCarousel from '../../../components/public/TestimonialsCarousel/TestimonialsCarousel'
import EventosSection from '../../../components/public/EventosSection/EventosSection'
import EventoDetailModal from '../../../components/public/EventoDetailModal/EventoDetailModal'
import { MOCK_STATS } from '../../../data/mockStats'
import { useState, useEffect, useMemo } from 'react'
import useCarrerasStore from '../../../stores/carrerasStore'
import { useNoticiasStore } from '../../../stores/noticiasStore'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import { useEventosStore } from '../../../stores/eventosStore'
import { useTestimoniosStore } from '../../../stores/testimoniosStore'
const HOME_SECTION_IDS = ['hero', 'statistics', 'careers', 'news', 'events', 'testimonials', 'gallery']

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
  const [selectedEvento, setSelectedEvento] = useState(null)
  const { noticias: storeNoticias, fetchNoticias } = useNoticiasStore()
  const { config } = useSiteConfigStore()
  const layout = useSiteConfigStore((s) => s.config.layout)
  const { eventos, fetchEventos } = useEventosStore()
  const { testimonios, fetchTestimonios } = useTestimoniosStore()

  useEffect(() => { fetchCarreras() }, [fetchCarreras])
  useEffect(() => { fetchNoticias({ estado: 'publicado' }) }, [fetchNoticias])
  useEffect(() => { fetchEventos() }, [fetchEventos])
  useEffect(() => { fetchTestimonios() }, [fetchTestimonios])

  const noticias = useMemo(() => {
    const lista = Array.isArray(storeNoticias) ? storeNoticias : []
    return lista.map(adaptNoticia)
  }, [storeNoticias])

  const secciones = useMemo(() => {
    const mapa = {
      hero:        <Hero />,
      statistics:  <Stats items={MOCK_STATS} />,
      careers:     <CareerCarousel carreras={carreras} />,
      news:        <NewsSection noticias={noticias} />,
      events:      <EventosSection eventos={eventos} onVerDetalle={(e) => setSelectedEvento(e)} />,
      testimonials:<TestimonialsCarousel testimonios={testimonios} />,
      gallery:     <GaleriaCarousel />,
    }

    const visibleItems = config.sections
      .filter((s) => s.visible && HOME_SECTION_IDS.includes(s.id))
      .sort((a, b) => a.order - b.order)

    const heroSection = visibleItems.find(s => s.id === 'hero')
    const otrasSecciones = visibleItems.filter(s => s.id !== 'hero')

    return {
      hero: heroSection ? <div key="hero">{mapa['hero']}</div> : null,
      otras: otrasSecciones.map((s) => <div key={s.id}>{mapa[s.id]}</div>).filter(Boolean),
    }
  }, [config.sections, carreras, noticias, eventos, testimonios])

  return (
    <div style={{ backgroundColor: 'var(--clr-bg)' }}>
      {secciones.hero}
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto px-4 w-full' : ''}>
        {secciones.otras}
      </div>
      {selectedEvento && (
        <EventoDetailModal
          evento={selectedEvento}
          onClose={() => setSelectedEvento(null)}
        />
      )}
    </div>
  )
}
