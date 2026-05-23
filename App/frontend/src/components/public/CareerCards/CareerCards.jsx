import CareerCard from './CareerCard'

export default function CareerCards({ carreras }) {
  if (!carreras || carreras.length === 0) return null

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nuestras Carreras</h2>
          <p className="text-slate-500 mt-2">Formacion tecnica de calidad con salida laboral inmediata</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {carreras.map((c) => (
            <div key={c.id} className="w-full md:w-[calc(33.333%-1rem)] max-w-sm">
              <CareerCard carrera={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
