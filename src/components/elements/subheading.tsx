import { cn } from '@/src/lib/utils'
import { type ComponentProps } from 'react'

export function Subheading({ children, className, as: Tag = 'h2', ...props }: { as?: 'h1' | 'h2' } & ComponentProps<'h2'>) {
  return (
    <Tag
      className={cn(
        'font-display text-3xl/9 font-medium tracking-[-0.03em] text-pretty text-gray-900 sm:text-[2.5rem]/10',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
