import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

// Misma configuración para el editor (navegador) y para generar el HTML (servidor).
export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https", "mailto"],
    },
  }),
  Image,
];
