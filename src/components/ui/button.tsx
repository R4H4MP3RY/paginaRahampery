import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Botones píldora de rc-brand.css (sección 4).
const buttonCva = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-transparent font-semibold tracking-[0.01em] whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-rc select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        // Acción principal (azul protección).
        default: "bg-rc-primary text-rc-on-primary hover:bg-rc-primary-hover",
        // CTA secundario: agendar (naranja energía, texto oscuro por contraste).
        accent: "bg-rc-accent text-rc-on-accent hover:bg-rc-accent-hover",
        outline: "border-rc-primary bg-transparent text-rc-primary hover:bg-rc-info-soft",
        ghost: "bg-transparent text-rc-primary hover:bg-rc-info-soft",
        secondary: "bg-rc-surface text-rc-heading hover:bg-rc-surface-2",
        destructive: "bg-rc-danger-soft text-rc-danger hover:bg-rc-danger hover:text-white",
        link: "text-rc-primary underline-offset-4 hover:underline",
        // Sobre el bloque azul de CTA.
        inverse: "bg-white text-rc-brand-navy hover:bg-white/90",
        "outline-inverse": "border-white/60 text-white hover:bg-white/10",
      },
      size: {
        default: "min-h-12 px-6 text-rc-sm",
        sm: "min-h-[38px] px-4 text-rc-xs [&_svg:not([class*='size-'])]:size-4",
        lg: "min-h-12 px-6 text-rc-sm",
        xl: "min-h-14 px-8 text-rc-md",
        icon: "size-10",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12",
      },
    },
    // Van después del tamaño, así que ganan: ghost usa 12 px de relleno y link no tiene caja.
    compoundVariants: [
      { variant: "ghost", class: "px-3" },
      { variant: "link", class: "min-h-0 px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Siempre pasa por cn: así, al usarlo en <a> o <Link>, las clases en conflicto
// (p. ej. border-transparent vs border-rc-primary) se resuelven igual que en <Button>.
function buttonVariants(props?: Parameters<typeof buttonCva>[0]) {
  return cn(buttonCva(props))
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonCva>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }
