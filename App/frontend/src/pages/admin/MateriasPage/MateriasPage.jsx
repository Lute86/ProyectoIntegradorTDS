import { useEffect, useState, useMemo } from 'react'
import api from '../../../services/api'
import useMateriasStore from '../../../stores/materiasStore'
import useCarrerasStore from '../../../stores/carrerasStore'
import MateriaFormModal from './MateriaFormModal'
import { DataTable } from '../../../components/ui/DataTable'

const nombresCuatri = {
  1: 'Primer Cuatrimestre',
  2: 'Segundo Cuatrimestre',
  3: 'Tercer Cuatrimestre',
  4: 'Cuarto Cuatrimestre',
  5: 'Quinto Cuatrimestre',
  6: 'Sexto Cuatrimestre',
}

const AdminMateriasPage = () => {
  const { materias, loading, error, fetchMaterias, deleteMateria } = useMateriasStore()
  const { carreras, fetchCarreras } = useCarrerasStore()
  const [materiaModalOpen, setMateriaModalOpen] = useState(false)
  const [materiaToEdit, setMateriaToEdit] = useState(null)
  const [asignarModalData, setAsignarModalData] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => { fetchMaterias(); fetchCarreras() }, [fetchMaterias, fetchCarreras])

  const abrirCrear = () => {
    setMateriaToEdit(null)
    setMateriaModalOpen(true)
  }

  const abrirEditar = (materia) => {
    setMateriaToEdit(materia)
    setMateriaModalOpen(true)
  }

  const [deleteError, setDeleteError] = useState('')

  const cerrarMateriaModal = () => {
    setMateriaModalOpen(false)
    setMateriaToEdit(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta materia?')) return
    try {
      await deleteMateria(id)
      setDeleteError('')
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Error al eliminar la materia')
    }
  }

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      className: 'w-16 text-gray-400 font-mono hidden lg:table-cell',
    },
    {
      header: 'Nombre',
      accessor: (m) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{m.nombre}</span>
          {m.descripcion && (
            <span className="text-xs text-gray-400 truncate max-w-xs hidden md:inline">{m.descripcion}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Acciones',
      accessor: (m) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => setAsignarModalData({ materias: [m] })}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >Asignar carrera</button>
          <button onClick={() => abrirEditar(m)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >Editar</button>
          <button onClick={() => handleDelete(m.id)}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >Eliminar</button>
        </div>
      ),
      className: 'text-right',
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Materias</h1>
          <p className="text-sm text-gray-500">Administra las materias y asignaciones a carreras.</p>
        </div>
        <button onClick={abrirCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nueva Materia</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border-b border-red-100">
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
            <span className="text-sm text-red-700 font-medium">{error}</span>
          </div>
        )}
        {deleteError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border-b border-red-100">
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
            <span className="text-sm text-red-700 font-medium">{deleteError}</span>
          </div>
        )}

        {selectedIds.size > 0 && (
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedIds.size} materia{selectedIds.size !== 1 ? 's' : ''} seleccionada{selectedIds.size !== 1 ? 's' : ''}
            </span>
            <button onClick={() => {
              const seleccionadas = materias.filter((m) => selectedIds.has(m.id))
              setAsignarModalData({ materias: seleccionadas })
            }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
            >Asignar a carrera</button>
            <button onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >Limpiar seleccion</button>
          </div>
        )}

        <DataTable
          searchable
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          columns={columns}
          data={materias}
          isLoading={loading}
          emptyMessage="No hay materias registradas."
        />
      </div>

      <MateriaFormModal
        isOpen={materiaModalOpen}
        onClose={cerrarMateriaModal}
        materiaToEdit={materiaToEdit}
      />

      <AsignarCarreraModal
        isOpen={!!asignarModalData}
        onClose={() => { setAsignarModalData(null); setSelectedIds(new Set()) }}
        materias={asignarModalData?.materias || []}
      />

    </div>
  )
}

