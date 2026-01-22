import { cn } from '@/src/lib/utils'
import type { ComponentProps } from 'react'

export function Text({ children, className, size = 'md', ...props }: ComponentProps<'div'> & { size?: 'md' | 'lg' }) {
  return (
    <div
      className={cn(
        size === 'md' && 'text-base/7',
        size === 'lg' && 'text-lg/8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
