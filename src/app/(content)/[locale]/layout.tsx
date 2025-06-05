import "../../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import PortableText from "@/src/components/portable-text";
import LanguageSelector from "@/src/components/language-selector";

import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger, 
  navigationMenuTriggerStyle 
} from "@/src/components/ui/navigation-menu";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const settings = await sanityFetch({
    query: settingsQuery,
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();
  const { locale } = await params;
  const t = await getTranslations()

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} bg-white text-black`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <section className="min-h-screen">
            <header>
              {isDraftMode && <AlertBanner />}
              <div className="container mx-auto px-5 py-12">
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-6xl font-bold">
                    {t("title")}
                  </Link>

                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>
                          About Us
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-[150px]">
                          <NavigationMenuLink href="/people">Our People</NavigationMenuLink>
                          <NavigationMenuLink href="/members">Our Members</NavigationMenuLink>
                          <NavigationMenuLink href="/partners">Our Partners</NavigationMenuLink>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink href="/events" className={navigationMenuTriggerStyle()}>
                          Events
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink href="/programmes" className={navigationMenuTriggerStyle()}>
                          Programmes
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink href="/posts" className={navigationMenuTriggerStyle()}>
                          Posts
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>
            </header>
            <main>{children}</main>
            <footer className="bg-accent-1 border-accent-2 border-t">
              <div className="container mx-auto px-5">
                {footer.length > 0 && (
                  <PortableText
                    className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
                    value={footer as PortableTextBlock[]}
                  />
                )}
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
