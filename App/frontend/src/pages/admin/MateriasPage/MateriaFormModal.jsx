import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useMateriasStore from '../../../stores/materiasStore'

const materiaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
})

const MateriaFormModal = ({ isOpen, onClose, materiaToEdit }) => {
  const { createMateria, updateMateria } = useMateriasStore()
  const esEdicion = materiaToEdit !== null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(materiaSchema),
    defaultValues: { nombre: '', descripcion: '' },
  })

  useEffect(() => {
    if (materiaToEdit) {
      reset({
        nombre: materiaToEdit.nombre,
        descripcion: materiaToEdit.descripcion ?? '',
      })
    } else {
      reset({ nombre: '', descripcion: '' })
    }
  }, [materiaToEdit, reset, isOpen])

  const onSubmit = async (data) => {
    try {
      if (esEdicion && materiaToEdit) {
        await updateMateria(materiaToEdit.id, data)
      } else {
        await createMateria(data)
      }
      onClose()
    } catch {
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
            {esEdicion ? 'Editar Materia' : 'Nueva Materia'}
          </h2>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 flex items-center justify-center text-lg font-bold transition-colors"
          >X</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Nombre</label>
            <input {...register('nombre')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Nombre de la materia"
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Descripcion</label>
            <textarea {...register('descripcion')} rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Descripcion de la materia (opcional)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >Cancelar</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {esEdicion ? 'Guardar cambios' : 'Crear materia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MateriaFormModal
