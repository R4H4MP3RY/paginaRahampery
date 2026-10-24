import "server-only";
import sanitizeHtml from "sanitize-html";
import { site } from "@/lib/site";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host : null;

// Lista blanca estricta para el HTML de los artículos. Se aplica al guardar y otra vez
// al mostrar: si alguien escribiera content_html directo en la base de datos (SQL Editor,
// secret key), el sitio público seguiría sin ejecutar scripts.
export function sanitizePostHtml(html: string) {
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