const AsignarCarreraModal = ({ isOpen, onClose, materias }) => {
  const { carreras, loading: carrerasLoading } = useCarrerasStore()
  const { addAsignacion } = useMateriasStore()
  const [feedback, setFeedback] = useState(null)
  const [selectedCarreraId, setSelectedCarreraId] = useState('')
  const [carreraMaterias, setCarreraMaterias] = useState(null)
  const [loadingCarrera, setLoadingCarrera] = useState(false)
  const [cuatrimestre, setCuatrimestre] = useState('')
  const [cargaHoraria, setCargaHoraria] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSelectedCarreraId('')
      setCarreraMaterias(null)
      setCuatrimestre('')
      setCargaHoraria('')
      setFeedback(null)
    }
  }, [isOpen])

  const handleCarreraChange = async (carreraId) => {
    setSelectedCarreraId(carreraId)
    if (!carreraId) { setCarreraMaterias(null); return }
    setLoadingCarrera(true)
    try {
      const response = await api.get(`/carreras/${carreraId}`)
      setCarreraMaterias(response.data.data?.carreraMaterias || [])
    } catch {
      setCarreraMaterias([])
    } finally {
      setLoadingCarrera(false)
    }
  }

  const porCuatri = useMemo(() => {
    if (!carreraMaterias) return []
    const grupos = {}
    carreraMaterias.forEach((cm) => {
      const c = cm.cuatrimestre || 1
      if (!grupos[c]) grupos[c] = []
      grupos[c].push(cm)
    })
    return Object.entries(grupos).sort(([a], [b]) => Number(a) - Number(b))
  }, [carreraMaterias])

  const carreraSeleccionada = useMemo(() => {
    return carreras.find((c) => c.id === Number(selectedCarreraId))
  }, [carreras, selectedCarreraId])

  const maxCuatri = carreraSeleccionada?.duracion ? carreraSeleccionada.duracion * 2 : 12

  const onSubmit = async (e) => {
    e.preventDefault()
    setFeedback(null)

    if (!selectedCarreraId) { setFeedback({ type: 'error', message: 'Selecciona una carrera.' }); return }
    const cuatri = Number(cuatrimestre)
    if (!cuatri || cuatri < 1 || cuatri > maxCuatri) { setFeedback({ type: 'error', message: `El cuatrimestre debe estar entre 1 y ${maxCuatri}.` }); return }
    const ch = Number(cargaHoraria)
    if (!ch || ch <= 0) { setFeedback({ type: 'error', message: 'La carga horaria debe ser un numero mayor a 0.' }); return }

    setSubmitting(true)
    let exito = 0
    let fallo = 0
    let ultimoError = ''
    for (const materia of materias) {
      try {
        await addAsignacion(selectedCarreraId, {
          materia_id: materia.id,
          cuatrimestre: cuatri,
          carga_horaria_semanal: ch,
        })
        exito++
      } catch (err) {
        ultimoError = err.response?.data?.message || err.message || ''
        fallo++
      }
    }
    setSubmitting(false)

    if (fallo === 0) {
      setFeedback({ type: 'success', message: `${exito} materia${exito !== 1 ? 's' : ''} asignada${exito !== 1 ? 's' : ''} correctamente.` })
      setTimeout(() => onClose(), 1500)
    } else if (exito === 0 && ultimoError) {
      setFeedback({ type: 'error', message: ultimoError })
    } else {
      setFeedback({ type: 'error', message: `${exito} asignada${exito !== 1 ? 's' : ''}, ${fallo} fallaron.` })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Asignar {materias.length > 1 ? `${materias.length} materias` : 'materia'} a carrera
          </h2>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >X</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {materias.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Materias a asignar</p>
              <div className="flex flex-wrap gap-1.5">
                {materias.map((m) => (
                  <span key={m.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                    {m.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {carrerasLoading ? (
            <p className="text-sm text-gray-400 text-center py-4">Cargando carreras...</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Carrera</label>
                <select value={selectedCarreraId} onChange={(e) => handleCarreraChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                >
                  <option value="">Seleccionar carrera...</option>
                  {carreras.filter((c) => c.activa).map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              {loadingCarrera && (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-12 bg-gray-100 rounded" />
                </div>
              )}

              {carreraMaterias && !loadingCarrera && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Materias de la carrera por cuatrimestre</p>
                  {porCuatri.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Esta carrera no tiene materias asignadas aun.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {porCuatri.map(([cuatri, cmList]) => (
                        <div key={cuatri} className="bg-gray-50 rounded-lg p-2.5">
                          <p className="text-xs font-bold text-blue-600 mb-1">{nombresCuatri[cuatri] || `Cuatrimestre ${cuatri}`}</p>
                          <div className="flex flex-wrap gap-1">
                            {cmList.map((cm) => (
                              <span key={cm.id} className="px-2 py-0.5 bg-white text-gray-600 text-[11px] rounded border border-gray-200">
                                {cm.materia?.nombre || '—'}
                                {cm.carga_horaria_semanal ? ` (${cm.carga_horaria_semanal}hs)` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cuatrimestre</label>
                  <input type="number" min={1} max={maxCuatri} value={cuatrimestre} onChange={(e) => setCuatrimestre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-400 mt-0.5">Max: {maxCuatri}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Carga horaria semanal (hs)</label>
                  <input type="number" min={1} value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="4"
                  />
                </div>
              </div>

              {feedback && (
                <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {feedback.type === 'success' ? '\u2713' : '!'}
                  </span>
                  {feedback.message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
                >Cancelar</button>
                <button type="submit" disabled={submitting || carrerasLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
                >
                  {submitting ? 'Asignando...' : `Asignar a ${carreraSeleccionada?.nombre || 'carrera'}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMateriasPage
