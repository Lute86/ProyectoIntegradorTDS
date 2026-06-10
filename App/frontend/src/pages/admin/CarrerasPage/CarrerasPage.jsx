import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCarrerasStore from '../../../stores/carrerasStore';
import CarreraFormModal from '../../../components/admin/CarreraFormModal';
import { DataTable } from '../../../components/ui/DataTable';

// Mapa de colores para badges de modalidad
const MODALIDAD_STYLES = {
  presencial: 'bg-blue-50 text-blue-600 border-blue-100',
  virtual: 'bg-green-50 text-green-600 border-green-100',
  hibrida: 'bg-purple-50 text-purple-600 border-purple-100',
};

const MODALIDAD_LABELS = {
  presencial: 'Presencial',
  virtual: 'Virtual',
  hibrida: 'Hibrida',
};

const AdminCarrerasPage = () => {
  const navigate = useNavigate();
  const { carreras, loading, error, fetchCarreras, deleteCarrera } = useCarrerasStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carreraToEdit, setCarreraToEdit] = useState(null);

  useEffect(() => { fetchCarreras(); }, [fetchCarreras]);

  const abrirModalCrear = () => {
    setCarreraToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (carrera) => {
    setCarreraToEdit(carrera);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setCarreraToEdit(null);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      className: 'w-16 text-gray-400 font-mono hidden lg:table-cell',
    },
    {
      header: 'Nombre',
      accessor: (c) => (
        <div className="flex items-center gap-3">
          {c.color && (
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">{c.nombre}</span>
            {c.descripcion && (
              <span className="text-xs text-gray-400 truncate max-w-xs hidden md:inline">{c.descripcion}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Modalidad',
      accessor: (c) => (
        c.modalidad ? (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${MODALIDAD_STYLES[c.modalidad] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {MODALIDAD_LABELS[c.modalidad] || c.modalidad}
          </span>
        ) : (
          <span className="text-xs text-gray-400">&mdash;</span>
        )
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Duracion',
      accessor: (c) => (
        <span className="text-sm text-gray-500">{c.duracion ? `${c.duracion} años` : '—'}</span>
      ),
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Activa',
      accessor: (c) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          c.activa
            ? 'bg-green-50 text-green-600 border-green-100'
            : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {c.activa ? 'Si' : 'No'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (c) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => navigate(`/admin/carreras/${c.id}`)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Plan
          </button>
          <button
            onClick={() => abrirModalEditar(c)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => { if (confirm('¿Eliminar esta carrera?')) deleteCarrera(c.id); }}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header de la Pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Carreras</h1>
          <p className="text-sm text-gray-500">Administra las carreras del instituto.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nueva Carrera</span>
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

        <DataTable
          searchable
          columns={columns}
          data={carreras}
          isLoading={loading}
          emptyMessage="No hay carreras registradas."
        />
      </div>

      <CarreraFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        carreraToEdit={carreraToEdit}
      />
    </div>
  );
};

export default AdminCarrerasPage;
