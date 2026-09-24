import Image from "next/image";
import { cn } from "@/lib/utils";
import logoColor from "../../public/brand/logo-horizontal.svg";
import logoNegativo from "../../public/brand/logo-horizontal-negativo.svg";
import isotipoColor from "../../public/brand/isotipo.svg";
import isotipoNegativo from "../../public/brand/isotipo-negativo.svg";

// Imagotipo horizontal (versión principal para web según el Manual de Identidad).
// Color sobre fondos claros y negativo sobre fondos oscuros; mínimo 140 px de ancho.
export function Logo({
  className,
  priority,
  tone = "auto",
}: {
  className?: string;
  priority?: boolean;
  // "auto": sigue el tema; "negativo": siempre blanco (p. ej. sobre el bloque azul).
  tone?: "auto" | "negativo";
}) {
  const alt = "Rahampery Contreras · Coach Financiero";
  if (tone === "negativo") {
    return <Image src={logoNegativo} alt={alt} priority={priority} className={cn("h-11 w-auto", className)} />;
  }
  return (
    <>
      <Image src={logoColor} alt={alt} priority={priority} className={cn("h-11 w-auto dark:hidden", className)} />
      {/* Sin priority: solo se precarga la versión que se ve por defecto. */}
      <Image
        src={logoNegativo}
        alt={alt}
        className={cn("hidden h-11 w-auto dark:block", className)}
      />
    </>
  );
}

// Isotipo (escudo RC) para espacios pequeños, en color o negativo según el tema.
export function Isotipo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image src={isotipoColor} alt="" priority={priority} className={cn("h-10 w-auto dark:hidden", className)} />
      <Image src={isotipoNegativo} alt="" className={cn("hidden h-10 w-auto dark:block", className)} />
    </>
  );
}
