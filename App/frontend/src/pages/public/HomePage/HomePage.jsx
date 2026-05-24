import Hero from '../../../components/public/Hero/Hero'
import Stats from '../../../components/public/Stats/Stats'
import CareerCards from '../../../components/public/CareerCards/CareerCards'
import NewsSection from '../../../components/public/NewsSection/NewsSection'
import TestimonialsCarousel from '../../../components/public/TestimonialsCarousel/TestimonialsCarousel'
import { MOCK_CARRERAS } from '../../../data/mockCarreras'
import { MOCK_NOTICIAS } from '../../../data/mockNoticias'
import { MOCK_TESTIMONIOS } from '../../../data/mockTestimonios'
import { MOCK_STATS } from '../../../data/mockStats'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats items={MOCK_STATS} />
      <CareerCards carreras={MOCK_CARRERAS} />
      <NewsSection noticias={MOCK_NOTICIAS} />
      <TestimonialsCarousel testimonios={MOCK_TESTIMONIOS} />
    </>
  )
}
