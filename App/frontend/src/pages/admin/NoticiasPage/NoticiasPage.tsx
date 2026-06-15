import { useEffect, useState } from 'react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Noticia } from '../../../mocks/noticias.mock';
import { useNoticiasStore } from '../../../stores/noticiasStore';
import NoticiaFormModal from '../../../components/admin/NoticiaFormModal';

const NoticiasPage = () => {
  const { noticias, isLoading, error, fetchNoticias, deleteNoticia } = useNoticiasStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticiaToEdit, setNoticiaToEdit] = useState<Noticia | null>(null);

  useEffect(() => { fetchNoticias(); }, []);

  const abrirModalCrear = () => {
    setNoticiaToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (noticia: Noticia) => {
    setNoticiaToEdit(noticia);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setNoticiaToEdit(null);
  };

  const columns: Column<Noticia>[] = [
    {
      header: 'Titulo',
      accessor: (n) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{n.titulo}</span>
        </div>
      ),
      className: 'w-1/2',
    },
    {
      header: 'Categoria',
      accessor: (n) => n.categoria?.nombre ?? '-',
      className: 'hidden lg:table-cell text-sm',
    },
    {
      header: 'Estado',
      accessor: (n) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            n.estado === 'publicado'
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}
        >
          {n.estado}
        </span>
      ),
    },
    {
      header: 'Fecha',
      accessor: (n) => {
        const d = new Date(n.fecha_publicacion);
        const f = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        return <span className="whitespace-nowrap text-sm">{f}</span>;
      },
      className: 'hidden lg:table-cell text-gray-500 w-32',
    },
    {
      header: 'Acciones',
      accessor: (n) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => abrirModalEditar(n)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => { if (confirm('¿Eliminar esta noticia?')) deleteNoticia(n.id); }}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      ),
      className: 'w-32 text-right',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header de la Pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Noticias</h1>
          <p className="text-sm text-gray-500">Administra las noticias del instituto.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nueva Noticia</span>
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border-b border-red-100">
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
            <span className="text-sm text-red-700 font-medium">{error}</span>
          </div>
        )}

        {isLoading ? (
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
        ) : (
          <DataTable
            searchable
            columns={columns}
            data={noticias}
            emptyMessage="No hay noticias registradas."
          />
        )}
      </div>

      <NoticiaFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        noticiaToEdit={noticiaToEdit}
      />
    </div>
  );
};

export default NoticiasPage;
