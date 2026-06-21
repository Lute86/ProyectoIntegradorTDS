import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../mocks/users.mock';
import { useUsuariosStore } from '../../stores/usuariosStore';

const passwordValidation = z
  .string()
  .refine((val) => !val || val.length >= 8, 'La contrasena debe tener al menos 8 caracteres')
  .refine((val) => !val || /[A-Z]/.test(val), 'Debe contener al menos una mayuscula')
  .refine((val) => !val || /[0-9]/.test(val), 'Debe contener al menos un numero')
  .optional();

const usuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingrese un email valido'),
  rol: z.enum(['admin', 'profesor', 'tutor'], { required_error: 'Seleccione un rol' }),
  password: passwordValidation,
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioToEdit: User | null;
}

const UsuarioFormModal = ({ isOpen, onClose, usuarioToEdit }: UsuarioFormModalProps) => {
  const { addUsuario, updateUsuario } = useUsuariosStore();
  const esEdicion = usuarioToEdit !== null;
  const [errorMsg, setErrorMsg] = useState('');
  const [cambiarPass, setCambiarPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { nombre: '', apellido: '', email: '', rol: undefined, password: '' },
  });

  useEffect(() => {
    if (usuarioToEdit) {
      reset({ nombre: usuarioToEdit.nombre, apellido: usuarioToEdit.apellido, email: usuarioToEdit.email, rol: usuarioToEdit.rol });
      setCambiarPass(false);
    } else {
      reset({ nombre: '', apellido: '', email: '', rol: undefined });
    }
  }, [usuarioToEdit, reset, isOpen]);

  const onSubmit = async (data: UsuarioFormData) => {
    setErrorMsg('');
    try {
      if (esEdicion && usuarioToEdit) {
        const { password, ...datosLimpios } = data;
        if (password) {
          await updateUsuario(usuarioToEdit.id, { ...datosLimpios, password });
        } else {
          await updateUsuario(usuarioToEdit.id, datosLimpios);
        }
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">{esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors">X</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[65vh] pr-1">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Nombre</label>
            <input {...register('nombre')} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ingrese el nombre" />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Apellido</label>
            <input {...register('apellido')} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ingrese el apellido" />
            {errors.apellido && <p className="text-xs text-red-500 mt-1">{errors.apellido.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Email</label>
            <input {...register('email')} type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="correo@ifts29.edu.ar" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Contrasena */}
          {!esEdicion ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Contrasena</label>
              <input {...register('password')} type="password" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Minimo 8 caracteres" />
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Minimo 8 caracteres, 1 mayuscula y 1 numero.</p>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
          ) : (
            <div>
              <button type="button" onClick={() => setCambiarPass(!cambiarPass)}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                {cambiarPass ? '- Cancelar cambio de contrasena' : '+ Cambiar contrasena'}
              </button>
              {cambiarPass && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Nueva Contrasena</label>
                  <input {...register('password')} type="password" className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Dejar en blanco para mantener" />
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Minimo 8 caracteres, 1 mayuscula y 1 numero. Deje vacio para mantener la actual.</p>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Rol</label>
            <select {...register('rol')} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white dark:bg-slate-700">
              <option value="">Seleccione un rol</option>
              <option value="admin">Admin</option>
              <option value="profesor">Profesor</option>
              <option value="tutor">Tutor</option>
            </select>
            {errors.rol && <p className="text-xs text-red-500 mt-1">{errors.rol.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm">
              {esEdicion ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioFormModal;
