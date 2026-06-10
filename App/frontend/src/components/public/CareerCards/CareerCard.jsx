import { Link } from 'react-router-dom'

const badgeVariant = (mod) => {
  const mapa = { presencial: 'blue', virtual: 'green', hibrida: 'amber' }
  return mapa[mod] || 'gray'
}

const badgeStyles = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  gray: 'bg-gray-50 text-gray-600 border-gray-100',
}

export default function CareerCard({ carrera }) {
  const { nombre, slug, duracion, descripcion, modalidad, color } = carrera

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--clr-card)' }}>
      <div
        className="h-24 flex items-center justify-center text-white text-lg font-bold px-4 text-center leading-tight"
        style={{ backgroundColor: color || '#3B82F6' }}
      >
        {nombre}
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-4">{descripcion}</p>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles[badgeVariant(modalidad)]}`}>
            {duracion ? `${duracion} años` : ''}
          </span>
          <Link
            to={`/carreras/${slug}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver más →
          </Link>
        </div>
      </div>
    </div>
  )
}
