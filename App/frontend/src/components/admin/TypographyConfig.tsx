import { useSiteConfigStore } from '../../stores/siteConfigStore';

const HEADING_FONTS = ['Inter', 'Poppins', 'Roboto Slab', 'Playfair Display', 'Montserrat'];
const BODY_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Nunito'];
const BASE_SIZES = ['14px', '15px', '16px', '17px', '18px'];

const TypographyConfig = () => {
  const { config, updateTypography } = useSiteConfigStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Fuente de titulos */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Fuente de Titulos</label>
        <select
          value={config.typography.headingFont}
          onChange={(e) => updateTypography({ headingFont: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
        >
          {HEADING_FONTS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400" style={{ fontFamily: config.typography.headingFont }}>
          Vista previa: Titulo de ejemplo
        </p>
      </div>

      {/* Fuente de texto */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Fuente de Texto</label>
        <select
          value={config.typography.bodyFont}
          onChange={(e) => updateTypography({ bodyFont: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
        >
          {BODY_FONTS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400" style={{ fontFamily: config.typography.bodyFont }}>
          Vista previa: Texto de cuerpo para el sitio.
        </p>
      </div>

      {/* Tamano base */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Tamano Base</label>
        <select
          value={config.typography.baseSize}
          onChange={(e) => updateTypography({ baseSize: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
        >
          {BASE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400" style={{ fontSize: config.typography.baseSize }}>
          Vista previa con tamano base {config.typography.baseSize}
        </p>
      </div>
    </div>
  );
};

export default TypographyConfig;
