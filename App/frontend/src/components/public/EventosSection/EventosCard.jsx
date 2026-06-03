import { Link } from 'react-router-dom'

const badgeMap = {
  presencial: 'bg-blue-50 text-blue-600 border-blue-100',
  virtual: 'bg-green-50 text-green-600 border-green-100',
}

export default function EventosCard({ evento }) {
  const { titulo, fecha, hora, modalidad, descripcion } = evento

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-3">{titulo}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{descripcion}</p>
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">{fecha} {hora && `· ${hora}`}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeMap[modalidad] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                {modalidad}
              </span>
              <Link
                to="/eventos"
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ver mas →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
