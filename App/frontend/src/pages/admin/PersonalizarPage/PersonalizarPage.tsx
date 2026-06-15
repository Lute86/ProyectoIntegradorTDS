import { useEffect, useState } from 'react';
import { useSiteConfigStore } from '../../../stores/siteConfigStore';
import ThemePresets from '../../../components/admin/ThemePresets';
import TypographyConfig from '../../../components/admin/TypographyConfig';
import LayoutSelector from '../../../components/admin/LayoutSelector';
import SectionManager from '../../../components/admin/SectionManager';
import PreviewPanel from '../../../components/admin/PreviewPanel';

const COLOR_LABELS: Record<string, string> = {
  primary: 'Color Principal',
  secondary: 'Color Secundario',
  accent: 'Color de Acento',
  surface: 'Superficie',
  background: 'Fondo',
  text: 'Texto',
};

const PersonalizarPage = () => {
  const { config, isLoading, isDirty, saveConfig } = useSiteConfigStore();
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleGuardar = async () => {
    setIsSaving(true);
    try {
      await saveConfig();
      setToast('Cambios guardados correctamente.');
    } catch {
      setToast('Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 animate-pulse space-y-6 h-[calc(100vh-64px)]">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-96 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-y-auto">
      {/* Header de la pagina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Personalizar Sitio</h1>
          <p className="text-sm text-gray-500 mt-1">Personaliza la apariencia visual del sitio.</p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && <span className="text-xs text-amber-600 font-medium">Hay cambios sin guardar</span>}
          <button
            onClick={handleGuardar}
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: configuracion */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Temas y Colores</h2>
              <p className="text-xs text-gray-500">Seleccione un tema o ajuste cada color de forma individual.</p>
            </div>
            <ThemePresets />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Tipografia</h2>
              <p className="text-xs text-gray-500">Configure las fuentes y el tamano base del sitio.</p>
            </div>
            <TypographyConfig />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Layout</h2>
              <p className="text-xs text-gray-500">Seleccione la disposicion del contenido.</p>
            </div>
            <LayoutSelector />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Orden de Secciones</h2>
              <p className="text-xs text-gray-500">Arrastre las secciones para reordenarlas en la pagina principal.</p>
            </div>
            <SectionManager />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Colores Personalizados</h2>
              <p className="text-xs text-gray-500">Ajuste cada color de forma individual.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(config.colors).filter(([key]) => key !== 'card').map(([key, value]) => (
                <ColorPicker
                  key={key}
                  label={COLOR_LABELS[key] || key}
                  value={value}
                  onChange={(color) => updateColors({ [key]: color })}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default PersonalizarPage;
