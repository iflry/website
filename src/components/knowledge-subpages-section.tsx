import { getTranslations } from "next-intl/server";

import { Card } from "@/src/components/card";
import { Container } from "@/src/components/elements/container";
import { Subheading } from "@/src/components/elements/subheading";
import type { KnowledgeChildCard } from "@/src/lib/knowledge-data";

export async function KnowledgeSubpagesSection({
  pages,
  locale,
}: {
  pages: KnowledgeChildCard[];
  locale: string;
}) {
  if (pages.length === 0) return null;
  const t = await getTranslations("Knowledge");

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10 sm:gap-16">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Subheading>{t("subpagesHeading")}</Subheading>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Card
                key={page._id}
                href={`/${locale}/knowledge/${page.slug}`}
                title={page.title}
                metadata={
                  page.excerpt ? (
                    <p className="line-clamp-3 text-sm text-gray-600">{page.excerpt}</p>
                  ) : null
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
