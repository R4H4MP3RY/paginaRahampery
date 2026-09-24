import * as React from "react"
import { cn } from "@/lib/utils"
import { fieldBase } from "@/components/ui/input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "min-h-[120px] resize-y rounded-[24px] px-6 py-4", className)}
      {...props}
    />
  )
}

export { Textarea }
