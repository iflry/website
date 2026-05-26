import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container } from "@/src/components/elements/container";
import { Main } from "@/src/components/elements/main";
import {
  KnowledgeSidebar,
  KnowledgeSidebarMobile,
} from "@/src/components/knowledge-sidebar";
import { buildKnowledgeTree, getKnowledgeArticlesForNavigation } from "@/src/lib/knowledge-data";
import { readKnowledgePrivateUnlocked } from "@/src/lib/knowledge-private-auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function KnowledgeLayout({
  children,
  breadcrumbs,
  params,
}: {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const privateUnlocked = await readKnowledgePrivateUnlocked();
  const articles = await getKnowledgeArticlesForNavigation(locale);
  const tree = buildKnowledgeTree(articles);
  const t = await getTranslations("Knowledge");

  return (
    <Main>
      <div className="mb-8">{breadcrumbs}</div>
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:gap-12">
          <aside className="hidden w-56 shrink-0 md:block">
            <div className="sticky top-28">
              <KnowledgeSidebar
                tree={tree}
                locale={locale}
                hubLabel={t("hubNav")}
                privateUnlocked={privateUnlocked}
              />
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <KnowledgeSidebarMobile
              tree={tree}
              locale={locale}
              hubLabel={t("hubNav")}
              title={t("browseTopics")}
              privateUnlocked={privateUnlocked}
            />
            {children}
          </div>
        </div>
      </Container>
    </Main>
  );
}
