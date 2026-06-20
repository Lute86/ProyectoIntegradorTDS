import { useState } from "react";
import { useSiteConfigStore } from "../../stores/siteConfigStore";
import { clsx } from "clsx";
import ColorPicker from "../ui/ColorPicker";

const COLOR_LABELS: Record<string, string> = {
  primary: "Color Principal",
  secondary: "Color Secundario",
  accent: "Color de Acento",
  surface: "Superficie",
  background: "Fondo",
  text: "Texto",
};

interface Tema {
  id: string;
  nombre: string;
  descripcion: string;
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    background: string;
    text: string;
  };
}

const TEMAS: Tema[] = [
  {
    id: "moderno",
    nombre: "Moderno",
    descripcion: "Azul y esmeralda, estilo corporativo",
    colores: { primary: "#2563eb", secondary: "#10b981", accent: "#f59e0b", surface: "#1e293b", background: "#ffffff", text: "#111827" },
  },
  {
    id: "clasico",
    nombre: "Clasico",
    descripcion: "Rojo y azul marino, estilo tradicional",
    colores: { primary: "#1e3a5f", secondary: "#dc2626", accent: "#d97706", surface: "#1e293b", background: "#f8fafc", text: "#1e293b" },
  },
  {
    id: "oscuro",
    nombre: "Oscuro",
    descripcion: "Fondo oscuro, ideal para portafolios",
    colores: { primary: "#6366f1", secondary: "#22d3ee", accent: "#fbbf24", surface: "#0f172a", background: "#0f172a", text: "#f1f5f9" },
  },
  {
    id: "vibrante",
    nombre: "Vibrante",
    descripcion: "Colores vivos y llamativos",
    colores: { primary: "#e11d48", secondary: "#8b5cf6", accent: "#06b6d4", surface: "#1e293b", background: "#fff7ed", text: "#1c1917" },
  },
];

const ThemePresets = () => {
  const { config, updateColors } = useSiteConfigStore();
  const [mostrarAjustes, setMostrarAjustes] = useState(false);

  return (
    <div className="space-y-6">
      {/* Lista de temas predefinidos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4">
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
                "text-left p-3 lg:p-4 rounded-xl border-2 transition-all",
                activo
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 hover:shadow-sm"
              )}
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-0.5">{tema.nombre}</h3>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 mb-2">{tema.descripcion}</p>
              <div className="flex h-4 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                {Object.values(tema.colores).map((color) => (
                  <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selectores de color individuales (acordeon) */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <button type="button" onClick={() => setMostrarAjustes(!mostrarAjustes)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:text-blue-600 transition-colors">
          <span className="text-lg font-mono">{mostrarAjustes ? '-' : '+'}</span>
          Ajuste fino de colores
        </button>
        {mostrarAjustes && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {Object.entries(config.colors)
              .filter(([key]) => key !== "card")
              .map(([key, value]) => (
                <ColorPicker
                  key={key}
                  label={COLOR_LABELS[key] || key}
                  value={value}
                  onChange={(color) => updateColors({ [key]: color })}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemePresets;
