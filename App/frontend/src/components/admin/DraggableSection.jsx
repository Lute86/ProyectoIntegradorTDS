import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { useSiteConfigStore } from '../../stores/siteConfigStore';

const DraggableSection = ({ id, nombre, visible }) => {
  const { toggleSectionVisibility } = useSiteConfigStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
    className={clsx('flex items-center md:items-center items-start gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border transition-shadow',
    isDragging ? 'border-blue-400 shadow-lg opacity-50 z-10' : 'border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md',
    !visible && 'opacity-60'
    )}>

      <button type="button" {...attributes} {...listeners}
      className="flex flex-col gap-0.5 p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-slate-700 rounded shrink-0" title="Arrastrar">
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
      </button>

      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-slate-200 capitalize">{nombre}</span>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => toggleSectionVisibility(id)}
          className={clsx('relative w-9 h-4 rounded-full transition-colors', visible ? 'bg-green-500' : 'bg-gray-300')}
          title={visible ? 'Ocultar en inicio' : 'Mostrar en inicio'}>
            <span className={clsx('absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform', visible && 'translate-x-[18px]')} />
          </button>
          <span className="text-[10px] text-gray-400 dark:text-slate-500">{visible ? 'Visible' : 'Oculto'}</span>
        </div>
      </div>
    </div>);

};

export default DraggableSection;
