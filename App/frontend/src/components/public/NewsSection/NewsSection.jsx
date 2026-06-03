import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import NewsCard from './NewsCard'

export default function NewsSection({ noticias }) {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(3)

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

  const ultimas = noticias?.slice(0, 6) || []
  const total = ultimas.length
  const maxIndex = Math.max(0, total - visible)

  const goTo = useCallback((i) => {
    setCurrent(Math.max(0, Math.min(i, maxIndex)))
  }, [maxIndex])

  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (total <= visible) return
    const timer = setInterval(goNext, 6000)
    return () => clearInterval(timer)
  }, [goNext, total, visible])

  if (total === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-content mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-slate-900">Ultimas Noticias</h2>
          <p className="text-slate-500 mt-2">Mantenete informado sobre las novedades del instituto</p>
        </div>

        <div className="relative">
          {total > visible && current > 0 && (
            <button onClick={goPrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-full shadow-sm hover:bg-slate-100 text-sm transition-colors"
              aria-label="Anterior">
              ◀
            </button>
          )}

          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * (100 / visible)}%)`, justifyContent: total <= visible ? 'center' : undefined }}>
              {ultimas.map((n) => (
                <div key={n.id} className="px-2 shrink-0"
                  style={{ flex: `0 0 ${100 / visible}%` }}>
                  <NewsCard noticia={n} />
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
                aria-label={`Ir al grupo ${i + 1}`} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/noticias"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  )
}
