import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCarrerasStore from '../../stores/carrerasStore';
import ColorPicker from '../ui/ColorPicker';

// Esquema de validacion del formulario de carreras
const carreraSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minusculas, numeros y guiones'),
  descripcion: z.string().min(10, 'La descripcion debe tener al menos 10 caracteres'),
  duracion: z.preprocess(
    (val) => (val === '' || val === undefined || val === null) ? undefined : Number(val),
    z.number().int().min(1, 'La duracion debe ser un numero positivo'),
  ),
  modalidad: z.string().min(1, 'Seleccione una modalidad'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color hex invalido (ej: #FF0000)').optional().or(z.literal('')),
  activa: z.boolean(),
});

// Genera un slug a partir de un texto
const generarSlug = (texto) => {
  return texto
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const CarreraFormModal = ({ isOpen, onClose, carreraToEdit }) => {
  const { addCarrera, updateCarrera } = useCarrerasStore();
  const esEdicion = carreraToEdit !== null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(carreraSchema),
    defaultValues: {
      nombre: '',
      slug: '',
      descripcion: '',
      duracion: '',
      modalidad: '',
      color: '',
      activa: true,
    },
  });

  // Cuando se edita, precarga los datos de la carrera
  useEffect(() => {
    if (carreraToEdit) {
      reset({
        nombre: carreraToEdit.nombre,
        slug: carreraToEdit.slug ?? generarSlug(carreraToEdit.nombre),
        descripcion: carreraToEdit.descripcion ?? '',
        duracion: carreraToEdit.duracion ?? '',
        modalidad: carreraToEdit.modalidad ?? '',
        color: carreraToEdit.color ?? '',
        activa: carreraToEdit.activa ?? true,
      });
    } else {
      reset({
        nombre: '', slug: '', descripcion: '',
        duracion: '', modalidad: '', color: '#3B82F6', activa: true,
      });
    }
  }, [carreraToEdit, reset, isOpen]);

  // Auto-genera el slug cuando cambia el nombre
  const nombreActual = watch('nombre');
  useEffect(() => {
    if (!esEdicion && nombreActual) {
      setValue('slug', generarSlug(nombreActual));
    }
  }, [nombreActual, esEdicion, setValue]);

  // Envia los datos a la API
  const onSubmit = async (data) => {
    const body = {
      nombre: data.nombre,
      slug: data.slug,
      descripcion: data.descripcion,
      duracion: data.duracion,
      modalidad: data.modalidad,
      color: data.color || undefined,
      activa: data.activa,
    };

    if (esEdicion && carreraToEdit) {
      await updateCarrera(carreraToEdit.id, body);
    } else {
      await addCarrera(body);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-5">
        {/* Header del modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
            {esEdicion ? 'Editar Carrera' : 'Nueva Carrera'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Nombre</label>
            <input
              {...register('nombre')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Nombre de la carrera"
            />
            {errors.nombre && (
              <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Slug oculto (se auto-genera desde el nombre) */}
          <input type="hidden" {...register('slug')} />

          {/* Campo: Descripcion */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Descripcion</label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Descripcion de la carrera"
            />
            {errors.descripcion && (
              <p className="text-xs text-red-500 mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Filas: Duracion + Modalidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Duracion (años)</label>
              <input
                type="number"
                min={1}
                max={10}
                {...register('duracion')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="3"
              />
              {errors.duracion && (
                <p className="text-xs text-red-500 mt-1">{errors.duracion.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Modalidad</label>
              <select
                {...register('modalidad')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-slate-700"
              >
                <option value="">Seleccione modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrida">Hibrida</option>
              </select>
              {errors.modalidad && (
                <p className="text-xs text-red-500 mt-1">{errors.modalidad.message}</p>
              )}
            </div>
          </div>

          {/* Filas: Color + Activa */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <ColorPicker
                label="Color"
                value={watch('color') || '#3B82F6'}
                onChange={(color) => setValue('color', color, { shouldValidate: true })}
              />
              {errors.color && (
                <p className="text-xs text-red-500 mt-1">{errors.color.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Activa</label>
              <div className="flex items-center h-10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('activa')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm text-gray-600 dark:text-slate-400">Carrera activa</span>
                </label>
              </div>
              {errors.activa && (
                <p className="text-xs text-red-500 mt-1">{errors.activa.message}</p>
              )}
            </div>
          </div>

          {/* Botones de accion */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {esEdicion ? 'Guardar cambios' : 'Crear carrera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarreraFormModal;
