import { useEffect, useState } from 'react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Consulta, useConsultasStore } from '../../../stores/consultasStore';
import ConsultaDetailModal from '../../../components/admin/ConsultaDetailModal';

const ConsultasPage = () => {
  const { consultas, isLoading, error, fetchConsultas, eliminarConsulta } = useConsultasStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultaActiva, setConsultaActiva] = useState<Consulta | null>(null);

  useEffect(() => { fetchConsultas(); }, []);

  const abrirDetalle = (consulta: Consulta) => {
    setConsultaActiva(consulta);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setConsultaActiva(null);
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('Confirma que desea eliminar esta consulta?')) {
      await eliminarConsulta(id);
    }
  };

  const columns: Column<Consulta>[] = [
    { header: 'Nombre', accessor: (c) => <span className="font-medium text-gray-800 text-sm">{c.nombre}</span> },
    { header: 'Email', accessor: 'email', className: 'hidden lg:table-cell text-sm' },
    { header: 'Asunto', accessor: (c) => <span className="text-sm text-gray-600 truncate max-w-[200px] block">{c.asunto}</span> },
    { header: 'Fecha', accessor: (c) => <span className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('es-AR')}</span>, className: 'hidden md:table-cell' },
    {
      header: 'Estado',
      accessor: (c) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.respondido ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
          {c.respondido ? 'Respondida' : 'Pendiente'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Consultas</h1>
          <p className="text-sm text-gray-500">Consulta y responde los mensajes recibidos desde el formulario de contacto.</p>
        </div>
      </div>

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
            data={consultas}
            emptyMessage="No hay consultas recibidas."
            actions={(c) => (
              <div className="flex gap-2 justify-end">
                <button onClick={() => abrirDetalle(c)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Ver Detalle</button>
                <button onClick={() => handleEliminar(c.id)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Borrar</button>
              </div>
            )}
          />
        )}
      </div>

      <ConsultaDetailModal isOpen={isModalOpen} onClose={cerrarModal} consulta={consultaActiva} />
    </div>
  );
};

export default ConsultasPage;
