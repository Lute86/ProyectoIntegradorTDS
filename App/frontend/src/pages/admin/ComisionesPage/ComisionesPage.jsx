import { useEffect, useState, useMemo, useCallback } from 'react';
import { comisionesService } from '../../../services/comisionesService';
import useCarrerasStore from '../../../stores/carrerasStore';
import ComisionFormModal from '../../../components/admin/ComisionFormModal';
import { DataTable } from '../../../components/ui/DataTable';

const SEMESTRE_LABELS = { 1: '1er Semestre', 2: '2do Semestre' };

const AdminComisionesPage = () => {
  const { carreras, fetchCarreras } = useCarrerasStore();
  const [comisiones, setComisiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtroCarrera, setFiltroCarrera] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comisionToEdit, setComisionToEdit] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filtroCarrera) params.carrera_id = parseInt(filtroCarrera);
      const res = await comisionesService.getAll(params);
      setComisiones(res.data?.data || res.data || []);
    } catch {
      setComisiones([]);
      setError('Error al cargar comisiones.');
    } finally {
      setLoading(false);
    }
  }, [filtroCarrera]);

  useEffect(() => { fetchCarreras(); }, [fetchCarreras]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const mapaCarreras = useMemo(() => {
    const m = {};
    carreras.forEach((c) => { m[c.id] = c.nombre; });
    return m;
  }, [carreras]);

  const abrirModalCrear = () => {
    setComisionToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (com) => {
    setComisionToEdit(com);
    setIsModalOpen(true);
  };

  const cerrarModal = (refetch) => {
    setIsModalOpen(false);
    setComisionToEdit(null);
    if (refetch) fetchData();
  };

  const eliminarComision = async (com) => {
    if (!confirm(`Eliminar comision "${com.nombre}" y todos sus horarios?`)) return;
    try {
      await comisionesService.delete(com.id);
      fetchData();
    } catch {
      setError('Error al eliminar comision.');
    }
  };

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(t);
  }, [error]);

  const columns = [
    {
      header: 'Nombre',
      accessor: (c) => (
        <span className="font-semibold text-gray-800 text-sm">{c.nombre}</span>
      ),
    },
    {
      header: 'Carrera',
      accessor: (c) => (
        <span className="text-sm text-gray-500">{mapaCarreras[c.carrera_id] || '—'}</span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Anio',
      accessor: (c) => (
        <span className="text-sm text-gray-500">{c.anio_lectivo}</span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      header: 'Semestre',
      accessor: (c) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          c.semestre === 1 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
        }`}>
          {SEMESTRE_LABELS[c.semestre] || c.semestre}
        </span>
      ),
    },
    {
      header: 'Tutor',
      accessor: (c) => (
        <span className="text-sm text-gray-600">
          {c.encargado ? `${c.encargado.nombre} ${c.encargado.apellido}` : '—'}
        </span>
      ),
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Materias',
      accessor: (c) => (
        <span className="text-sm text-gray-500">{(c.carrerasMaterias || []).length}</span>
      ),
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Activa',
      accessor: (c) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          c.activa !== false
            ? 'bg-green-50 text-green-600 border-green-100'
            : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {c.activa !== false ? 'Si' : 'No'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (c) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => abrirModalEditar(c)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >Editar</button>
          <button onClick={() => eliminarComision(c)}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >Eliminar</button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion de Comisiones</h1>
          <p className="text-sm text-gray-500">Administra las comisiones de todas las carreras.</p>
        </div>
        <button onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nueva Comision</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold text-gray-600">Filtrar por carrera:</label>
        <select value={filtroCarrera} onChange={(e) => setFiltroCarrera(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las carreras</option>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

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
          data={comisiones}
          isLoading={loading}
          emptyMessage="No hay comisiones registradas."
        />
      </div>

      <ComisionFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        comisionToEdit={comisionToEdit}
      />
    </div>
  );
};

export default AdminComisionesPage;
