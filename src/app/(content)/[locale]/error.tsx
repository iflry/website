"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { ErrorView } from "@/src/components/error-view";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorView
      title={t("title")}
      description={t("description")}
      retryLabel={t("retry")}
      homeLabel={t("home")}
      onRetry={reset}
    />
  );
}
