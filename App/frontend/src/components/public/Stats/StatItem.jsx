import useScrollReveal from '../../../hooks/useScrollReveal'

export default function StatItem({ valor, label, delay }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: delay || '0ms' }}>
      <div className="inline-block p-4 rounded-2xl dark:bg-white/10 backdrop-blur-sm">
        <h3 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{valor}</h3>
        <p className="text-body dark:text-white/70 mt-1">{label}</p>
      </div>
    </div>
  )
}
