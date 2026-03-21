import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, donationItemsQuery } from "@/sanity/lib/queries";
import PortableText from "@/src/components/portable-text";
import { PortableTextBlock } from "next-sanity";
import { Image } from "next-sanity/image";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Document } from "@/src/components/elements/document";

export default async function DonationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [page, items] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "donation", language: locale } }),
    sanityFetch({ query: donationItemsQuery }),
  ]);

  return (
    <Main>
      <Section
        headline={page?.title || "Donation"}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <div
              key={item._id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
            >
              {item.imageUrl && (
                <div className="aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="size-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-col gap-1">
                  {item.programme?.name && (
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {item.programme.name}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
                <div className="mt-auto flex flex-col gap-3 pt-2">
                  {item.amount && (
                    <p className="text-2xl font-bold text-gray-900">€{item.amount}</p>
                  )}
                  {item.oneOffLink && (
                    <a
                      href={item.oneOffLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Donate once
                    </a>
                  )}
                  {item.recurringLink && (
                    <a
                      href={item.recurringLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-gray-900 ring-1 ring-gray-900/20 hover:bg-gray-50"
                    >
                      Donate monthly
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Main>
  );
}
