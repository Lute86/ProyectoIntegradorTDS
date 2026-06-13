import { Link } from 'react-router-dom'

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
  const { nombre, slug, duracion, descripcion, modalidad, color } = carrera

  return (
    <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div
        className="h-24 flex items-center justify-center text-white text-lg font-bold px-4 text-center leading-tight"
        style={{ backgroundColor: color || '#3B82F6' }}
      >
        {nombre}
      </div>
      <div className="p-6">
        <p className="text-sm text-body/70 dark:text-white/70 mb-4">{descripcion}</p>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles[badgeVariant(modalidad)]}`}>
            {duracion ? `${duracion} años` : ''}
          </span>
          <Link
            to={`/carreras/${slug}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Ver más →
          </Link>
        </div>
      </div>
    </div>
  )
}
