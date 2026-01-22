import { cn } from "@/src/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

interface CardProps extends ComponentProps<"div"> {
  href?: string;
  image?: ReactNode;
  badge?: ReactNode;
  title: ReactNode;
  titleAs?: "h2" | "h3";
  metadata?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function Card({
  href,
  image,
  badge,
  title,
  titleAs = "h3",
  metadata,
  footer,
  children,
  className,
  ...props
}: CardProps) {
  const TitleTag = titleAs;
  const content = (
    <div
      className={cn(
        "group relative flex flex-col bg-white ring-1 ring-black/5",
        href && "cursor-pointer",
        className
      )}
      {...props}
    >
      {image && (
        <div className="relative aspect-3/2 w-full overflow-hidden">
          {image}
          {badge && (
            <div className="absolute top-3 left-3">
              {badge}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {!image && badge && <div className="mb-2">{badge}</div>}
        <TitleTag className="mb-2 text-xl font-semibold line-clamp-2">
          {href ? (
            <Link href={href} className="text-gray-900 underline underline-offset-4 hover:no-underline">
              <span className="absolute inset-0" />
              {title}
            </Link>
          ) : (
            title
          )}
        </TitleTag>
        {metadata && <div className="mb-2">{metadata}</div>}
        {children}
        {footer && <div className="mt-auto">{footer}</div>}
      </div>
    </div>
  );

  return content;
}

interface CardImageProps {
  src?: string | null;
  alt?: string;
  placeholder?: ReactNode;
  className?: string;
}

export function CardImage({ src, alt, placeholder, className }: CardImageProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ""}
        className={cn("h-full w-full object-cover transition-transform group-hover:scale-105", className)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      {placeholder || (
        <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
}
