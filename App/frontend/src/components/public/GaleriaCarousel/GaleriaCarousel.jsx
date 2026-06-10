import { useState, useEffect, useCallback } from 'react'
import { useGaleriaStore } from '../../../stores/galeriaStore';

const badgeColors = {
  Instalaciones: 'bg-blue-100 text-blue-700',
  Eventos: 'bg-amber-100 text-amber-700',
  Alumnos: 'bg-green-100 text-green-700',
}

export default function GaleriaCarousel() {
  const { imagenes, fetchImagenes } = useGaleriaStore()
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(3)

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
    <section className="py-16" style={{ backgroundColor: 'var(--clr-bg)' }}>
      <div className="max-w-content mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-slate-900">Galeria del Instituto</h2>
          <p className="text-slate-500 mt-2">Imagenes de nuestras instalaciones, eventos y alumnos</p>
        </div>

        <div className="relative">
          {total > visible && current > 0 && (
            <button onClick={goPrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm hover:bg-slate-100 text-sm transition-colors"
              aria-label="Anterior">
              ◀
            </button>
          )}

          <div className="overflow-hidden rounded-xl">
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * (100 / visible)}%)`, justifyContent: total <= visible ? 'center' : undefined }}>
              {imagenes.map((img) => (
                <div key={img.id} className="px-2 shrink-0"
                  style={{ flex: `0 0 ${100 / visible}%` }}>
                  <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--clr-card)' }}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={img.url} alt={img.titulo}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${badgeColors[img.categoria] || 'bg-gray-100 text-gray-700'}`}>
                        {img.categoria}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{img.titulo}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {total > visible && current < maxIndex && (
            <button onClick={goNext}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm hover:bg-slate-100 text-sm transition-colors"
              aria-label="Siguiente">
              ▶
            </button>
          )}
        </div>

        {total > visible && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-blue-600' : 'bg-slate-300'}`}
                aria-label={`Ir a la imagen ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
