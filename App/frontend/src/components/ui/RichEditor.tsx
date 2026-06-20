import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { clsx } from 'clsx';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/* ------------------------------------------------------------------ */
/*  Componente de editor de texto enriquecido reutilizable            */
/* ------------------------------------------------------------------ */

const RichEditor = ({ value, onChange, placeholder = 'Escriba aqui...' }: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none text-gray-800 dark:text-slate-100',
      },
    },
  });

  /* Sincroniza el contenido cuando la prop value cambia externamente */
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  if (!editor) return null;

  /* ---------------------------------------------------------------- */
  /*  Toolbar: botones con texto simple, sin emojis                   */
  /* ---------------------------------------------------------------- */

  const BotonToolbar = ({
    onClick,
    activo,
    label,
    title,
  }: {
    onClick: () => void;
    activo: boolean;
    label: string;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={clsx(
        'px-2.5 py-1.5 text-xs font-bold rounded transition-colors',
        activo
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
        <BotonToolbar
          onClick={() => editor.chain().focus().toggleBold().run()}
          activo={editor.isActive('bold')}
          label="N"
          title="Negrita"
        />
        <BotonToolbar
          onClick={() => editor.chain().focus().toggleItalic().run()}
          activo={editor.isActive('italic')}
          label="C"
          title="Cursiva"
        />

        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1" />

        <BotonToolbar
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          activo={editor.isActive('heading', { level: 1 })}
          label="H1"
          title="Titulo principal"
        />
        <BotonToolbar
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          activo={editor.isActive('heading', { level: 2 })}
          label="H2"
          title="Subtitulo"
        />
        <BotonToolbar
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          activo={editor.isActive('heading', { level: 3 })}
          label="H3"
          title="Titulo terciario"
        />

        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1" />

        <BotonToolbar
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          activo={editor.isActive('bulletList')}
          label="Lista"
          title="Lista con viñetas"
        />
        <BotonToolbar
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          activo={editor.isActive('orderedList')}
          label="Num."
          title="Lista numerada"
        />

        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1" />

        <BotonToolbar
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          activo={editor.isActive('blockquote')}
          label="Cite"
          title="Cita"
        />
        <BotonToolbar
          onClick={() => {
            const url = window.prompt('Ingrese la URL del enlace:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          activo={editor.isActive('link')}
          label="Link"
          title="Insertar enlace"
        />

        <span className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1" />

        <BotonToolbar
          onClick={() => editor.chain().focus().undo().run()}
          activo={false}
          label="Desh"
          title="Deshacer"
        />
        <BotonToolbar
          onClick={() => editor.chain().focus().redo().run()}
          activo={false}
          label="Reh"
          title="Rehacer"
        />
      </div>

      {/* Cuerpo del editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichEditor;
