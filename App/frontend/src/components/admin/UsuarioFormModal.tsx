import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../mocks/users.mock';
import { useUsuariosStore } from '../../stores/usuariosStore';

// Esquema de validacion con Zod
const usuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un email valido'),
  rol: z.enum(['admin', 'profesor', 'tutor'], {
    required_error: 'Seleccione un rol',
  }),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres').optional(),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioToEdit: User | null;
}

/**
 * UsuarioFormModal - Modal de creacion/edicion de usuarios.
 * Recibe un usuario para editar o null para crear uno nuevo.
 * Consume directamente el store de Zustand.
 */
const UsuarioFormModal = ({ isOpen, onClose, usuarioToEdit }: UsuarioFormModalProps) => {
  const { addUsuario, updateUsuario } = useUsuariosStore();
  const esEdicion = usuarioToEdit !== null;
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      rol: undefined,
      password: '',
    },
  });

  // Precarga los datos del usuario en modo edicion
  useEffect(() => {
    if (usuarioToEdit) {
      reset({
        nombre: usuarioToEdit.nombre,
        apellido: usuarioToEdit.apellido,
        email: usuarioToEdit.email,
        rol: usuarioToEdit.rol,
      });
    } else {
      reset({ nombre: '', apellido: '', email: '', rol: undefined });
    }
  }, [usuarioToEdit, reset]);

  const onSubmit = async (data: UsuarioFormData) => {
    setErrorMsg('');
    try {
      if (esEdicion && usuarioToEdit) {
        const { password, ...datosLimpios } = data;
        await updateUsuario(usuarioToEdit.id, datosLimpios);
      } else {
        await addUsuario({ ...data, activo: true } as any);
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al guardar el usuario';
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 6000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
        {/* Header del modal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[65vh] pr-1">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              {...register('nombre')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Ingrese el nombre"
            />
            {errors.nombre && (
              <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Campo: Apellido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
            <input
              {...register('apellido')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Ingrese el apellido"
            />
            {errors.apellido && (
              <p className="text-xs text-red-500 mt-1">{errors.apellido.message}</p>
            )}
          </div>

          {/* Campo: Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="correo@ifts29.edu.ar"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo: Contrasena (solo en creacion) */}
          {!esEdicion && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contrasena</label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Minimo 6 caracteres"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Campo: Rol (select) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
            <select
              {...register('rol')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Admin</option>
              <option value="profesor">Profesor</option>
              <option value="tutor">Tutor</option>
            </select>
            {errors.rol && (
              <p className="text-xs text-red-500 mt-1">{errors.rol.message}</p>
            )}
          </div>

          {/* Botones de accion */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              {esEdicion ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioFormModal;
