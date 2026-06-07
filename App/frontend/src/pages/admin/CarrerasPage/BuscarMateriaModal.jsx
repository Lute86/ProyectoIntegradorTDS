import { useEffect, useState, useMemo } from 'react'
import useMateriasStore from '../../../stores/materiasStore'

const BuscarMateriaModal = ({ isOpen, onClose, carreraId, onAsignada, maxCuatri = 12, cuatrimestrePrefijado }) => {
  const { materias, loading, fetchMaterias, addAsignacion } = useMateriasStore()
  const [busqueda, setBusqueda] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)
  const [cuatrimestre, setCuatrimestre] = useState(cuatrimestrePrefijado || 1)
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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

  const handleAsignar = async () => {
    setErrorMsg('')
    if (loading) { setErrorMsg('Las materias aun se estan cargando.'); return }
    if (!seleccionada) { setErrorMsg('Debe seleccionar una materia.'); return }
    const cuatri = Number(cuatrimestre)
    if (cuatri < 1 || cuatri > maxCuatri) { setErrorMsg(`El cuatrimestre debe estar entre 1 y ${maxCuatri}.`); return }
    if (!cargaHoraria) { setErrorMsg('La carga horaria es obligatoria.'); return }
    const ch = Number(cargaHoraria)
    if (isNaN(ch) || ch <= 0) { setErrorMsg('La carga horaria debe ser un numero mayor a 0.'); return }
    setGuardando(true)
    try {
      await addAsignacion(carreraId, {
        materia_id: seleccionada.id,
        cuatrimestre: cuatri,
        carga_horaria_semanal: ch,
      })
      onAsignada()
      handleClose()
    } catch {
      setErrorMsg('Error al asignar la materia.')
    } finally {
      setGuardando(false)
    }
  }

  const handleClose = () => {
    setBusqueda('')
    setSeleccionada(null)
    setCuatrimestre(cuatrimestrePrefijado || 1)
    setCargaHoraria('')
    setErrorMsg('')
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
            <h2 className="text-lg font-bold text-gray-900">Agregar materia</h2>
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
            filtradas.map((m) => (
              <button key={m.id} onClick={() => setSeleccionada(m)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  seleccionada?.id === m.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >{m.nombre}</button>
            ))
          )}
        </div>

        {seleccionada && (
          <div className="border-t border-gray-200 p-5 space-y-3">
            <p className="text-sm font-semibold text-gray-800">{seleccionada.nombre}</p>
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
            <div className="flex gap-2 pt-2">
              <button onClick={handleClose}
                className="flex-1 px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >Cancelar</button>
              <button onClick={handleAsignar} disabled={guardando || loading}
                className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >{guardando ? 'Asignando...' : 'Asignar materia'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuscarMateriaModal
