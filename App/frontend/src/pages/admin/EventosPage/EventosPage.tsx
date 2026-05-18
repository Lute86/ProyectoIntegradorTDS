import { useEffect, useState } from 'react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Evento } from '../../../mocks/eventos.mock';
import { useEventosStore } from '../../../stores/eventosStore';
import EventoFormModal from '../../../components/admin/EventoFormModal';

const EventosPage = () => {
  const { eventos, isLoading, error, fetchEventos } = useEventosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<Evento | null>(null);

  useEffect(() => { fetchEventos(); }, []);

  const abrirModalCrear = () => {
    setEventoToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (evento: Evento) => {
    setEventoToEdit(evento);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEventoToEdit(null);
  };

  const columns: Column<Evento>[] = [
    {
      header: 'ID',
      accessor: 'id',
      className: 'w-16 text-gray-400 font-mono hidden lg:table-cell',
    },
    {
      header: 'Titulo',
      accessor: (e) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{e.titulo}</span>
        </div>
      ),
    },
    {
      header: 'Fecha',
      accessor: (e) => (
        <span className="text-sm">{e.fecha} - {e.hora}</span>
      ),
    },
    {
      header: 'Modalidad',
      accessor: (e) => {
        const esPresencial = e.modalidad === 'presencial';
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              esPresencial
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : 'bg-violet-50 text-violet-600 border-violet-100'
            }`}
          >
            {e.modalidad}
          </span>
        );
      },
    },
    {
      header: 'Estado',
      accessor: (e) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            e.estado === 'publicado'
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}
        >
          {e.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (e) => (
        <button
          onClick={() => abrirModalEditar(e)}
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Eventos</h1>
          <p className="text-sm text-gray-500">Administra los eventos del instituto.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nuevo Evento</span>
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
            data={eventos}
            emptyMessage="No hay eventos registrados."
          />
        )}
      </div>

      <EventoFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        eventoToEdit={eventoToEdit}
      />
    </div>
  );
};

export default EventosPage;
