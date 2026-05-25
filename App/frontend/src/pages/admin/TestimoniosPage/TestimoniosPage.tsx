import { useEffect, useState } from 'react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Testimonio } from '../../../mocks/testimonios.mock';
import { useTestimoniosStore } from '../../../stores/testimoniosStore';
import TestimonioFormModal from '../../../components/admin/TestimonioFormModal';

const TestimoniosPage = () => {
  const { testimonios, isLoading, error, fetchTestimonios } = useTestimoniosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonioToEdit, setTestimonioToEdit] = useState<Testimonio | null>(null);

  useEffect(() => { fetchTestimonios(); }, []);

  const abrirModalCrear = () => {
    setTestimonioToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (testimonio: Testimonio) => {
    setTestimonioToEdit(testimonio);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setTestimonioToEdit(null);
  };

  const columns: Column<Testimonio>[] = [
    {
      header: 'ID',
      accessor: 'id',
      className: 'w-16 text-gray-400 font-mono hidden lg:table-cell',
    },
    {
      header: 'Autor',
      accessor: (t) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{t.autor}</span>
          <span className="text-xs text-gray-400">{t.carrera}</span>
        </div>
      ),
    },
    {
      header: 'Contenido',
      accessor: (t) => (
        <p className="text-sm text-gray-600 truncate max-w-xs">{t.contenido}</p>
      ),
    },
    {
      header: 'Estado',
      accessor: (t) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            t.estado === 'aprobado'
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}
        >
          {t.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (t) => (
        <button
          onClick={() => abrirModalEditar(t)}
          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Editar
        </button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header de la Pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Testimonios</h1>
          <p className="text-sm text-gray-500">Administra los testimonios de alumnos y graduados.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nuevo Testimonio</span>
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
            columns={columns}
            data={testimonios}
            emptyMessage="No hay testimonios registrados."
          />
        )}
      </div>

      <TestimonioFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        testimonioToEdit={testimonioToEdit}
      />
    </div>
  );
};

export default TestimoniosPage;
