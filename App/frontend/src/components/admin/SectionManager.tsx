import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSiteConfigStore } from '../../stores/siteConfigStore';
import DraggableSection from './DraggableSection';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero / Portada',
  carreras: 'Carreras',
  noticias: 'Noticias',
  testimonios: 'Testimonios',
  contacto: 'Contacto',
};

const SectionManager = () => {
  const { config, updateConfig } = useSiteConfigStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = config.sections.findIndex((s) => s.id === active.id);
    const newIndex = config.sections.findIndex((s) => s.id === over.id);
    const reordenado = arrayMove(config.sections, oldIndex, newIndex);
    updateConfig({ sections: reordenado });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={config.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {config.sections.map((s) => (
            <DraggableSection
              key={s.id}
              id={s.id}
              nombre={SECTION_LABELS[s.id] || s.id}
              visible={s.visible}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SectionManager;
