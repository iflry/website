import { cn } from '@/src/lib/utils'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Link } from '@/src/i18n/navigation'

export function FooterCategory({ title, children, ...props }: { title: ReactNode } & ComponentProps<'div'>) {
  return (
    <div {...props}>
      <h3 className="font-medium">{title}</h3>
      <ul role="list" className="mt-2 flex flex-col gap-2">
        {children}
      </ul>
    </div>
  )
}

export function FooterLink({ href, className, ...props }: { href: string } & Omit<ComponentProps<typeof Link>, 'href'>) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')
  
  if (isExternal) {
    return (
      <li className={cn('text-gray-600', className)}>
        <a href={href} {...props} />
      </li>
    )
  }
  
  return (
    <li className={cn('text-gray-600', className)}>
      <Link href={href} {...props} />
    </li>
  )
}

export function FooterWithLinkCategories({
  links,
  fineprint,
  className,
  ...props
}: {
  links: ReactNode
  fineprint: ReactNode
} & ComponentProps<'footer'>) {
  return (
    <footer className={cn('pt-16', className)} {...props}>
      <div className="bg-gray-950/2.5 py-16 text-gray-900">
        <Container className="flex flex-col gap-16">
          <nav className="grid grid-cols-2 gap-6 text-sm/7 sm:has-[>:last-child:nth-child(3)]:grid-cols-3 sm:has-[>:nth-child(5)]:grid-cols-3 md:has-[>:last-child:nth-child(4)]:grid-cols-4 lg:has-[>:nth-child(5)]:grid-cols-5">
            {links}
          </nav>
          <div className="text-sm/7 text-gray-500">{fineprint}</div>
        </Container>
      </div>
    </footer>
  )
}
