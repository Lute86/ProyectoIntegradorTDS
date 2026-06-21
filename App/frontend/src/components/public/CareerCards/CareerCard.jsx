import { Link } from 'react-router-dom'
import CareerIcon from '../../ui/CareerIcon/CareerIcon'

const badgeVariant = (mod) => {
  const mapa = { presencial: 'blue', virtual: 'green', hibrida: 'amber' }
  return mapa[mod] || 'gray'
}

const badgeStyles = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30',
  green: 'bg-green-50 text-green-600 border-green-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30',
  amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/30',
  gray: 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-400/30',
}

export default function CareerCard({ carrera }) {
  const { nombre, slug, duracion, descripcion, modalidad, color, icono } = carrera
  const base = color || '#3B82F6'

  return (
    <Link to={`/carreras/${slug}`}
      className="group flex flex-col h-full bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      {/* Header con gradiente derivado del color de la carrera + icono */}
      <div
        className="relative h-32 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${base} 0%, ${base}cc 55%, ${base}80 100%)` }}
      >
        {/* patron decorativo sutil */}
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/15 blur-md" />
        <div className="absolute -left-8 -bottom-10 w-32 h-32 rounded-full bg-black/10 blur-md" />
        <CareerIcon
          name={icono || 'graduation'}
          className="relative w-14 h-14 [&_svg]:fill-white drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-base font-bold text-body dark:text-white mb-2 leading-tight line-clamp-2">{nombre}</h3>
        <p className="text-sm text-body/70 dark:text-white/70 mb-4 line-clamp-2 flex-1">{descripcion}</p>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles[badgeVariant(modalidad)]}`}>
            {duracion ? `${duracion} años` : ''}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Ver más <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
