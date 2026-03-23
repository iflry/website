import Link from "next/link";
import { Container } from "./elements/container";
import { JsonLd } from "./json-ld";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  locale,
}: {
  items: BreadcrumbItem[];
  locale: string;
}) {
  const baseUrl = "https://new.iflry.org";

  const allItems = [{ label: "Home", href: `/${locale}` }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: allItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href && { item: `${baseUrl}${item.href}` }),
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="pt-6">
        <Container>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
            {allItems.map((item, index) => (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden="true" className="text-gray-300">/</span>
                )}
                {item.href && index < allItems.length - 1 ? (
                  <Link
                    href={item.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Container>
      </nav>
    </>
  );
}
