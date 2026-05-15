import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Instituto de Formacion Tecnica Superior N° 29
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Formamos profesionales en tecnologia con excelencia academica y compromiso social
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/carreras"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver Carreras
          </Link>
          <Link
            to="/estudiantes"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Aula Virtual
          </Link>
        </div>
      </div>
    </section>
  )
}
