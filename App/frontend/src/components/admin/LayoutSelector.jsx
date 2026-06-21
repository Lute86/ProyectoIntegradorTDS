import { useSiteConfigStore } from '../../stores/siteConfigStore';
import { clsx } from 'clsx';

const LAYOUTS = [
{
  id: 'full-width',
  nombre: 'Ancho Completo',
  descripcion: 'El contenido ocupa todo el ancho disponible.'
},
{
  id: 'boxed',
  nombre: 'Centrado',
  descripcion: 'El contenido se centra con margenes laterales.'
}];

const LayoutSelector = () => {
  const { config, updateConfig } = useSiteConfigStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
      {LAYOUTS.map((layout) => {
        const activo = config.layout === layout.id;
        return (
          <button
            key={layout.id}
            type="button"
            onClick={() => updateConfig({ layout: layout.id })}
            className={clsx(
              'text-left p-3 lg:p-4 rounded-xl border-2 transition-all',
              activo ?
              'border-blue-500 bg-blue-50 dark:bg-blue-900/40 dark:border-blue-400 shadow-md' :
              'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 hover:shadow-sm'
            )}>

            <div className={clsx(
              'flex border border-gray-300 dark:border-slate-600 rounded-lg p-1.5 mb-2 justify-center'
            )}>
              <div className={clsx(
                'h-8 bg-blue-200 rounded',
                layout.id === 'full-width' ? 'w-full' : 'w-3/4'
              )} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">{layout.nombre}</h3>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">{layout.descripcion}</p>
          </button>);

      })}
    </div>);

};

export default LayoutSelector;
