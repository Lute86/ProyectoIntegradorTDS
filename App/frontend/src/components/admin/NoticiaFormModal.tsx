import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Noticia } from '../../mocks/noticias.mock';
import { useNoticiasStore } from '../../stores/noticiasStore';
import RichEditor from '../ui/RichEditor';

// Esquema de validacion del formulario de noticias
const noticiaSchema = z.object({
  titulo: z.string().min(5, 'El titulo debe tener al menos 5 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minusculas, numeros y guiones'),
  categoria_id: z.string().min(1, 'Seleccione una categoria'),
  estado: z.enum(['borrador', 'publicado'], { required_error: 'Seleccione un estado' }),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
});

type NoticiaFormData = z.infer<typeof noticiaSchema>;

interface NoticiaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticiaToEdit: Noticia | null;
}

// Genera un slug a partir de un texto (minusculas, guiones, sin acentos)
const generarSlug = (texto: string): string => {
  return texto
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const NoticiaFormModal = ({ isOpen, onClose, noticiaToEdit }: NoticiaFormModalProps) => {
  const { addNoticia, updateNoticia, categorias, fetchCategorias } = useNoticiasStore();
  const esEdicion = noticiaToEdit !== null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NoticiaFormData>({
    resolver: zodResolver(noticiaSchema),
    defaultValues: {
      titulo: '',
      slug: '',
      categoria_id: '',
      estado: undefined,
      contenido: '',
    },
  });

  // Trae las categorias de la API al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen, fetchCategorias]);

  // Cuando se edita, precarga los datos de la noticia
  useEffect(() => {
    if (noticiaToEdit) {
      reset({
        titulo: noticiaToEdit.titulo,
        slug: noticiaToEdit.slug ?? generarSlug(noticiaToEdit.titulo),
        categoria_id: String(noticiaToEdit.categoria_id ?? ''),
        estado: noticiaToEdit.estado as NoticiaFormData['estado'],
        contenido: noticiaToEdit.contenido,
      });
    } else {
      reset({ titulo: '', slug: '', categoria_id: '', estado: undefined, contenido: '' });
    }
  }, [noticiaToEdit, reset, isOpen]);

  // Auto-genera el slug cuando cambia el titulo (solo al crear)
  const tituloActual = watch('titulo');
  useEffect(() => {
    if (!esEdicion && tituloActual) {
      setValue('slug', generarSlug(tituloActual));
    }
  }, [tituloActual, esEdicion, setValue]);

  // Envia los datos a la API
  const onSubmit = async (data: NoticiaFormData) => {
    const body = {
      titulo: data.titulo,
      slug: data.slug,
      contenido: data.contenido,
      categoria_id: parseInt(data.categoria_id),
      estado: data.estado,
      fecha_publicacion: new Date().toISOString(),
    };

    if (esEdicion && noticiaToEdit) {
      await updateNoticia(noticiaToEdit.id, body);
    } else {
      await addNoticia(body);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-5">
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {esEdicion ? 'Editar Noticia' : 'Nueva Noticia'}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors">X</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[65vh] pr-1">
          {/* Campo: Titulo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Titulo</label>
            <input
              {...register('titulo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Titulo de la noticia"
            />
            {errors.titulo && (
              <p className="text-xs text-red-500 mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Slug oculto (se auto-genera desde el titulo) */}
          <input type="hidden" {...register('slug')} />

          {/* Filas: Categoria + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
              <select
                {...register('categoria_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="">Seleccione una categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              {errors.categoria_id && (
                <p className="text-xs text-red-500 mt-1">{errors.categoria_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
              <select
                {...register('estado')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="">Seleccione un estado</option>
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </select>
              {errors.estado && (
                <p className="text-xs text-red-500 mt-1">{errors.estado.message}</p>
              )}
            </div>
          </div>

          {/* Campo: Contenido (RichEditor con Controller) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contenido</label>
            <Controller
              name="contenido"
              control={control}
              render={({ field }) => (
                <RichEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Escriba el contenido de la noticia..."
                />
              )}
            />
            {errors.contenido && (
              <p className="text-xs text-red-500 mt-1">{errors.contenido.message}</p>
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
              {esEdicion ? 'Guardar cambios' : 'Crear noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticiaFormModal;
