import { useSiteConfigStore } from '../../stores/siteConfigStore';

const SECTION_BLOCKS: Record<string, { alto: string; color: 'primary' | 'secondary' | 'accent'; label: string }> = {
  hero: { alto: 'h-20', color: 'primary', label: 'Hero' },
  carreras: { alto: 'h-14', color: 'secondary', label: 'Carreras' },
  noticias: { alto: 'h-16', color: 'accent', label: 'Noticias' },
  testimonios: { alto: 'h-12', color: 'secondary', label: 'Testimonios' },
  contacto: { alto: 'h-10', color: 'primary', label: 'Contacto' },
};

const PreviewPanel = () => {
  const { config } = useSiteConfigStore();
  const esBoxed = config.layout === 'boxed';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 sticky top-8">
      <div className="text-center pb-3 border-b border-gray-100">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Vista Previa</p>
      </div>

      <div
        className="rounded-lg border border-gray-200 overflow-hidden"
        style={{ fontFamily: config.typography.bodyFont }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-5 bg-white rounded text-[9px] text-gray-400 flex items-center px-2 border border-gray-200">
            www.ifts29.edu.ar
          </div>
        </div>

        <div
          className={esBoxed ? 'layout-boxed space-y-1.5 p-3' : 'space-y-1.5 p-3'}
          style={{ backgroundColor: config.colors.background }}
        >
          {config.sections
            .filter((s) => s.visible)
            .map((s) => {
              const block = SECTION_BLOCKS[s.id];
              if (!block) return null;

              const colorMap = {
                primary: config.colors.primary,
                secondary: config.colors.secondary,
                accent: config.colors.accent,
              };

              return (
                <div
                  key={s.id}
                  className={`${block.alto} rounded flex items-center justify-center text-white text-[10px] font-bold opacity-80`}
                  style={{
                    backgroundColor: colorMap[block.color],
                    fontFamily: config.typography.headingFont,
                  }}
                >
                  {block.label}
                </div>
              );
            })}

          <div
            className="h-6 rounded flex items-center justify-center text-[8px] mt-2"
            style={{ backgroundColor: config.colors.text, color: config.colors.background }}
          >
            Footer
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        Los cambios se reflejan automaticamente.
      </p>
    </div>
  );
};

export default PreviewPanel;
