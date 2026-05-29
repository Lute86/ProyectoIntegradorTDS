import { useEffect, useState } from 'react';
import useCarrerasStore from '../../../stores/carrerasStore';
import CarreraFormModal from '../../../components/admin/CarreraFormModal';

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
  const { carreras, loading, error, fetchCarreras, deleteCarrera } = useCarrerasStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carreraToEdit, setCarreraToEdit] = useState(null);

  useEffect(() => { fetchCarreras(); }, []);

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

        {loading ? (
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
        ) : carreras.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 italic text-sm">No hay carreras registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 hidden lg:table-cell">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Modalidad</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Duracion</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activa</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {carreras.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono hidden lg:table-cell">{c.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.color && (
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-sm">{c.nombre}</span>
                          {c.descripcion && (
                            <span className="text-xs text-gray-400 truncate max-w-xs hidden md:inline">{c.descripcion}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {c.modalidad ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${MODALIDAD_STYLES[c.modalidad] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {MODALIDAD_LABELS[c.modalidad] || c.modalidad}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {c.duracion ? `${c.duracion} años` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        c.activa
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {c.activa ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
