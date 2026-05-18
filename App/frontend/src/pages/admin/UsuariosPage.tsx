import { DataTable, Column } from '../../components/ui/DataTable';
import { User } from '../../mocks/users.mock';
import { useUsuariosStore } from '../../stores/usuariosStore';
import { useEffect, useState } from 'react';
import UsuarioFormModal from '../../components/admin/UsuarioFormModal';
import UserAvatar from '../../components/ui/UserAvatar';

/**
 * UsuariosPage - Módulo 4: Gestión de Usuarios Admin
 * 
 * Cumple con la ley visual del wireframe/admin/dashboard.html (Sección Usuarios).
 * Utiliza React 19 y Tailwind 4.
 */
const UsuariosPage = () => {
  const { usuarios, isLoading, error, fetchUsuarios } = useUsuariosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<User | null>(null);

  useEffect(() => { fetchUsuarios(); }, []);

  const abrirModalCrear = () => {
    setUsuarioToEdit(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (user: User) => {
    setUsuarioToEdit(user);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setUsuarioToEdit(null);
  };

  // Definición de columnas alineada con el modelo de Backend y Wireframe
  const columns: Column<User>[] = [
    { 
      header: 'ID', 
      accessor: 'id',
      className: 'w-16 text-gray-400 font-mono hidden lg:table-cell'
    },
    {
      header: 'Usuario',
      accessor: (user) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            nombre={user.nombre}
            apellido={user.apellido}
            imagenUrl={user.avatar_url}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              {user.nombre} {user.apellido}
            </span>
            <span className="text-xs text-gray-400 lg:hidden">{user.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      className: 'hidden lg:table-cell text-sm'
    },
    {
      header: 'Rol',
      accessor: (user) => {
        const roleStyles = {
          admin: 'bg-red-50 text-red-600 border-red-100',
          profesor: 'bg-green-50 text-green-600 border-green-100',
          tutor: 'bg-amber-50 text-amber-600 border-amber-100',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${roleStyles[user.rol]}`}>
            {user.rol}
          </span>
        );
      },
    },
    {
      header: 'Estado',
      accessor: (user) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={`text-xs font-medium ${user.activo ? 'text-green-700' : 'text-gray-500'}`}>
            {user.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      ),
    },
    {
      header: 'Acciones',
      accessor: (user) => (
        <button
          onClick={() => abrirModalEditar(user)}
          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Editar
        </button>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header de la Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500">Administra los accesos y roles del personal del instituto.</p>
        </div>
        
        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2"
        >
          <span className="text-lg">+</span>
          <span>Nuevo Usuario</span>
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
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-2 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={usuarios}
            emptyMessage="No hay usuarios registrados en el sistema."
          />
        )}
      </div>

      <UsuarioFormModal
        isOpen={isModalOpen}
        onClose={cerrarModal}
        usuarioToEdit={usuarioToEdit}
      />
    </div>
  );
};

export default UsuariosPage;
