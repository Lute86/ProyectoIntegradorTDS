import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSiteConfigStore } from '../../stores/siteConfigStore';
import DraggableSection from './DraggableSection';

const EXCLUIDAS = ['students', 'contact'];

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
  const visibles = config.sections.filter((s) => !EXCLUIDAS.includes(s.id));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibles.findIndex((s) => s.id === active.id);
    const newIndex = visibles.findIndex((s) => s.id === over.id);
    const reordenado = arrayMove(visibles, oldIndex, newIndex);

    const otras = config.sections.filter((s) => EXCLUIDAS.includes(s.id));
    updateConfig({ sections: [...reordenado, ...otras] });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visibles.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {visibles.map((s) => (
            <DraggableSection
              key={s.id} id={s.id} nombre={SECTION_LABELS[s.id] || s.id}
              visible={s.visible} navVisible={s.navVisible ?? true}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SectionManager;
