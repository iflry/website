import { cn } from '@/src/lib/utils'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Document } from '../elements/document'
import { Heading } from '../elements/heading'
import { Text } from '../elements/text'

export function DocumentCentered({
  headline,
  subheadline,
  className,
  align = "center",
  children,
  ...props
}: {
  headline: ReactNode
  subheadline?: ReactNode
  align?: "center" | "start"
} & ComponentProps<'section'>) {
  const isStart = align === "start"
  return (
    <section className={cn('py-16', className)} {...props}>
      <Container className="flex flex-col gap-10 sm:gap-16">
        <div className={cn('flex flex-col gap-6', isStart ? 'items-start' : 'items-center')}>
          <Heading className={cn('max-w-5xl', isStart ? 'text-left' : 'text-center')}>{headline}</Heading>
          {subheadline && (
            <Text size="lg" className={cn('flex max-w-xl flex-col gap-4', isStart ? 'text-left' : 'text-center')}>
              {subheadline}
            </Text>
          )}
        </div>
        <Document className={cn('max-w-2xl min-w-0 overflow-x-auto p-2', isStart ? 'mx-0' : 'mx-auto')}>{children}</Document>
      </Container>
    </section>
  )
}
