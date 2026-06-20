import Hero from '../../../components/public/Hero/Hero'
import Stats from '../../../components/public/Stats/Stats'
import CareerCarousel from '../../../components/public/CareerCarousel/CareerCarousel'
import NewsSection from '../../../components/public/NewsSection/NewsSection'
import GaleriaCarousel from '../../../components/public/GaleriaCarousel/GaleriaCarousel'
import TestimonialsCarousel from '../../../components/public/TestimonialsCarousel/TestimonialsCarousel'
import EventosSection from '../../../components/public/EventosSection/EventosSection'
import EventoDetailModal from '../../../components/public/EventoDetailModal/EventoDetailModal'
import NoticiaDetailModal from '../../../components/public/NoticiaDetailModal/NoticiaDetailModal'
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
  const [selectedNoticia, setSelectedNoticia] = useState(null)
  const { noticias: storeNoticias, fetchNoticias } = useNoticiasStore()
  const { config } = useSiteConfigStore()
  const layout = config?.layout || 'full-width'
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
    const components = {
      hero:        () => <Hero />,
      statistics:  () => <Stats items={MOCK_STATS} />,
      careers:     () => <CareerCarousel carreras={carreras} />,
      news:        () => <NewsSection noticias={noticias} onVerDetalle={(n) => setSelectedNoticia(n)} />,
      events:      () => <EventosSection eventos={eventos} onVerDetalle={(e) => setSelectedEvento(e)} />,
      testimonials:() => <TestimonialsCarousel testimonios={testimonios} />,
      gallery:     () => <GaleriaCarousel />,
    }

    const visibleItems = config.sections
      .filter((s) => s.visible && HOME_SECTION_IDS.includes(s.id))
      .sort((a, b) => a.order - b.order)

    let bandIndex = 0
    return visibleItems.map((s) => {
      const render = components[s.id]
      if (!render) return null
      if (s.id === 'hero') return <div key={s.id}>{render()}</div>
      const banded = bandIndex % 2 === 0
      bandIndex += 1
      return (
        <div
          key={s.id}
          className={banded ? 'bg-white dark:bg-white/[0.04] border-y border-slate-200/60 dark:border-white/[0.06]' : ''}
        >
          {render()}
        </div>
      )
    }).filter(Boolean)
  }, [config.sections, carreras, noticias, eventos, testimonios, setSelectedNoticia])

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 bg-slate-100">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
        {secciones}
      </div>
      {selectedEvento && (
        <EventoDetailModal
          evento={selectedEvento}
          onClose={() => setSelectedEvento(null)}
        />
      )}
      {selectedNoticia && (
        <NoticiaDetailModal
          noticia={selectedNoticia}
          onClose={() => setSelectedNoticia(null)}
        />
      )}
    </div>
  )
}
