import { cn } from '@/src/lib/utils'
import type { ComponentProps } from 'react'

export function Eyebrow({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('text-sm/7 font-semibold text-gray-600', className)} {...props}>
      {children}
    </div>
  )
}
