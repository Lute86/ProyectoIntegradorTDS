import { useEffect } from 'react'
import Hero from '../../../components/public/Hero/Hero'
import CareerCards from '../../../components/public/CareerCards/CareerCards'
import NewsSection from '../../../components/public/NewsSection/NewsSection'
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
      <CareerCards carreras={carreras} />
      <NewsSection noticias={noticias} />
    </>
  )
}
