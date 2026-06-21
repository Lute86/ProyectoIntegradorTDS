import { useRef } from 'react';
import { clsx } from 'clsx';

const PRESET_COLORS = [
  '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#22c55e',
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">{label}</label>

      {/*Selector visual con preview y valor HEX */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={clsx(
            'w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-slate-600 shrink-0 shadow-sm',
            'hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer'
          )}
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-mono text-gray-600 dark:text-slate-400">{value}</span>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </div>

      {/*Paleta de colores predefinidos */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={clsx(
              'w-6 h-6 rounded-full border-2 transition-all',
              value === color
                ? 'border-gray-800 dark:border-slate-200 scale-110 ring-2 ring-blue-300'
                : 'border-gray-200 dark:border-slate-600 hover:scale-110'
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
