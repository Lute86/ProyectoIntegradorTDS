const badgeMap = {
  presencial: 'bg-blue-50 text-blue-600 border-blue-100',
  virtual: 'bg-green-50 text-green-600 border-green-100',
}

export default function EventosCard({ evento, onVerDetalle }) {
  const titulo = evento.nombre || evento.titulo
  const descripcion = evento.descripcion
  const fecha = evento.fecha
  const hora = evento.hora || ''
  const modalidad = evento.modalidad || (evento.ubicacion ? 'presencial' : '')

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full" style={{ backgroundColor: 'var(--clr-card)' }}>
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-3">{titulo}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{descripcion}</p>
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">{fecha} {hora && `· ${hora}`}</span>
            <div className="flex items-center gap-2 shrink-0">
              {modalidad && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeMap[modalidad] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                  {modalidad}
                </span>
              )}
              <button onClick={onVerDetalle}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ver detalle →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
