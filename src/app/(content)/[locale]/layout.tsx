import "../../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
} from "next-sanity";
import { Fira_Sans } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import LanguageSelector from "@/src/components/language-selector";

import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {Link} from '@/src/i18n/navigation';
import Navigation from "./navigation";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{locale: string}> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations()
  const settings = await sanityFetch({
    query: settingsQuery,
    params: { language: locale },
    // Metadata should never contain stega
    stega: false,
  });

  const title = t("title")
  const description = settings?.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description ? toPlainText(description) : undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const { locale } = await params;
  const t = await getTranslations()

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${firaSans.variable} bg-white text-black`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <section className="min-h-screen">
            <header>
              {isDraftMode && <AlertBanner />}
              <div className="container mx-auto px-5 py-6">
                <div className="flex items-center justify-between">
                  <Link locale={locale} href="/" className="text-6xl font-bold">
                    <Image src="/logo.png" alt={t("title")} width={50} height={50} />
                  </Link>
                  <Navigation language={locale} />
                </div>
              </div>
            </header>
            <main>{children}</main>
            <footer className="bg-accent-1 border-accent-2 border-t">
              <div className="container mx-auto px-5">
                <LanguageSelector locale={locale} />
              </div>
            </footer>
          </section>
          {isDraftMode && <VisualEditing />}
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
