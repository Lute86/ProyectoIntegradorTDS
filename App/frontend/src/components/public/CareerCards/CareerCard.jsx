import { Link } from 'react-router-dom'
import Badge from '../../ui/Badge/Badge'

export default function CareerCard({ carrera }) {
  const { nombre, slug, duracion, descripcion, icono, color, badgeVariant } = carrera

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-br ${color} p-6 flex items-center justify-center text-4xl text-white`}>
        {icono}
      </div>
      <div className="p-6">
        <Badge variant={badgeVariant}>{duracion}</Badge>
        <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">{nombre}</h3>
        <p className="text-sm text-slate-500 mb-4">{descripcion}</p>
        <Link
          to={`/carreras`}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Ver mas →
        </Link>
      </div>
    </div>
  )
}
