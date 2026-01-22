import { cn } from '@/src/lib/utils'
import type { ComponentProps, ReactNode } from 'react'
import { ChevronIcon } from '../icons/chevron-icon'

export function AnnouncementBadge({
  text,
  href,
  cta = 'Learn more',
  variant = 'normal',
  className,
  ...props
}: {
  text: ReactNode
  href: string
  cta?: ReactNode
  variant?: 'normal' | 'overlay'
} & Omit<ComponentProps<'a'>, 'href' | 'children'>) {
  return (
    <a
      href={href}
      {...props}
      data-variant={variant}
      className={cn(
        'group relative inline-flex max-w-full gap-x-3 overflow-hidden rounded-md px-3.5 py-2 text-sm/6 max-sm:flex-col sm:items-center sm:rounded-full sm:px-3 sm:py-0.5',
        variant === 'normal' &&
          'bg-gray-950/5 text-gray-900 hover:bg-gray-950/10 inset-ring-1',
        variant === 'overlay' &&
          'bg-gray-950/15 text-white hover:bg-gray-950/20',
        className,
      )}
    >
      <span className="text-pretty sm:truncate">{text}</span>
      <span
        className={cn(
          'h-3 w-px max-sm:hidden',
          variant === 'normal' && 'bg-gray-950/20',
          variant === 'overlay' && 'bg-white/20',
        )}
      />
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-2 font-semibold',
          variant === 'normal' && 'text-gray-900',
        )}
      >
        {cta} <ChevronIcon className="shrink-0" />
      </span>
    </a>
  )
}
