import useScrollReveal from '../../../hooks/useScrollReveal'

export default function StatItem({ valor, label, delay }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: delay || '0ms' }}>
      <h3 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{valor}</h3>
      <p className="text-body dark:text-white/70 mt-1">{label}</p>
    </div>
  )
}
