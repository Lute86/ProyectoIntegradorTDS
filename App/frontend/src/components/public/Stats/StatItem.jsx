import { useState, useEffect } from 'react'
import useScrollReveal from '../../../hooks/useScrollReveal'

function parseValor(valor) {
  if (!valor || typeof valor !== 'string') return { prefix: '', num: 0, suffix: '' }
  const match = valor.match(/^([+\-]?)([\d.]+)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: valor }
  return { prefix: match[1] || '', num: parseFloat(match[2]), suffix: match[3] || '' }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function StatItem({ valor, label, delay }) {
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
    <div ref={ref} className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ ...style }}>
      <div className="inline-block p-4 rounded-2xl dark:bg-white/10 backdrop-blur-sm">
        <h3 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{prefix}{count}{suffix}</h3>
        <p className="text-body dark:text-white/70 mt-1">{label}</p>
      </div>
    </div>
  )
}
