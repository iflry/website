import { cn } from '@/src/lib/utils'
import type { ComponentProps } from 'react'

export function Main({ children, className, ...props }: ComponentProps<'main'>) {
  return (
    <main className={cn('isolate overflow-clip', className)} {...props}>
      {children}
    </main>
  )
}
