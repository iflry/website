import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableText from "@/src/components/portable-text";

import {getTranslations} from 'next-intl/server';
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string, locale: string }>;
};

const pageSlugs = defineQuery(
  `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: pageSlugs,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await sanityFetch({
    query: pageQuery,
    params: { slug, language: locale },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: post?.title,
    openGraph: {
      images: previousImages,
    },
  } satisfies Metadata;
}

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations()
  const page = await sanityFetch({ query: pageQuery, params: { slug, language: locale } })

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {t("title")}
        </Link>
      </h2>
      <div>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {page.title}
        </h1>
        {page.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
    </div>
  );
}
