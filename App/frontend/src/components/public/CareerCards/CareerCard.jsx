import { Link } from 'react-router-dom'
import portadaCBg from '../../../assets/fonts/carrera1.png'
import CareerIcon from '../../ui/CareerIcon/CareerIcon'

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

const iniciales = (nombre) => {
  return nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function CareerCard({ carrera }) {
  const { nombre, slug, duracion, descripcion, modalidad, color, icono } = carrera

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="p-6 flex items-center justify-center text-4xl text-white"
        style={{ backgroundImage: `url(${portadaCBg})` }}
      >
        {icono && <CareerIcon name={icono} className="w-12 h-12 [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current" />}
        {!icono && <span>{iniciales(nombre)}</span>}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{nombre}</h3>
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
