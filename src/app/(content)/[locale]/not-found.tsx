import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NotFoundView } from "@/src/components/not-found-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("page-not-found");
  return { title: t("title") };
}

export default async function NotFound() {
  const t = await getTranslations("page-not-found");

  return (
    <NotFoundView
      title={t("title")}
      description={t("description")}
      home={t("home")}
    />
  );
}
