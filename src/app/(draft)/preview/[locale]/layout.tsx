import "../../../globals.css";

import { VisualEditing } from "next-sanity";
import { Fira_Sans } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import AlertBanner from "@/src/app/(content)/[locale]/alert-banner";
import { enableDraftFetch } from "@/sanity/lib/fetch";
import { routing } from "@/src/i18n/routing";
import { SiteShell } from "@/src/components/site-shell";

// Force dynamic rendering for the entire preview tree.
// Only editors with the draft cookie are routed here (via middleware).
export const dynamic = "force-dynamic";

export { generateMetadata } from "@/src/app/(content)/[locale]/layout";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Mark this request: any sanityFetch beneath returns drafts with stega.
  enableDraftFetch();

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${firaSans.variable} min-h-screen bg-white text-black`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <SiteShell
          locale={locale}
          messages={messages}
          topSlot={<AlertBanner />}
          bottomSlot={<VisualEditing />}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
