import { cn } from '@/src/lib/utils'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Link } from '@/src/i18n/navigation'

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

export function SocialLink({
  href,
  name,
  className,
  ...props
}: {
  href: string
  name: string
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <a
      href={href}
      target="_blank"
      aria-label={name}
      className={cn('text-gray-900 *:size-6', className)}
      {...props}
    />
  )
}

export function FooterWithLinksAndSocialIcons({
  links,
  socialLinks,
  fineprint,
  className,
  ...props
}: {
  links: ReactNode
  socialLinks?: ReactNode
  fineprint: ReactNode
} & ComponentProps<'footer'>) {
  return (
    <footer className={cn('pt-16', className)} {...props}>
      <div className="bg-gray-950/2.5 py-16 text-gray-900">
        <Container className="flex flex-col gap-10 text-center text-sm/7">
          <div className="flex flex-col gap-6">
            <nav>
              <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2">{links}</ul>
            </nav>
            {socialLinks && <div className="flex items-center justify-center gap-10">{socialLinks}</div>}
          </div>
          <div className="text-gray-500">{fineprint}</div>
        </Container>
      </div>
    </footer>
  )
}
