import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableText from "@/src/components/portable-text";

import {getTranslations} from 'next-intl/server';
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { routing } from "@/src/i18n/routing";
import { Main } from "@/src/components/elements/main";
import { DocumentCentered } from "@/src/components/sections/document-centered";

type Props = {
  params: Promise<{ slug: string, locale: string }>;
};

const pageSlugs = defineQuery(
  `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  const pages = await sanityFetch({
    query: pageSlugs,
    perspective: "published",
    stega: false,
  });
  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      locale,
      slug: page.slug,
    }))
  );
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
    <Main>
      <DocumentCentered headline={page.title}>
        {page.content?.length && (
          <PortableText
            value={page.content as PortableTextBlock[]}
          />
        )}
      </DocumentCentered>
    </Main>
  );
}
