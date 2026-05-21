import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/src/components/portable-text";
import { knowledgeArticleSlugsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { routing } from "@/src/i18n/routing";
import { DocumentCentered } from "@/src/components/sections/document-centered";
import { KnowledgeSubpagesSection } from "@/src/components/knowledge-subpages-section";
import { KnowledgePrivateGate } from "@/src/components/knowledge-private-gate";
import { getKnowledgeArticleBySlug, getKnowledgeArticleChildren } from "@/src/lib/knowledge-data";
import {
  isKnowledgePrivatePasswordConfigured,
  readKnowledgePrivateUnlocked,
} from "@/src/lib/knowledge-private-auth";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const rows = await sanityFetch({
    query: knowledgeArticleSlugsQuery,
    perspective: "published",
    stega: false,
  });
  if (!rows?.length) return [];
  return routing.locales.flatMap((locale) =>
    rows
      .filter((row) => row.language === locale && row.slug)
      .map((row) => ({
        locale,
        slug: row.slug as string,
      })),
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getKnowledgeArticleBySlug(slug, locale);
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: article?.title,
    openGraph: {
      images: previousImages,
    },
  } satisfies Metadata;
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  const privateUnlocked = await readKnowledgePrivateUnlocked();
  const article = await getKnowledgeArticleBySlug(slug, locale);

  if (!article?._id) {
    return notFound();
  }

  const isPrivate = Boolean((article as { private?: boolean }).private);
  const passwordConfigured = isKnowledgePrivatePasswordConfigured();

  if (isPrivate && !privateUnlocked) {
    return (
      <DocumentCentered align="start" headline={article.title}>
        <KnowledgePrivateGate passwordConfigured={passwordConfigured} />
      </DocumentCentered>
    );
  }

  const subpages = await getKnowledgeArticleChildren(
    article._id,
    locale,
    privateUnlocked,
  );

  return (
    <>
      <DocumentCentered align="start" headline={article.title}>
        {article.content?.length ? (
          <PortableText value={article.content as PortableTextBlock[]} />
        ) : null}
      </DocumentCentered>
      <KnowledgeSubpagesSection pages={subpages} locale={locale} />
    </>
  );
}
