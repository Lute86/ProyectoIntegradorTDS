import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsuariosStore } from '../../stores/usuariosStore';
import useCarrerasStore from '../../stores/carrerasStore';
import Modal from '../ui/Modal/Modal';

const comisionSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(20),
  carrera_id: z.preprocess(
    (val) => (val === '' || val == null) ? undefined : Number(val),
    z.number({ required_error: 'Selecciona una carrera' }).int().positive(),
  ),
  anio_lectivo: z.preprocess(
    (val) => Number(val),
    z.number().int().min(2020, 'Minimo 2020').max(2035, 'Maximo 2035'),
  ),
  semestre: z.preprocess(
    (val) => Number(val),
    z.number().refine((v) => v === 1 || v === 2, 'Semestre invalido'),
  ),
  encargado_id: z.preprocess(
    (val) => (val === '' || val == null) ? undefined : Number(val),
    z.number().int().positive().optional(),
  ),
  activa: z.boolean().default(true),
});

const ComisionFormModal = ({ isOpen, onClose, comisionToEdit }) => {
  const { usuarios, fetchUsuarios } = useUsuariosStore();
  const { carreras, fetchCarreras } = useCarrerasStore();
  const [errorMsg, setErrorMsg] = useState('');
  const esEdicion = comisionToEdit != null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(comisionSchema),
    defaultValues: {
      nombre: '',
      carrera_id: '',
      anio_lectivo: new Date().getFullYear(),
      semestre: 1,
      encargado_id: '',
      activa: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsuarios();
      fetchCarreras();
    }
  }, [isOpen, fetchUsuarios, fetchCarreras]);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    if (comisionToEdit) {
      reset({
        nombre: comisionToEdit.nombre || '',
        carrera_id: comisionToEdit.carrera_id || '',
        anio_lectivo: comisionToEdit.anio_lectivo || new Date().getFullYear(),
        semestre: comisionToEdit.semestre || 1,
        encargado_id: comisionToEdit.encargado_id || comisionToEdit.encargado?.id || '',
        activa: comisionToEdit.activa !== false,
      });
    } else {
      reset({
        nombre: '',
        carrera_id: '',
        anio_lectivo: new Date().getFullYear(),
        semestre: 1,
        encargado_id: '',
        activa: true,
      });
    }
  }, [isOpen, comisionToEdit, reset]);

  const onSubmit = async (data) => {
    setErrorMsg('');
    const payload = {
      nombre: data.nombre.toUpperCase().trim(),
      carrera_id: data.carrera_id,
      anio_lectivo: data.anio_lectivo,
      semestre: data.semestre,
      activa: data.activa,
    };
    if (data.encargado_id) payload.encargado_id = data.encargado_id;

    try {
      const { comisionesService } = await import('../../services/comisionesService');
      if (esEdicion) {
        await comisionesService.update(comisionToEdit.id, payload);
      } else {
        await comisionesService.create(payload);
      }
      onClose(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al guardar la comision.');
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => onClose(false)}
      title={esEdicion ? 'Editar Comision' : 'Nueva Comision'}
      size="sm"
      footer={
        <>
          <button onClick={() => onClose(false)}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >Cancelar</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >{isSubmitting ? 'Guardando...' : esEdicion ? 'Guardar' : 'Crear'}</button>
        </>
      }
    >
      {errorMsg && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
          <input {...register('nombre')}
            placeholder="Ej: A, B, 1, Mixta"
            maxLength={20}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.nombre && <p className="text-[10px] text-red-500 mt-0.5">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Carrera</label>
          <select {...register('carrera_id')}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.carrera_id ? 'border-red-400' : 'border-gray-300'}`}
          >
            <option value="">Seleccionar carrera...</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {errors.carrera_id && <p className="text-[10px] text-red-500 mt-0.5">{errors.carrera_id.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Anio lectivo</label>
            <input type="number" {...register('anio_lectivo')}
              min={2020} max={2035}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.anio_lectivo ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.anio_lectivo && <p className="text-[10px] text-red-500 mt-0.5">{errors.anio_lectivo.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Semestre</label>
            <select {...register('semestre')}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.semestre ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value={1}>Primer semestre</option>
              <option value={2}>Segundo semestre</option>
            </select>
            {errors.semestre && <p className="text-[10px] text-red-500 mt-0.5">{errors.semestre.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Tutor <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <select {...register('encargado_id')}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.encargado_id ? 'border-red-400' : 'border-gray-300'}`}
          >
            <option value="">Sin tutor</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.rol})</option>
            ))}
          </select>
          {errors.encargado_id && <p className="text-[10px] text-red-500 mt-0.5">{errors.encargado_id.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('activa')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700 font-medium">Comision activa</label>
        </div>
      </form>
    </Modal>
  );
};

export default ComisionFormModal;
