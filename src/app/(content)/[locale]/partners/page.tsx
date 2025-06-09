import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { Image } from "next-sanity/image";
import { pageTypeQuery, partnersQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";


export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, partners] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "partners", language: locale } }),
    sanityFetch({ query: partnersQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <div>
      <h1 className="mb-12 text-6xl font-bold md:text-7xl lg:text-8xl">
          {page?.title}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
            {partners?.map((partner) => (
              <div className="bg-gray-400/5 p-8 sm:p-10" key={partner._id}>
                <Image className="max-h-12 w-full object-contain" src={partner.logo || ""} alt={partner.title} width={150} height={150} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
