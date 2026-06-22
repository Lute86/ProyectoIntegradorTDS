import { DataTable } from '../../components/ui/DataTable';

import { useUsuariosStore } from '../../stores/usuariosStore';
import { useEffect, useState } from 'react';
import UsuarioFormModal from '../../components/admin/UsuarioFormModal';
import UserAvatar from '../../components/ui/UserAvatar';
import { useAuth } from '../../contexts/AuthContext/AuthContext';

const UsuariosPage = () => {
  const { usuarios, isLoading, error, fetchUsuarios, deleteUsuario } = useUsuariosStore();
  const { user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {fetchUsuarios();}, []);

  const abrirModalCrear = () => {setUsuarioToEdit(null);setIsModalOpen(true);};
  const abrirModalEditar = (user) => {setUsuarioToEdit(user);setIsModalOpen(true);};
  const cerrarModal = () => {setIsModalOpen(false);setUsuarioToEdit(null);};

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || confirmText !== 'ELIMINAR') return;
    await deleteUsuario(deleteTarget.id);
    setDeleteTarget(null);
    setConfirmText('');
  };

  const esAdmin = currentUser?.rol === 'admin';

  const columns = [
  {
    header: 'Usuario',
    accessor: (user) =>
    <div className="flex items-center gap-3">
          <UserAvatar nombre={user.nombre} apellido={user.apellido} imagenUrl={user.avatar_url} size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 dark:text-slate-100 text-sm">{user.nombre} {user.apellido}</span>
            <span className="text-xs text-gray-400 dark:text-slate-500 lg:hidden">{user.email}</span>
          </div>
        </div>

  },
  { header: 'Email', accessor: 'email', className: 'hidden lg:table-cell text-sm' },
  {
    header: 'Rol',
    accessor: (user) => {
      const roleStyles = { admin: 'bg-red-50 text-red-600 border-red-100', profesor: 'bg-green-50 text-green-600 border-green-100', tutor: 'bg-amber-50 text-amber-600 border-amber-100' };
      return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${roleStyles[user.rol]}`}>{user.rol}</span>;
    }
  },
  {
    header: 'Estado',
    accessor: (user) =>
    <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={`text-xs font-medium ${user.activo ? 'text-green-700' : 'text-gray-500 dark:text-slate-400'}`}>{user.activo ? 'Activo' : 'Inactivo'}</span>
        </div>

  },
  {
    header: 'Acciones',
    accessor: (user) =>
    <div className="flex gap-2 justify-end whitespace-nowrap">
          <button onClick={() => abrirModalEditar(user)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Editar</button>
          {esAdmin &&
      <button onClick={() => setDeleteTarget(user)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Eliminar</button>
      }
        </div>,

    className: 'w-28 min-w-[7rem] text-right'
  }];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Gestion de Usuarios</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Administra los accesos y roles del personal del instituto.</p>
        </div>
        {esAdmin &&
        <button onClick={abrirModalCrear} className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 gap-2">
            <span className="text-lg">+</span><span>Nuevo Usuario</span>
          </button>
        }
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
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700/50 rounded w-1/3" />
                  <div className="h-2 bg-gray-100 dark:bg-slate-700/50 rounded w-1/4" />
                </div>
              </div>
          )}
          </div> :

        <DataTable searchable columns={columns} data={usuarios} emptyMessage="No hay usuarios registrados en el sistema." />
        }
      </div>

      <UsuarioFormModal isOpen={isModalOpen} onClose={cerrarModal} usuarioToEdit={usuarioToEdit} />

      {deleteTarget &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Eliminar Usuario</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Para eliminar a <strong>{deleteTarget.nombre} {deleteTarget.apellido}</strong>, escriba <strong>ELIMINAR</strong> en el campo de abajo.
            </p>
            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Escriba ELIMINAR" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => {setDeleteTarget(null);setConfirmText('');}}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">Cancelar</button>
              <button onClick={handleDeleteConfirm} disabled={confirmText !== 'ELIMINAR'}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded-lg transition shadow-sm">Confirmar Eliminacion</button>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default UsuariosPage;
