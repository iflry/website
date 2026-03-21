import { cn } from '@/src/lib/utils'
import type { ComponentProps } from 'react'

export function Logo({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('relative h-12 w-full', className)} {...props} />
}

export function LogoGrid({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full grid-cols-2 place-items-center gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:mx-auto lg:inline-grid lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-1 lg:gap-12',
        className,
      )}
      {...props}
    />
  )
}
