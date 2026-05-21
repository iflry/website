import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Card } from "@/src/components/card";
import { Subheading } from "@/src/components/elements/subheading";
import { Text } from "@/src/components/elements/text";
import { Search } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ButtonGroup } from "@/src/components/ui/button-group";
import { Input } from "@/src/components/ui/input";
import {
  buildKnowledgeTree,
  excerptFromPlainText,
  getKnowledgeArticles,
  searchKnowledgeArticles,
} from "@/src/lib/knowledge-data";
import { readKnowledgePrivateUnlocked } from "@/src/lib/knowledge-private-auth";
import type { KnowledgeSearchHit, KnowledgeTreeNode } from "@/src/lib/knowledge-data";

async function RootTopicCards({
  roots,
  locale,
}: {
  roots: KnowledgeTreeNode[];
  locale: string;
}) {
  const t = await getTranslations("Knowledge");
  if (roots.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-2xl flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{t("getStartedHeading")}</h2>
        <p className="text-pretty text-sm text-gray-600">{t("getStartedIntro")}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roots.map((node) => {
          const excerpt = excerptFromPlainText(node.plain);
          return (
            <Card
              key={node._id}
              href={`/${locale}/knowledge/${node.slug}`}
              title={node.title}
              className="overflow-hidden rounded-xl"
              metadata={
                <p className="line-clamp-3 text-sm text-gray-600">
                  {excerpt || t("cardNoDescription")}
                </p>
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  const t = await getTranslations("Knowledge");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function KnowledgeHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations("Knowledge");
  const qTrim = typeof q === "string" ? q.trim() : "";
  const includePrivate = await readKnowledgePrivateUnlocked();
  const articles = await getKnowledgeArticles(locale, includePrivate);
  const tree = buildKnowledgeTree(articles);
  const searchResults: KnowledgeSearchHit[] | null = qTrim
    ? await searchKnowledgeArticles(locale, qTrim, includePrivate)
    : null;

  return (
    <section className="py-16">
      <div className="flex flex-col gap-8 text-left">
        <div className="flex max-w-3xl flex-col gap-3">
          <Subheading as="h1">{t("hubTitle")}</Subheading>
          <Text className="text-pretty text-gray-600">{t("intro")}</Text>
        </div>
        <form method="get" action={`/${locale}/knowledge`} className="w-full max-w-xl">
          <label htmlFor="knowledge-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <ButtonGroup className="w-full">
            <Input
              id="knowledge-search"
              name="q"
              type="search"
              defaultValue={qTrim}
              className="shadow-xs"
              placeholder={t("searchPlaceholder")}
            />
            <Button type="submit" variant="default" aria-label={t("search")}>
              <Search />
            </Button>
          </ButtonGroup>
        </form>

        {searchResults ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{t("searchResults")}</h2>
            {searchResults.length === 0 ? (
              <p className="text-gray-600">{t("noResults")}</p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                {searchResults.map((row) => (
                  <li key={row._id}>
                    <Link
                      href={`/${locale}/knowledge/${row.slug}`}
                      className="block px-5 py-4 text-left text-gray-900 hover:bg-gray-50"
                    >
                      <span className="font-medium">{row.title}</span>
                      {row.excerpt ? (
                        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{row.excerpt}</p>
                      ) : (
                        <p className="mt-2 text-sm italic text-gray-500">{t("searchNoExcerpt")}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : tree.length === 0 ? (
          <p className="text-gray-600">{t("emptyHub")}</p>
        ) : (
          <RootTopicCards roots={tree} locale={locale} />
        )}
      </div>
    </section>
  );
}
