import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-zinc-200 dark:border-zinc-800 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-zinc-100 dark:bg-zinc-900 flex field-sizing-content min-h-16 w-full rounded-sm border px-3 py-2 text-base shadow-none transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
