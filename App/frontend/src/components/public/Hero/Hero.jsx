import { Link } from 'react-router-dom'
import portadaBg from '../../../assets/fonts/portada.jpeg'

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center text-white min-h-[340px] md:min-h-[440px] flex items-center"
      style={{ backgroundImage: `url(${portadaBg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-content mx-auto px-4 text-center">
        <div className="flex flex-col justify-between min-h-[340px] md:min-h-[440px] pt-8 md:pt-12">
          <h1 className="text-hero mb-12 leading-tight">
            Instituto de Formacion Tecnica Superior N° 29
          </h1>
          <div className="pb-6 md:pb-10">
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
              Formamos profesionales en tecnologia con excelencia academica y compromiso social
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/carreras"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-blue-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Ver Carreras
              </Link>
              <a href="https://aulasvirtuales.bue.edu.ar/" target="_blank" rel="noopener noreferrer"className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/80 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white hover:shadow-lg transition-all duration-300"   >
               Aula Virtual
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}