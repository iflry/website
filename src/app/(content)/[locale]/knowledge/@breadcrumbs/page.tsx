import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/src/components/breadcrumbs";

export default async function KnowledgeHubBreadcrumbs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Knowledge");
  return <Breadcrumbs locale={locale} items={[{ label: t("hubTitle") }]} />;
}
