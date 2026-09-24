import "server-only";
import { generateHTML } from "@tiptap/html/server";
import type { JSONContent } from "@tiptap/react";
import sanitizeHtml from "sanitize-html";
import { editorExtensions } from "@/lib/editor/extensions";
import { site } from "@/lib/site";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host : null;

// Convierte el contenido del editor en HTML y lo limpia con una lista blanca estricta.
// Aunque solo escriben administradores, esto evita inyectar scripts en el sitio.
export function renderPostHtml(doc: JSONContent) {
  const html = generateHTML(doc, editorExtensions);
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "br", "img"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "loading", "decoding"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    // Solo imágenes subidas a nuestro Storage.
    exclusiveFilter: (frame) =>
      frame.tag === "img" && (!supabaseHost || !frame.attribs.src?.startsWith(`https://${supabaseHost}/storage/v1/object/public/blog/`)),
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const internal = href.startsWith("/") || href.startsWith(site.url);
        const attrs: sanitizeHtml.Attributes = internal ? { href } : { href, target: "_blank", rel: "noopener noreferrer" };
        return { tagName, attribs: attrs };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    },
  });
}
