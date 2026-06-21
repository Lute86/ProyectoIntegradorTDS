import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGaleriaStore } from '../../stores/galeriaStore';
import ImageUploader from '../ui/ImageUploader';

const CATEGORIAS = ['Instalaciones', 'Eventos', 'Alumnos'] as const;

const imagenSchema = z.object({
  titulo: z.string().min(3, 'El titulo debe tener al menos 3 caracteres'),
  categoria: z.enum(CATEGORIAS, { required_error: 'Seleccione una categoria' }),
});

type ImagenFormData = z.infer<typeof imagenSchema>;

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageUploadModal = ({ isOpen, onClose }: ImageUploadModalProps) => {
  const { addImagen } = useGaleriaStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ImagenFormData>({
    resolver: zodResolver(imagenSchema),
    defaultValues: { titulo: '', categoria: undefined },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({ titulo: '', categoria: undefined });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, reset]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ImagenFormData) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('imagen', selectedFile);
    formData.append('titulo', data.titulo);
    formData.append('categoria', data.categoria);
    await addImagen(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        {/* Header del modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Subir Imagen</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Componente de carga visual */}
          <ImageUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} />

          {/* Campo: Titulo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Titulo</label>
            <input
              {...register('titulo')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="Titulo descriptivo de la imagen"
            />
            {errors.titulo && (
              <p className="text-xs text-red-500 mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Campo: Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Categoria</label>
            <select
              {...register('categoria')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
            >
              <option value="">Seleccione una categoria</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-xs text-red-500 mt-1">{errors.categoria.message}</p>
            )}
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
              disabled={isSubmitting || !selectedFile}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              Subir imagen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;
