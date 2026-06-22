import { useState, useEffect, useCallback } from 'react'
import { useGaleriaStore } from '../../../stores/galeriaStore';
import { getImageUrl } from '../../../services/api';
import SectionHeader from '../SectionHeader/SectionHeader'
import useScrollReveal from '../../../hooks/useScrollReveal'

const badgeColors = {
  Instalaciones: 'bg-blue-500 text-white',
  Eventos: 'bg-amber-500 text-white',
  Alumnos: 'bg-emerald-500 text-white',
}

export default function GaleriaCarousel() {
  const { imagenes, fetchImagenes } = useGaleriaStore()
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(3)
  const { ref, isVisible, style } = useScrollReveal({ delayMs: 500 })

  useEffect(() => { fetchImagenes() }, [fetchImagenes])

  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth
      if (w < 640) setVisible(1)
      else if (w < 1024) setVisible(2)
      else setVisible(3)
    }
    updateVisible()
    window.addEventListener('resize', updateVisible)
    return () => window.removeEventListener('resize', updateVisible)
  }, [])

  const total = imagenes.length
  const maxIndex = Math.max(0, total - visible)

  const goTo = useCallback((i) => {
    setCurrent(Math.max(0, Math.min(i, maxIndex)))
  }, [maxIndex])

  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (total <= visible) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext, total, visible])

  return (
    <section ref={ref} className={`py-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={style}>
      <div className="max-w-content-narrow mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Nuestro instituto" title="Galeria del Instituto" />

        <div className="relative">
          {total > visible && current > 0 && (
            <button onClick={goPrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-full shadow-lg hover:bg-black/20 dark:hover:bg-white/20 text-body dark:text-white text-sm transition-all"
              aria-label="Anterior">
              ◀
            </button>
          )}

          <div className="overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * (100 / visible)}%)`, justifyContent: total <= visible ? 'center' : undefined }}>
              {imagenes.map((img) => (
                <div key={img.id} className="px-3 shrink-0"
                  style={{ flex: `0 0 ${100 / visible}%` }}>
                  <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden group">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={getImageUrl(img.url)} alt={img.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${badgeColors[img.categoria] || 'bg-gray-500 text-white'}`}>
                        {img.categoria}
                      </span>
                      <h3 className="text-sm font-bold text-body dark:text-white">{img.titulo}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {total > visible && current < maxIndex && (
            <button onClick={goNext}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-full shadow-lg hover:bg-black/20 dark:hover:bg-white/20 text-body dark:text-white text-sm transition-all"
              aria-label="Siguiente">
              ▶
            </button>
          )}
        </div>

        {total > visible && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-body w-6 dark:bg-white' : 'bg-body/30 hover:bg-body/50 dark:bg-white/30 dark:hover:bg-white/50'}`}
                aria-label={`Ir a la imagen ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
