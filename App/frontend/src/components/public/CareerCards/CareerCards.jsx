import CareerCard from './CareerCard'

export default function CareerCards({ carreras }) {
  if (!carreras || carreras.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-content-narrow mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <h2 className="text-h2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent drop-shadow-sm">
            Nuestras Carreras
          </h2>
          <p className="text-body/70 dark:text-white/70 mt-2">Formacion tecnica de calidad con salida laboral inmediata</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {carreras.map((c) => (
            <CareerCard key={c.id} carrera={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
