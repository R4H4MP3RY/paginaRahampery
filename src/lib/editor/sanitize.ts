import "server-only";
import sanitizeHtml from "sanitize-html";
import { site } from "@/lib/site";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host : null;
const siteOrigin = new URL(site.url).origin;
const BLOG_IMAGES_PATH = "/storage/v1/object/public/blog/";

// Se compara la URL ya interpretada, no el texto: "https://rahamperycontreras.mx.evil.com"
// o "https://rahamperycontreras.mx@evil.com" empiezan igual que el sitio pero llevan a otro.
function parseUrl(href: string) {
  try {
    return new URL(href);
  } catch {
    return null;
  }
}

function isInternalLink(href: string) {
  // Rutas propias ("/blog"), pero no "//otro-sitio" ni "/\otro-sitio", que el navegador trata como externas.
  if (href.startsWith("/")) return !href.startsWith("//") && !href.startsWith("/\\");
  return parseUrl(href)?.origin === siteOrigin;
}

function isOwnBlogImage(src: string | undefined) {
  const url = src ? parseUrl(src) : null;
  return (
    !!url &&
    !!supabaseHost &&
    url.protocol === "https:" &&
    url.host === supabaseHost &&
    url.pathname.startsWith(BLOG_IMAGES_PATH) &&
    !url.pathname.includes("..") &&
    !url.username &&
    !url.password
  );
}

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
    exclusiveFilter: (frame) => frame.tag === "img" && !isOwnBlogImage(frame.attribs.src),
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const attrs: sanitizeHtml.Attributes = isInternalLink(href)
          ? { href }
          : { href, target: "_blank", rel: "noopener noreferrer" };
        return { tagName, attribs: attrs };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    },
  });
}
