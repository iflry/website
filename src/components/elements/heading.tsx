import { cn } from '@/src/lib/utils'
import type { ComponentProps } from 'react'

export function Heading({
  children,
  color = 'default',
  className,
  ...props
}: { color?: 'default' | 'light' } & ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'font-display text-5xl/12 text-balance sm:text-[4rem]/16',
        color === 'default' && 'text-gray-900',
        color === 'light' && 'text-white',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
