import { useSiteConfigStore } from '../../stores/siteConfigStore';
import { clsx } from 'clsx';

interface Tema {
  id: string;
  nombre: string;
  descripcion: string;
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

/* Paletas de colores predefinidas para cada tema */
const TEMAS: Tema[] = [
  {
    id: 'moderno',
    nombre: 'Moderno',
    descripcion: 'Azul y esmeralda, estilo corporativo',
    colores: { primary: '#2563eb', secondary: '#10b981', accent: '#f59e0b', background: '#ffffff', text: '#111827' },
  },
  {
    id: 'clasico',
    nombre: 'Clasico',
    descripcion: 'Rojo y azul marino, estilo tradicional',
    colores: { primary: '#1e3a5f', secondary: '#dc2626', accent: '#d97706', background: '#f8fafc', text: '#1e293b' },
  },
  {
    id: 'oscuro',
    nombre: 'Oscuro',
    descripcion: 'Fondo oscuro, ideal para portafolios',
    colores: { primary: '#6366f1', secondary: '#22d3ee', accent: '#fbbf24', background: '#0f172a', text: '#f1f5f9' },
  },
  {
    id: 'vibrante',
    nombre: 'Vibrante',
    descripcion: 'Colores vivos y llamativos',
    colores: { primary: '#e11d48', secondary: '#8b5cf6', accent: '#06b6d4', background: '#fff7ed', text: '#1c1917' },
  },
];

const ThemePresets = () => {
  const { config, updateColors } = useSiteConfigStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {TEMAS.map((tema) => {
        const activo = config.themePreset === tema.id;
        return (
          <button
            key={tema.id}
            type="button"
            onClick={() => {
              updateColors(tema.colores);
              useSiteConfigStore.getState().updateConfig({ themePreset: tema.id });
            }}
            className={clsx(
              'text-left p-4 rounded-xl border-2 transition-all',
              activo
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            )}
          >
            <h3 className="text-sm font-bold text-gray-900 mb-1">{tema.nombre}</h3>
            <p className="text-[10px] text-gray-500 mb-3">{tema.descripcion}</p>

            {/* Barra de colores del tema */}
            <div className="flex h-5 rounded-lg overflow-hidden border border-gray-200">
              {Object.values(tema.colores).map((color) => (
                <div key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>

            <p className="text-[10px] text-gray-400 mt-2 font-mono">
              {Object.values(tema.colores).join(' | ')}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ThemePresets;
