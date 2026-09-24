import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { site } from "@/lib/site";

// Imagen que aparece al compartir el sitio en WhatsApp, Facebook, LinkedIn, etc.
export const alt = `${site.name} · Coach Financiero`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const toDataUrl = async (file: string, mime: string) =>
  `data:${mime};base64,${await readFile(join(process.cwd(), "public/brand", file), "base64")}`;

const logoSrc = await toDataUrl("logo.png", "image/png");
const portraitSrc = await toDataUrl("rahampery-contreras.jpg", "image/jpeg");

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 36,
            padding: "0 64px",
            width: 780,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={560} height={283} alt="" />
          <div style={{ display: "flex", fontSize: 40, lineHeight: 1.25, color: "#0f2336", fontWeight: 600 }}>
            Aprovecha, protege y haz crecer tu dinero para cumplir tus metas.
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#0370a4" }}>
            Zapopan, Jalisco · En línea a todo México
          </div>
        </div>
        <div style={{ display: "flex", width: 420, height: "100%", background: "#0e2640", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitSrc} width={420} height={747} alt="" style={{ objectFit: "cover", objectPosition: "top" }} />
        </div>
      </div>
    ),
    size,
  );
}
