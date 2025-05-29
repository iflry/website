import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, programmesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";


export default async function ProgrammesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations()
  const [page, programmes] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "programmes", language: locale } }),
    sanityFetch({ query: programmesQuery }),
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
        {programmes?.map((programme) => (
          <div key={programme._id}>
            {programme.title}
          </div>
        ))}
      </div>
    </div>
  );
}
