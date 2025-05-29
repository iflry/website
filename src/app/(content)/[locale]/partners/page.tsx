import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { Image } from "next-sanity/image";
import { pageTypeQuery, partnersQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";


export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  const [page, partners] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "partners", language: locale } }),
    sanityFetch({ query: partnersQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {t("title")}
        </Link>
      </h2>
      <div>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {page?.title}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {partners?.map((partner) => (
          <div key={partner._id}>
            {partner.logo && <Image src={partner.logo} alt={partner.title} width={100} height={100} />}
            {partner.title}
          </div>
        ))}
      </div>
    </div>
  );
}
