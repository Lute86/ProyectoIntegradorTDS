import { useEffect } from 'react'
import Hero from '../../../components/public/Hero/Hero'
import Stats from '../../../components/public/Stats/Stats'
import CareerCards from '../../../components/public/CareerCards/CareerCards'
import NewsSection from '../../../components/public/NewsSection/NewsSection'
import TestimonialsCarousel from '../../../components/public/TestimonialsCarousel/TestimonialsCarousel'
import { MOCK_TESTIMONIOS } from '../../../data/mockTestimonios'
import { MOCK_STATS } from '../../../data/mockStats'
import useCarrerasStore from '../../../stores/carrerasStore'
import useNoticiasStore from '../../../stores/noticiasStore'

export default function HomePage() {
  const { carreras, fetchCarreras } = useCarrerasStore()
  const { noticias, fetchNoticias } = useNoticiasStore()

  useEffect(() => { fetchCarreras() }, [fetchCarreras])
  useEffect(() => { fetchNoticias() }, [fetchNoticias])

  return (
    <>
      <Hero />
      <Stats items={MOCK_STATS} />
      <CareerCards carreras={carreras} />
      <NewsSection noticias={noticias} />
      <TestimonialsCarousel testimonios={MOCK_TESTIMONIOS} />
    </>
  )
}
