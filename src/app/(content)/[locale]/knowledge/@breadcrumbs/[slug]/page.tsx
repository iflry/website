import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/src/components/breadcrumbs";
import {
  ancestorsFromParentChain,
  getKnowledgeArticleBySlug,
  type KnowledgeParentChain,
} from "@/src/lib/knowledge-data";
export default async function KnowledgeArticleBreadcrumbs({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("Knowledge");
  const article = await getKnowledgeArticleBySlug(slug, locale);

  if (!article?._id) {
    return null;
  }

  const chain = article.parentChain as KnowledgeParentChain;
  const ancestorCrumbs = ancestorsFromParentChain(chain, locale);
  return (
    <Breadcrumbs
      locale={locale}
      items={[
        { label: t("hubTitle"), href: `/${locale}/knowledge` },
        ...ancestorCrumbs,
        { label: article.title as string },
      ]}
    />
  );
}
