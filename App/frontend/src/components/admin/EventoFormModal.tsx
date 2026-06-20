import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Evento } from '../../stores/eventosStore';
import { useEventosStore } from '../../stores/eventosStore';
import RichEditor from '../ui/RichEditor';

const eventoEsquema = z.object({
  nombre: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  fecha: z.string().min(1, 'Seleccione una fecha'),
  ubicacion: z.string().min(1, 'Ingrese la ubicacion o modalidad'),
  estado: z.enum(['pendiente', 'confirmado', 'finalizado', 'cancelado'], {
    required_error: 'Seleccione un estado',
  }),
  descripcion: z.string().min(10, 'La descripcion debe tener al menos 10 caracteres'),
});

type EventoFormData = z.infer<typeof eventoEsquema>;

interface EventoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventoToEdit: Evento | null;
}

const EventoFormModal = ({ isOpen, onClose, eventoToEdit }: EventoFormModalProps) => {
  const { addEvento, updateEvento } = useEventosStore();
  const esEdicion = eventoToEdit !== null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoEsquema),
    defaultValues: {
      nombre: '',
      fecha: '',
      ubicacion: '',
      estado: undefined,
      descripcion: '',
    },
  });

  useEffect(() => {
    if (eventoToEdit) {
      reset({
        nombre: eventoToEdit.nombre,
        fecha: eventoToEdit.fecha,
        ubicacion: eventoToEdit.ubicacion,
        estado: eventoToEdit.estado as EventoFormData['estado'],
        descripcion: eventoToEdit.descripcion,
      });
    } else {
      reset({ nombre: '', fecha: '', ubicacion: '', estado: undefined, descripcion: '' });
    }
  }, [eventoToEdit, reset, isOpen]);

  const onSubmit = async (data: EventoFormData) => {
    if (esEdicion && eventoToEdit) {
      await updateEvento(eventoToEdit.id, data);
    } else {
      await addEvento(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-5">
        {/* Header del modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {esEdicion ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[65vh] pr-1">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              {...register('nombre')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Nombre del evento"
            />
            {errors.nombre && (
              <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Fecha + Ubicacion */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                {...register('fecha')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {errors.fecha && (
                <p className="text-xs text-red-500 mt-1">{errors.fecha.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicacion / Modalidad</label>
              <input
                {...register('ubicacion')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ej: Presencial, Virtual, Aula 3"
              />
              {errors.ubicacion && (
                <p className="text-xs text-red-500 mt-1">{errors.ubicacion.message}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
            <select
              {...register('estado')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Seleccione un estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            {errors.estado && (
              <p className="text-xs text-red-500 mt-1">{errors.estado.message}</p>
            )}
          </div>

          {/* Descripcion (RichEditor) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripcion</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <RichEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describa el evento..."
                />
              )}
            />
            {errors.descripcion && (
              <p className="text-xs text-red-500 mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Botones */}
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
              {esEdicion ? 'Guardar cambios' : 'Crear evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventoFormModal;
