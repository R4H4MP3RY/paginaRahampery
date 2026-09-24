import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

// Campo píldora de rc-brand.css (sección 12).
const fieldBase =
  "w-full min-w-0 border-[1.5px] border-rc-line bg-rc-elevated text-rc-md text-rc-text transition-[border-color,box-shadow] duration-200 ease-rc outline-none placeholder:text-rc-muted placeholder:opacity-80 focus-visible:border-rc-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--rc-primary)_18%,transparent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rc-danger"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(fieldBase, "min-h-[50px] rounded-full px-6", className)}
      {...props}
    />
  )
}

export { Input, fieldBase }
