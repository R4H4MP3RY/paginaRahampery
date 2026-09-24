"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type JSONContent } from "@tiptap/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
  Heading02Icon,
  Heading03Icon,
  Image01Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  Link01Icon,
  QuoteDownIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { editorExtensions } from "@/lib/editor/extensions";
import { uploadBlogImage } from "@/lib/upload-image";

const emptyDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

// Editor visual. El contenido viaja al servidor como JSON en un campo oculto.
export function RichTextEditor({ name, initialContent }: { name: string; initialContent?: JSONContent }) {
  const [json, setJson] = useState(() => JSON.stringify(initialContent ?? emptyDoc));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent ?? emptyDoc,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-rc max-w-none min-h-96 px-5 py-4 focus:outline-none",
        "aria-label": "Contenido del artículo",
      },
    },
    onUpdate: ({ editor }) => setJson(JSON.stringify(editor.getJSON())),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
          }
        : null,
  });

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Dirección del enlace (déjalo vacío para quitarlo)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:|\/)/i.test(url.trim())) {
      window.alert("El enlace debe empezar con https://, mailto: o /");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  async function onImageSelected(file: File | undefined) {
    if (!editor || !file) return;
    setUploading(true);
    try {
      const { url } = await uploadBlogImage(file);
      const alt = window.prompt("Describe la imagen (texto alternativo para accesibilidad y SEO)") ?? "";
      editor.chain().focus().setImage({ src: url, alt }).run();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border bg-rc-elevated">
      <input type="hidden" name={name} value={json} />
      <div role="toolbar" aria-label="Formato" className="flex flex-wrap gap-0.5 border-b p-1.5">
        <ToolButton label="Título" icon={Heading02Icon} active={active?.h2} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolButton label="Subtítulo" icon={Heading03Icon} active={active?.h3} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
        <Divider />
        <ToolButton label="Negritas" icon={TextBoldIcon} active={active?.bold} onClick={() => editor?.chain().focus().toggleBold().run()} />
        <ToolButton label="Cursiva" icon={TextItalicIcon} active={active?.italic} onClick={() => editor?.chain().focus().toggleItalic().run()} />
        <ToolButton label="Subrayado" icon={TextUnderlineIcon} active={active?.underline} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
        <Divider />
        <ToolButton label="Lista" icon={LeftToRightListBulletIcon} active={active?.bullet} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
        <ToolButton label="Lista numerada" icon={LeftToRightListNumberIcon} active={active?.ordered} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
        <ToolButton label="Cita" icon={QuoteDownIcon} active={active?.quote} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
        <Divider />
        <ToolButton label="Enlace" icon={Link01Icon} active={active?.link} onClick={setLink} />
        <ToolButton
          label={uploading ? "Subiendo imagen…" : "Imagen"}
          icon={Image01Icon}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => onImageSelected(e.target.files?.[0])}
        />
        <Divider />
        <ToolButton label="Deshacer" icon={ArrowTurnBackwardIcon} onClick={() => editor?.chain().focus().undo().run()} />
        <ToolButton label="Rehacer" icon={ArrowTurnForwardIcon} onClick={() => editor?.chain().focus().redo().run()} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolButton({
  label,
  icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: IconSvgElement;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-md transition-colors disabled:opacity-50 ${
        active ? "bg-rc-primary text-rc-on-primary" : "hover:bg-muted"
      }`}
    >
      <HugeiconsIcon icon={icon} size={18} />
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="bg-border mx-1 my-1.5 w-px" />;
}
