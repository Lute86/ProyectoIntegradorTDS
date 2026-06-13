import { useEffect, useState } from 'react';
import { GaleriaImagen, useGaleriaStore } from '../../../stores/galeriaStore';
import ImageUploadModal from '../../../components/admin/ImageUploadModal';

const API_BASE = import.meta.env.VITE_API_URL || '';

const imgUrl = (url: string) => url?.startsWith('/') ? `${API_BASE}${url}` : url;

const GaleriaPage = () => {
  const { imagenes, isLoading, error, fetchImagenes, deleteImagen } = useGaleriaStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchImagenes(); }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header de la Pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Galeria de Imagenes</h1>
          <p className="text-sm text-gray-500">Administra las imagenes del instituto.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nueva Imagen</span>
        </button>
      </div>

      {/* Estado de error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
          <span className="text-sm text-red-700 font-medium">{error}</span>
        </div>
      )}

      {/* Estado de carga: skeleton grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : imagenes.length === 0 ? (
        /* Estado vacio */
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 font-bold text-2xl mb-4">+</div>
          <p className="text-sm font-medium">No hay imagenes en la galeria.</p>
          <p className="text-xs mt-1">Haga clic en "Nueva Imagen" para agregar la primera.</p>
        </div>
      ) : (
        /* Grid de imagenes */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagenes.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
              <img
                src={imgUrl(img.url)}
                alt={img.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay en hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-sm font-semibold truncate">{img.titulo}</p>
                <p className="text-white/70 text-[10px] uppercase tracking-wider">{img.categoria}</p>
              </div>
              {/* Boton eliminar superpuesto */}
              <button
                onClick={() => deleteImagen(img.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all flex items-center justify-center"
                title="Eliminar imagen"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default GaleriaPage;
