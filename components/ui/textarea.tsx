import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-obsidian shadow-sm transition-colors outline-none placeholder:text-muted-foreground/80 focus-visible:border-project_primary focus-visible:ring-2 focus-visible:ring-project_primary/20 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-brand-50 disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
