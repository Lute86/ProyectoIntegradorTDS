import { useState, useEffect, useCallback } from 'react'
import TestimonialSlide from './TestimonialSlide'
import useScrollReveal from '../../../hooks/useScrollReveal'

export default function TestimonialsCarousel({ testimonios }) {
  const [current, setCurrent] = useState(0)
  const { ref, isVisible, style } = useScrollReveal({ delayMs: 200 })

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
    <section ref={ref} className={`py-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={style}>
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-10">
          <h2 className="text-h2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="text-body/70 dark:text-white/70 mt-2">Testimonios de quienes forman parte del IFTS 29</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <TestimonialSlide testimonio={t} />

          {total > 1 && (
            <>
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goPrev}
                  className="w-12 h-12 flex items-center justify-center bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-full shadow-lg hover:bg-black/20 dark:hover:bg-white/20 text-body dark:text-white transition-all"
                  aria-label="Anterior"
                >
                  ◀
                </button>
                <button
                  onClick={goNext}
                  className="w-12 h-12 flex items-center justify-center bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-full shadow-lg hover:bg-black/20 dark:hover:bg-white/20 text-body dark:text-white transition-all"
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
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-body w-6 dark:bg-white' : 'bg-body/30 hover:bg-body/50 dark:bg-white/30 dark:hover:bg-white/50'}`}
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
