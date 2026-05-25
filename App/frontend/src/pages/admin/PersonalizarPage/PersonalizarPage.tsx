import { useSiteConfigStore } from '../../../stores/siteConfigStore';
import ColorPicker from '../../../components/ui/ColorPicker';
import ThemePresets from '../../../components/admin/ThemePresets';
import TypographyConfig from '../../../components/admin/TypographyConfig';
import LayoutSelector from '../../../components/admin/LayoutSelector';
import SectionManager from '../../../components/admin/SectionManager';
import PreviewPanel from '../../../components/admin/PreviewPanel';

const COLOR_LABELS: Record<string, string> = {
  primary: 'Color Principal',
  secondary: 'Color Secundario',
  accent: 'Color de Acento',
  background: 'Fondo',
  text: 'Texto',
};

const PersonalizarPage = () => {
  const { config, updateColors } = useSiteConfigStore();

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header de la pagina */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Personalizar Sitio</h1>
        <p className="text-sm text-gray-500 mt-1">Personaliza la apariencia visual del sitio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: configuracion */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seccion: Temas predefinidos */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Temas Predefinidos</h2>
              <p className="text-xs text-gray-500">Seleccione un tema para cambiar toda la paleta de colores de una vez.</p>
            </div>
            <ThemePresets />
          </section>

          {/* Seccion: Tipografia */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Tipografia</h2>
              <p className="text-xs text-gray-500">Configure las fuentes y el tamano base del sitio.</p>
            </div>
            <TypographyConfig />
          </section>

          {/* Seccion: Layout */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Layout</h2>
              <p className="text-xs text-gray-500">Seleccione la disposicion del contenido.</p>
            </div>
            <LayoutSelector />
          </section>

          {/* Seccion: Orden de secciones */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Orden de Secciones</h2>
              <p className="text-xs text-gray-500">Arrastre las secciones para reordenarlas en la pagina principal.</p>
            </div>
            <SectionManager />
          </section>

          {/* Seccion: Colores personalizados */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Colores Personalizados</h2>
              <p className="text-xs text-gray-500">Ajuste cada color de forma individual.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(config.colors).map(([key, value]) => (
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

        {/* Columna derecha: vista previa en vivo */}
        <div className="lg:col-span-1">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default PersonalizarPage;
