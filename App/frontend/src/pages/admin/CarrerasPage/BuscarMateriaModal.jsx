import { useEffect, useState, useMemo } from 'react'
import useMateriasStore from '../../../stores/materiasStore'

const BuscarMateriaModal = ({ isOpen, onClose, carreraId, onAsignada, maxCuatri = 12, cuatrimestrePrefijado }) => {
  const { materias, loading, fetchMaterias, addAsignacion } = useMateriasStore()
  const [busqueda, setBusqueda] = useState('')
  const [seleccionadas, setSeleccionadas] = useState(new Set())
  const [cuatrimestre, setCuatrimestre] = useState(cuatrimestrePrefijado || 1)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [resultado, setResultado] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchMaterias()
      if (cuatrimestrePrefijado) setCuatrimestre(cuatrimestrePrefijado)
    }
  }, [isOpen, fetchMaterias, cuatrimestrePrefijado])

  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return materias
    const term = busqueda.toLowerCase()
    return materias.filter((m) => m.nombre.toLowerCase().includes(term))
  }, [materias, busqueda])

  const toggleMateria = (materiaId) => {
    setSeleccionadas((prev) => {
      const next = new Set(prev)
      if (next.has(materiaId)) {
        next.delete(materiaId)
      } else {
        next.add(materiaId)
      }
      return next
    })
  }

  const handleAsignar = async () => {
    setErrorMsg('')
    setResultado('')
    if (loading) { setErrorMsg('Las materias aun se estan cargando.'); return }
    if (seleccionadas.size === 0) { setErrorMsg('Debe seleccionar al menos una materia.'); return }
    const cuatri = Number(cuatrimestre)
    if (cuatri < 1 || cuatri > maxCuatri) { setErrorMsg(`El cuatrimestre debe estar entre 1 y ${maxCuatri}.`); return }
    if (!cargaHoraria) { setErrorMsg('La carga horaria es obligatoria.'); return }
    const ch = Number(cargaHoraria)
    if (isNaN(ch) || ch <= 0) { setErrorMsg('La carga horaria debe ser un numero mayor a 0.'); return }
    setGuardando(true)
    let creadas = 0
    let fallaron = 0
    for (const materiaId of seleccionadas) {
      try {
        await addAsignacion(carreraId, {
          materia_id: materiaId,
          cuatrimestre: cuatri,
          carga_horaria_semanal: ch,
        })
        creadas++
      } catch {
        fallaron++
      }
    }
    setGuardando(false)
    if (fallaron === 0) {
      setResultado(`${creadas} materia${creadas !== 1 ? 's' : ''} asignada${creadas !== 1 ? 's' : ''} correctamente.`)
      setTimeout(() => { onAsignada(); handleClose() }, 1200)
    } else {
      setResultado(`${creadas} creada${creadas !== 1 ? 's' : ''}, ${fallaron} fallaron.`)
    }
  }

  const handleClose = () => {
    setBusqueda('')
    setSeleccionadas(new Set())
    setCuatrimestre(cuatrimestrePrefijado || 1)
    setCargaHoraria('')
    setErrorMsg('')
    setResultado('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Agregar materias al plan</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>
          <input autoFocus value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar materia por nombre..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}
            </div>
          ) : filtradas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              {busqueda ? 'No se encontraron materias.' : 'No hay materias disponibles.'}
            </p>
          ) : (
            filtradas.map((m) => {
              const checked = seleccionadas.has(m.id)
              return (
                <label key={m.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    checked ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleMateria(m.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {m.nombre}
                </label>
              )
            })
          )}
        </div>

        {seleccionadas.size > 0 && (
          <div className="border-t border-gray-200 p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-800">
              {seleccionadas.size} materia{seleccionadas.size !== 1 ? 's' : ''} seleccionada{seleccionadas.size !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cuatrimestre</label>
                {cuatrimestrePrefijado ? (
                  <p className="text-sm font-semibold text-gray-800 py-1.5">Cuatrimestre {cuatrimestrePrefijado}</p>
                ) : (
                  <>
                    <input type="number" min={1} max={maxCuatri} value={cuatrimestre} onChange={(e) => {
                      const val = Number(e.target.value)
                      if (val <= maxCuatri) setCuatrimestre(e.target.value)
                    }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">Max: {maxCuatri}</p>
                  </>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Carga horaria semanal</label>
                <input type="number" min={1} value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)}
                  placeholder="hs"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
            {resultado && (
              <p className={`text-xs font-semibold ${resultado.includes('fallaron') ? 'text-red-500' : 'text-green-600'}`}>
                {resultado}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <button onClick={handleClose}
                className="flex-1 px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >Cancelar</button>
              <button onClick={handleAsignar} disabled={guardando || loading}
                className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >{guardando ? 'Asignando...' : `Asignar ${seleccionadas.size} materia${seleccionadas.size !== 1 ? 's' : ''}`}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuscarMateriaModal
