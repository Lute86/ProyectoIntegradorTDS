import { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { useEventosStore } from '../../../stores/eventosStore';
import EventoFormModal from '../../../components/admin/EventoFormModal';

const EventosPage = () => {
  const { eventos, isLoading, error, fetchEventos, deleteEvento } = useEventosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState(null);

  useEffect(() => {fetchEventos();}, []);

  const abrirModalCrear = () => {
    setEventoToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (evento) => {
    setEventoToEdit(evento);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEventoToEdit(null);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('Confirma que desea eliminar este evento?')) {
      await deleteEvento(id);
    }
  };

  const columns = [
  {
    header: 'Nombre',
    accessor: (e) =>
    <span className="font-semibold text-gray-800 dark:text-slate-100 text-sm truncate block max-w-[150px]">{e.nombre}</span>

  },
  {
    header: 'Fecha',
    accessor: (e) => {
      const d = new Date(e.fecha);
      const f = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      return <span className="whitespace-nowrap text-sm">{f}</span>;
    }
  },
  {
    header: 'Ubicacion',
    accessor: (e) => <span className="text-sm text-gray-600 dark:text-slate-400">{e.ubicacion}</span>
  },
  {
    header: 'Estado',
    accessor: (e) => {
      const estilos = {
        pendiente: 'bg-amber-50 text-amber-600 border-amber-100',
        confirmado: 'bg-green-50 text-green-600 border-green-100',
        finalizado: 'bg-blue-50 text-blue-600 border-blue-100',
        cancelado: 'bg-red-50 text-red-600 border-red-100'
      };
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${estilos[e.estado] || 'bg-gray-50 text-gray-600'}`}>
            {e.estado}
          </span>);

    }
  },
  {
    header: 'Acciones',
    accessor: (e) =>
    <div className="flex gap-2 justify-end">
          <button
        onClick={() => abrirModalEditar(e)}
        className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">

            Editar
          </button>
          <button
        onClick={() => handleEliminar(e.id)}
        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">

            Borrar
          </button>
        </div>,

    className: 'w-28 min-w-[7rem] text-right'
  }];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Gestion de Eventos</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Administra los eventos del instituto.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2">

          <span className="text-lg">+</span>
          <span>Nuevo Evento</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        {error &&
        <div className="flex items-center gap-3 p-4 bg-red-50 border-b border-red-100">
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
            <span className="text-sm text-red-700 font-medium">{error}</span>
          </div>
        }

        {isLoading ?
        <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) =>
          <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-2 bg-gray-100 dark:bg-slate-700/50 rounded w-1/4" />
                </div>
              </div>
          )}
          </div> :

        <DataTable
          searchable
          columns={columns}
          data={eventos}
          emptyMessage="No hay eventos registrados." />

        }
      </div>

      <EventoFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        eventoToEdit={eventoToEdit} />

    </div>);

};

export default EventosPage;
