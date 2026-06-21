import { useState, useEffect } from 'react';
import { Consulta, useConsultasStore } from '../../stores/consultasStore';

interface ConsultaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consulta: Consulta | null;
}

const ConsultaDetailModal = ({ isOpen, onClose, consulta }: ConsultaDetailModalProps) => {
  const { responderConsulta } = useConsultasStore();
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    if (consulta?.respuesta) {
      setRespuesta(consulta.respuesta);
    } else {
      setRespuesta('');
    }
  }, [consulta]);

  const abrirCorreo = () => {
    if (!consulta || !respuesta.trim()) return;
    const asunto = encodeURIComponent(`RE: ${consulta.asunto}`);
    const cuerpo = encodeURIComponent(respuesta.trim());
    window.open(`mailto:${consulta.email}?subject=${asunto}&body=${cuerpo}`, '_blank');
  };

  const marcarFinalizado = async () => {
    if (!consulta) return;
    await responderConsulta(consulta.id, respuesta.trim() || 'Respondido via email directo');
    onClose();
  };

  if (!isOpen || !consulta) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Detalle de Consulta</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 hover:text-gray-600 flex items-center justify-center text-lg font-bold transition-colors">X</button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Nombre</p>
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{consulta.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Email</p>
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{consulta.email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Asunto</p>
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{consulta.asunto}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Fecha</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{new Date(consulta.createdAt).toLocaleString('es-AR')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Estado</p>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${consulta.respondido ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              {consulta.respondido ? 'Respondida' : 'Pendiente'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-2">Mensaje</p>
          <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 whitespace-pre-wrap break-words overflow-y-auto max-h-60">{consulta.mensaje}</div>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-2">
            {consulta.respondido ? 'Respuesta enviada' : 'Redactar respuesta'}
          </p>
          {consulta.respondido ? (
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 whitespace-pre-wrap break-words overflow-y-auto max-h-40">{consulta.respuesta || 'Sin respuesta registrada.'}</div>
          ) : (
            <textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="Escriba la respuesta aqui..." />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">Cerrar</button>
          {!consulta.respondido && (
            <>
              <button type="button" onClick={abrirCorreo} disabled={!respuesta.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition shadow-sm">
                1. Abrir en Correo
              </button>
              <button type="button" onClick={marcarFinalizado}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition shadow-sm">
                2. Marcar Finalizado
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultaDetailModal;
