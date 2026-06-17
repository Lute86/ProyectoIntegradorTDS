import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { useSiteConfigStore } from '../../stores/siteConfigStore';

interface DraggableSectionProps {
  id: string;
  nombre: string;
  visible: boolean;
  navVisible: boolean;
}

const DraggableSection = ({ id, nombre, visible, navVisible }: DraggableSectionProps) => {
  const { toggleSectionVisibility, toggleNavVisibility } = useSiteConfigStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx('flex items-center gap-3 px-4 py-3 bg-white rounded-lg border transition-shadow',
        isDragging ? 'border-blue-400 shadow-lg opacity-50 z-10' : 'border-gray-200 shadow-sm hover:shadow-md',
        !visible && 'opacity-60'
      )}
    >
      <button type="button" {...attributes} {...listeners}
        className="flex flex-col gap-0.5 p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded" title="Arrastrar">
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
      </button>

      <span className="text-sm font-medium text-gray-700 flex-1 capitalize">{nombre}</span>

      <div className="flex items-center gap-3">
        <label className="text-[10px] text-gray-400">Inicio</label>
        <button type="button" onClick={() => toggleSectionVisibility(id)}
          className={clsx('relative w-9 h-4 rounded-full transition-colors', visible ? 'bg-green-500' : 'bg-gray-300')}
          title={visible ? 'Ocultar en inicio' : 'Mostrar en inicio'}>
          <span className={clsx('absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform', visible && 'translate-x-[18px]')} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-[10px] text-gray-400">Menu</label>
        <button type="button" onClick={() => toggleNavVisibility(id)}
          className={clsx('relative w-9 h-4 rounded-full transition-colors', navVisible ? 'bg-blue-500' : 'bg-gray-300')}
          title={navVisible ? 'Ocultar en menu' : 'Mostrar en menu'}>
          <span className={clsx('absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform', navVisible && 'translate-x-[18px]')} />
        </button>
      </div>
    </div>
  );
};

export default DraggableSection;
