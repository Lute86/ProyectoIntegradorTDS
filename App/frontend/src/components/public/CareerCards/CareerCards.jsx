import CareerCard from './CareerCard'

export default function CareerCards({ carreras }) {
  if (!carreras || carreras.length === 0) return null

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-content mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-slate-900">Nuestras Carreras</h2>
          <p className="text-slate-500 mt-2">Formacion tecnica de calidad con salida laboral inmediata</p>
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
