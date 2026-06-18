import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSiteConfigStore } from '../../stores/siteConfigStore';
import DraggableSection from './DraggableSection';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero / Portada',
  statistics: 'Estadisticas',
  careers: 'Carreras',
  news: 'Noticias',
  events: 'Eventos',
  testimonials: 'Testimonios',
  gallery: 'Galeria',
};

const SectionManager = () => {
  const { config, updateConfig } = useSiteConfigStore();
  const sections = config.sections;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordenado = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i + 1 }));
    console.log('[DEBUG DnD] Reordenado:', JSON.stringify(reordenado.map(s => ({ id: s.id, order: s.order }))));

    updateConfig({ sections: reordenado });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((s) => (
            <DraggableSection
              key={s.id} id={s.id} nombre={SECTION_LABELS[s.id] || s.id}
              visible={s.visible}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SectionManager;
