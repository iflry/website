import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { Image } from "next-sanity/image";
import { pageTypeQuery, partnersQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Document } from "@/src/components/elements/document";


export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, partners] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "partners", language: locale } }),
    sanityFetch({ query: partnersQuery }),
  ]);

  return (
    <Main>
      <Section
        headline={page?.title}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {partners?.map((partner) => (
            <div className="flex items-center justify-center p-8 bg-white ring-1 ring-black/5 rounded-3xl" key={partner._id}>
              <Image className="max-h-16 w-full object-contain" src={partner.logo || ""} alt={partner.title} width={200} height={200} />
            </div>
          ))}
        </div>
      </Section>
    </Main>
  );
}
