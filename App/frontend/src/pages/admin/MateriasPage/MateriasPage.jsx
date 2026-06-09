import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useMateriasStore from '../../../stores/materiasStore'
import useCarrerasStore from '../../../stores/carrerasStore'
import MateriaFormModal from './MateriaFormModal'

const AdminMateriasPage = () => {
  const { materias, loading, error, fetchMaterias, deleteMateria } = useMateriasStore()
  const { carreras, fetchCarreras } = useCarrerasStore()
  const [materiaModalOpen, setMateriaModalOpen] = useState(false)
  const [materiaToEdit, setMateriaToEdit] = useState(null)
  const [asignarModalMateria, setAsignarModalMateria] = useState(null)

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

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : materias.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 italic text-sm">No hay materias registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 hidden lg:table-cell">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {materias.map((m) => (
                    <tr key={m.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono hidden lg:table-cell">{m.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-sm">{m.nombre}</span>
                          {m.descripcion && (
                            <span className="text-xs text-gray-400 truncate max-w-xs hidden md:inline">{m.descripcion}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setAsignarModalMateria(m)}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          >Asignar carrera</button>
                          <button onClick={() => abrirEditar(m)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >Editar</button>
                          <button onClick={() => handleDelete(m.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MateriaFormModal
        isOpen={materiaModalOpen}
        onClose={cerrarMateriaModal}
        materiaToEdit={materiaToEdit}
      />

      <AsignarCarreraModal
        isOpen={!!asignarModalMateria}
        onClose={() => setAsignarModalMateria(null)}
        materia={asignarModalMateria}
      />

    </div>
  )
}

const AsignarCarreraModal = ({ isOpen, onClose, materia }) => {
  const { carreras, loading: carrerasLoading } = useCarrerasStore()
  const { addAsignacion } = useMateriasStore()
  const [feedback, setFeedback] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(z.object({
      carrera_id: z.string().min(1, 'Selecciona una carrera'),
      cuatrimestre: z.coerce.number().int().min(1, 'Minimo 1').max(12, 'Maximo 12'),
      carga_horaria_semanal: z.coerce.number().int().positive('Debe ser un numero positivo'),
    })),
    defaultValues: { carrera_id: '', cuatrimestre: '', carga_horaria_semanal: '' },
  })

  useEffect(() => {
    if (!isOpen) {
      reset({ carrera_id: '', cuatrimestre: '', carga_horaria_semanal: '' })
      setFeedback(null)
    }
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setFeedback(null)
    try {
      await addAsignacion(data.carrera_id, {
        materia_id: materia.id,
        cuatrimestre: data.cuatrimestre,
        carga_horaria_semanal: data.carga_horaria_semanal,
      })
      setFeedback({ type: 'success', message: 'Materia asignada correctamente' })
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      const mensaje = err.response?.data?.message || err.message || 'Error al asignar la materia'
      setFeedback({ type: 'error', message: mensaje })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Asignar carrera a: {materia?.nombre}
          </h2>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >X</button>
        </div>

        {carrerasLoading ? (
          <p className="text-sm text-gray-400 text-center py-4">Cargando carreras...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Carrera</label>
              <select {...register('carrera_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="">Seleccionar carrera...</option>
                {carreras.filter((c) => c.activa).map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.carrera_id && <p className="text-xs text-red-500 mt-1">{errors.carrera_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cuatrimestre</label>
              <input type="number" {...register('cuatrimestre')} min={1} max={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="1"
              />
              {errors.cuatrimestre && <p className="text-xs text-red-500 mt-1">{errors.cuatrimestre.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Carga horaria semanal (hs)</label>
              <input type="number" {...register('carga_horaria_semanal')} min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="4"
              />
              {errors.carga_horaria_semanal && <p className="text-xs text-red-500 mt-1">{errors.carga_horaria_semanal.message}</p>}
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
                  {feedback.type === 'success' ? '✓' : '!'}
                </span>
                {feedback.message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
              >Cancelar</button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
              >
                {isSubmitting ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminMateriasPage
