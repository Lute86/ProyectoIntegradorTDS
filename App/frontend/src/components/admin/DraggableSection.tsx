import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { useSiteConfigStore } from '../../stores/siteConfigStore';

interface DraggableSectionProps {
  id: string;
  nombre: string;
  visible: boolean;
}

const DraggableSection = ({ id, nombre, visible }: DraggableSectionProps) => {
  const { toggleSectionVisibility } = useSiteConfigStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const estilo = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={estilo}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 bg-white rounded-lg border transition-shadow',
        isDragging
          ? 'border-blue-400 shadow-lg opacity-50 z-10'
          : 'border-gray-200 shadow-sm hover:shadow-md',
        !visible && 'opacity-60'
      )}
    >
      {/* Asa de arrastre: tres lineas horizontales */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex flex-col gap-0.5 p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
        title="Arrastrar para reordenar"
      >
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
        <span className="block w-4 h-0.5 bg-gray-300 rounded" />
      </button>

      {/* Nombre de la seccion */}
      <span className="text-sm font-medium text-gray-700 flex-1 capitalize">{nombre}</span>

      {/* Switch de visibilidad estilo iOS */}
      <button
        type="button"
        onClick={() => toggleSectionVisibility(id)}
        className={clsx(
          'relative w-10 h-5 rounded-full transition-colors',
          visible ? 'bg-green-500' : 'bg-gray-300'
        )}
        title={visible ? 'Desactivar seccion' : 'Activar seccion'}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
            visible && 'translate-x-5'
          )}
        />
      </button>
    </div>
  );
};

export default DraggableSection;
