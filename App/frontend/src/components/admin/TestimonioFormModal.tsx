import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Testimonio } from '../../mocks/testimonios.mock';
import { useTestimoniosStore } from '../../stores/testimoniosStore';

const testimonioEsquema = z.object({
  autor: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  carrera: z.string().min(3, 'La carrera debe tener al menos 3 caracteres'),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  estado: z.enum(['pendiente', 'aprobado'], { required_error: 'Seleccione un estado' }),
});

type TestimonioFormData = z.infer<typeof testimonioEsquema>;

interface TestimonioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonioToEdit: Testimonio | null;
}

const TestimonioFormModal = ({ isOpen, onClose, testimonioToEdit }: TestimonioFormModalProps) => {
  const { addTestimonio, updateTestimonio } = useTestimoniosStore();
  const esEdicion = testimonioToEdit !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonioFormData>({
    resolver: zodResolver(testimonioEsquema),
    defaultValues: {
      autor: '',
      carrera: '',
      contenido: '',
      estado: undefined,
    },
  });

  useEffect(() => {
    if (testimonioToEdit) {
      reset({
        autor: testimonioToEdit.autor,
        carrera: testimonioToEdit.carrera,
        contenido: testimonioToEdit.contenido,
        estado: testimonioToEdit.estado,
      });
    } else {
      reset({ autor: '', carrera: '', contenido: '', estado: undefined });
    }
  }, [testimonioToEdit, reset]);

  const onSubmit = (data: TestimonioFormData) => {
    if (esEdicion && testimonioToEdit) {
      updateTestimonio(testimonioToEdit.id, data);
    } else {
      addTestimonio(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        {/* Header del modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {esEdicion ? 'Editar Testimonio' : 'Nuevo Testimonio'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo: Autor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Autor</label>
            <input
              {...register('autor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Nombre del autor"
            />
            {errors.autor && (
              <p className="text-xs text-red-500 mt-1">{errors.autor.message}</p>
            )}
          </div>

          {/* Campo: Carrera */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Carrera / Rol</label>
            <input
              {...register('carrera')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Ej: Tecnicatura en Desarrollo de Software"
            />
            {errors.carrera && (
              <p className="text-xs text-red-500 mt-1">{errors.carrera.message}</p>
            )}
          </div>

          {/* Campo: Contenido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contenido</label>
            <textarea
              {...register('contenido')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Texto del testimonio..."
            />
            {errors.contenido && (
              <p className="text-xs text-red-500 mt-1">{errors.contenido.message}</p>
            )}
          </div>

          {/* Campo: Estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
            <select
              {...register('estado')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Seleccione un estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
            </select>
            {errors.estado && (
              <p className="text-xs text-red-500 mt-1">{errors.estado.message}</p>
            )}
          </div>

          {/* Botones de accion */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {esEdicion ? 'Guardar cambios' : 'Crear testimonio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonioFormModal;
