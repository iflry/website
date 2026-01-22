import { cn } from '@/src/lib/utils'
import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@/src/components/ui/button'

export function EmailSignupForm({
  label = 'Email address',
  placeholder = 'Enter your email',
  cta,
  variant = 'normal',
  className,
  ...props
}: {
  label?: string
  placeholder?: string
  cta: ReactNode
  variant?: 'normal' | 'overlay'
} & ComponentProps<'form'>) {
  return (
    <form
      className={cn(
        'flex rounded-full p-1 inset-ring-1',
        variant === 'normal' && 'bg-white inset-ring-black/10',
        variant === 'overlay' && 'bg-white/15 inset-ring-white/10',
        className,
      )}
      {...props}
    >
      <input
        className={cn(
          'min-w-0 flex-1 px-3 text-sm/7 focus:outline-hidden',
          variant === 'normal' && 'text-gray-900',
          variant === 'overlay' && 'text-white placeholder:text-white/60',
        )}
        type="email"
        aria-label={label}
        placeholder={placeholder}
      />
      <Button type="submit" variant={variant === 'overlay' ? 'secondary' : 'default'} className="rounded-full">
        {cta}
      </Button>
    </form>
  )
}
