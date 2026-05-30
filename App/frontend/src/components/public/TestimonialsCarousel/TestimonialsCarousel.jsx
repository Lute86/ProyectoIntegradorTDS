import { useState, useEffect, useCallback } from 'react'
import TestimonialSlide from './TestimonialSlide'

export default function TestimonialsCarousel({ testimonios }) {
  const [current, setCurrent] = useState(0)

  const total = testimonios?.length || 0

  const goTo = useCallback((index) => {
    setCurrent(((index % total) + total) % total)
  }, [total])

  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext, total])

  if (total === 0) return null

  const t = testimonios[current]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-content mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-slate-900">Lo que dicen nuestros estudiantes</h2>
          <p className="text-slate-500 mt-2">Testimonios de quienes forman parte del IFTS 29</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <TestimonialSlide testimonio={t} />

          {total > 1 && (
            <>
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                  aria-label="Anterior"
                >
                  ◀
                </button>
                <button
                  onClick={goNext}
                  className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                  aria-label="Siguiente"
                >
                  ▶
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                {testimonios.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-blue-600' : 'bg-slate-300'}`}
                    aria-label={`Ir al testimonio ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
