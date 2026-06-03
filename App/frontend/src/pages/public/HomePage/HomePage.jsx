import { useEffect } from 'react';
import { useSiteConfigStore } from '../../../stores/siteConfigStore';
import Hero from '../../../components/public/Hero/Hero';
import Stats from '../../../components/public/Stats/Stats';
import CareerCarousel from '../../../components/public/CareerCarousel/CareerCarousel';
import NewsSection from '../../../components/public/NewsSection/NewsSection';
import GaleriaCarousel from '../../../components/public/GaleriaCarousel/GaleriaCarousel';
import TestimonialsCarousel from '../../../components/public/TestimonialsCarousel/TestimonialsCarousel';
import useCarrerasStore from '../../../stores/carrerasStore';

const SECTION_MAP = {
  hero: <Hero />,
  carreras: <CareerCarousel />,
  noticias: <NewsSection />,
  testimonios: <TestimonialsCarousel />,
  galeria: <GaleriaCarousel />,
};

export default function HomePage() {
  const { config } = useSiteConfigStore();
  const { fetchCarreras } = useCarrerasStore();
  const esBoxed = config.layout === 'boxed';
  const seccionesVisibles = config.sections.filter((s) => s.visible);

  useEffect(() => { fetchCarreras(); }, [fetchCarreras]);

  return (
    <div className={esBoxed ? 'layout-boxed' : 'layout-full'}>
      {seccionesVisibles.map((s) => (
        <div key={s.id}>{SECTION_MAP[s.id] || null}</div>
      ))}
    </div>
  );
}
