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

const logoSrc = await toDataUrl("logo-horizontal.svg", "image/svg+xml");
const portraitSrc = await toDataUrl("rahampery-contreras.jpg", "image/jpeg");
// Poppins (tipografía de marca, licencia OFL) para que el texto coincida con el sitio.
const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));
const [poppinsRegular, poppinsSemiBold] = await Promise.all([font("Poppins-Regular.ttf"), font("Poppins-SemiBold.ttf")]);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          fontFamily: "Poppins",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 40,
              padding: "0 64px",
              width: 790,
              background: "linear-gradient(180deg, #F3F8FC 0%, #FFFFFF 100%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={580} height={120} alt="" />
            <div style={{ display: "flex", fontSize: 52, lineHeight: 1.15, color: "#0B4F74", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Tu dinero, protegido y creciendo.
            </div>
            <div style={{ display: "flex", fontSize: 23, color: "#4F5F6B" }}>
              Coach financiero en Zapopan · En línea a todo México
            </div>
          </div>
          <div style={{ display: "flex", width: 410, overflow: "hidden", background: "#0B4F74" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portraitSrc} width={410} height={729} alt="" style={{ objectFit: "cover", objectPosition: "top" }} />
          </div>
        </div>
        {/* Franja de color de la portada del Manual de Identidad. */}
        <div style={{ display: "flex", height: 16 }}>
          <div style={{ flex: 1, background: "#0370A4" }} />
          <div style={{ flex: 1, background: "#54B160" }} />
          <div style={{ flex: 1, background: "#F18526" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: poppinsRegular, weight: 400, style: "normal" },
        { name: "Poppins", data: poppinsSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
