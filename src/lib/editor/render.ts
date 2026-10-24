import "server-only";
import { generateHTML } from "@tiptap/html/server";
import type { JSONContent } from "@tiptap/react";
import { editorExtensions } from "@/lib/editor/extensions";
import { sanitizePostHtml } from "@/lib/editor/sanitize";

// Convierte el contenido del editor en HTML y lo limpia con una lista blanca estricta.
// Aunque solo escriben administradores, esto evita inyectar scripts en el sitio.
export function renderPostHtml(doc: JSONContent) {
  return sanitizePostHtml(generateHTML(doc, editorExtensions));
}
