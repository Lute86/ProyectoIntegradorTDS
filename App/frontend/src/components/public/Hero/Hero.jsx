import { Link } from 'react-router-dom'
import portadaBg from '../../../assets/fonts/portada.jpeg'

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center text-white min-h-[88vh] flex items-center overflow-hidden"
      style={{ backgroundImage: `url(${portadaBg})` }}
    >
      {/* Overlay con gradiente + tinte de marca (reemplaza el negro plano) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/55 to-slate-950/80" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/35 via-transparent to-[var(--color-secondary)]/25 mix-blend-multiply" />

      {/* Acentos decorativos difuminados */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--color-primary)]/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[var(--color-secondary)]/25 blur-3xl animate-float delay-300" />

      <div className="relative z-10 w-full max-w-content mx-auto px-4 text-center py-20">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-semibold uppercase tracking-[0.15em] bg-white/10 ring-1 ring-white/25 backdrop-blur-sm animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse-glow" />
          Educacion publica de calidad
        </span>
        <h1 className="text-hero leading-[1.05] animate-fade-in-up delay-75 text-shadow-hero max-w-3xl mx-auto text-balance">
          Instituto de Formacion Tecnica Superior N° 29
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mt-6 mb-9 max-w-2xl mx-auto animate-fade-in-up delay-150 text-balance">
          Formamos profesionales en tecnologia con excelencia academica y compromiso social
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <Link
            to="/carreras"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
          >
            Ver Carreras
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="https://aulasvirtuales.bue.edu.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-white/70 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white hover:shadow-lg transition-all duration-300"
          >
            Aula Virtual
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in delay-500">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Descubri mas</span>
        <span className="flex items-start justify-center w-6 h-10 rounded-full border-2 border-white/50 p-1.5">
          <span className="w-1 h-2 rounded-full bg-white/80 animate-float" />
        </span>
      </div>
    </section>
  )
}