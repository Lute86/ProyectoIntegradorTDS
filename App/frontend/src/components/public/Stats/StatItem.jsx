import { useState, useEffect } from 'react'
import useScrollReveal from '../../../hooks/useScrollReveal'
import CareerIcon from '../../ui/CareerIcon/CareerIcon'

function parseValor(valor) {
  if (!valor || typeof valor !== 'string') return { prefix: '', num: 0, suffix: '' }
  const match = valor.match(/^([+\-]?)([\d.]+)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: valor }
  return { prefix: match[1] || '', num: parseFloat(match[2]), suffix: match[3] || '' }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function StatItem({ valor, label, icono, delay }) {
  const { ref, isVisible, style } = useScrollReveal({ delayMs: parseInt(delay) || 0 })
  const [count, setCount] = useState(0)

  const { prefix, num: target, suffix } = parseValor(valor)

  useEffect(() => {
    if (!isVisible) return

    let cancelled = false
    const duration = 1500
    const start = Date.now()

    function frame() {
      if (cancelled) return
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(easeOutCubic(progress) * target))
      if (progress < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
    return () => { cancelled = true }
  }, [isVisible, target])

  return (
    <div ref={ref} className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ ...style }}>
      <div className="group h-full flex flex-col items-center text-center gap-3 p-5 md:p-6 rounded-2xl bg-white/70 dark:bg-white/[0.06] ring-1 ring-slate-200/70 dark:ring-white/10 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {icono && (
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-md group-hover:scale-110 transition-transform duration-300">
            <CareerIcon name={icono} className="w-6 h-6 [&_svg]:fill-white" />
          </span>
        )}
        <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent tabular-nums">{prefix}{count}{suffix}</h3>
        <p className="text-sm font-medium text-body/70 dark:text-white/70">{label}</p>
      </div>
    </div>
  )
}
