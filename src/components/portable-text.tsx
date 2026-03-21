/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { Link } from "@/src/i18n/navigation";

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href = value?.href || '';
        const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');
        
        if (isExternal) {
          return (
            <a href={href} rel="noreferrer noopener" target="_blank" className="break-all">
              {children}
            </a>
          );
        }

        return (
          <Link href={href} className="break-all">
            {children}
          </Link>
        );
      },
    },
  };

  return (
    <div className={["prose max-w-none break-words [&_pre]:overflow-x-auto [&_table]:overflow-x-auto [&_img]:max-w-full [&_iframe]:max-w-full", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
