import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTestimoniosStore } from '../../stores/testimoniosStore';

const testimonioEsquema = z.object({
  autor_nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  autor_carrera: z.string().min(3, 'La carrera debe tener al menos 3 caracteres'),
  texto: z.string().min(10, 'El texto debe tener al menos 10 caracteres'),
  visible: z.boolean()
});

const TestimonioFormModal = ({ isOpen, onClose, testimonioToEdit }) => {
  const { addTestimonio, updateTestimonio } = useTestimoniosStore();
  const esEdicion = testimonioToEdit !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(testimonioEsquema),
    defaultValues: { autor_nombre: '', autor_carrera: '', texto: '', visible: true }
  });

  useEffect(() => {
    if (testimonioToEdit) {
      reset({
        autor_nombre: testimonioToEdit.autor_nombre,
        autor_carrera: testimonioToEdit.autor_carrera,
        texto: testimonioToEdit.texto,
        visible: testimonioToEdit.visible
      });
    } else {
      reset({ autor_nombre: '', autor_carrera: '', texto: '', visible: true });
    }
  }, [testimonioToEdit, reset, isOpen]);

  const onSubmit = async (data) => {
    if (esEdicion && testimonioToEdit) {
      await updateTestimonio(testimonioToEdit.id, data);
    } else {
      await addTestimonio(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">{esEdicion ? 'Editar Testimonio' : 'Nuevo Testimonio'}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors">X</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[65vh] pr-1">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Nombre del autor</label>
            <input {...register('autor_nombre')} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Nombre del autor" />
            {errors.autor_nombre && <p className="text-xs text-red-500 mt-1">{errors.autor_nombre.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Carrera / Rol</label>
            <input {...register('autor_carrera')} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ej: Tecnicatura en Desarrollo de Software" />
            {errors.autor_carrera && <p className="text-xs text-red-500 mt-1">{errors.autor_carrera.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Texto</label>
            <textarea {...register('texto')} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" placeholder="Texto del testimonio..." />
            {errors.texto && <p className="text-xs text-red-500 mt-1">{errors.texto.message}</p>}
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="visible" {...register('visible')} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="visible" className="text-sm font-medium text-gray-700 dark:text-slate-300">Visible en el sitio publico</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm">
              {esEdicion ? 'Guardar cambios' : 'Crear testimonio'}
            </button>
          </div>
        </form>
      </div>
    </div>);

};

export default TestimonioFormModal;
