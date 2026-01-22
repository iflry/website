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
import { FooterLink, FooterWithNewsletterFormCategoriesAndSocialIcons, NewsletterForm, SocialLink } from "@/src/components/sections/footer-with-newsletter-form-categories-and-social-icons";
import { FooterCategory } from "@/src/components/sections/footer-with-link-categories";
import { XIcon } from "@/src/components/icons/social/x-icon";
import { InstagramIcon } from "@/src/components/icons/social/instagram-icon";
import { FacebookIcon } from "@/src/components/icons/social/facebook-icon";
import { Container } from "@/src/components/elements/container";

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
  
  const settings = await sanityFetch({
    query: settingsQuery,
    params: { language: locale },
    stega: false,
  });

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "x":
        return <XIcon />;
      case "instagram":
        return <InstagramIcon />;
      case "facebook":
        return <FacebookIcon />;
      default:
        return null;
    }
  };

  const resolveFooterLinkHref = (link: any, language: string): string => {
    switch (link.linkType) {
      case "page":
        const locale = link.page?.language || language;
        if (link.page?.type === "members") return `/${locale}/members`;
        if (link.page?.type === "partners") return `/${locale}/partners`;
        if (link.page?.type === "programmes") return `/${locale}/programmes`;
        if (link.page?.type === "people") return `/${locale}/people`;
        return `/${locale}/pages/${link.page?.slug?.current}`;
      case "events":
        return `/${language}/events`;
      case "posts":
        return `/${language}/posts`;
      case "trainers":
        return `/${language}/trainers`;
      case "vacancies":
        return `/${language}/vacancies`;
      case "custom":
        return link.customUrl || `/${language}`;
      default:
        return `/${language}`;
    }
  };

  return (
    <html lang={locale} className={`${firaSans.variable} bg-white text-black`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <section className="min-h-screen">
            <header>
              {isDraftMode && <AlertBanner />}
              <Container className="py-6">
                <div className="flex items-center justify-between">
                  <Link locale={locale} href="/" className="text-6xl font-bold">
                    <Image src="/logo.png" alt={t("title")} width={50} height={50} />
                  </Link>
                  <div className="flex items-center gap-4">
                    <Navigation language={locale} />
                    <LanguageSelector locale={locale} />
                  </div>
                </div>
              </Container>
            </header>
            <main>{children}</main>
            <FooterWithNewsletterFormCategoriesAndSocialIcons
              id="footer"
              cta={
                <NewsletterForm
                  headline="Newsletter"
                  subheadline={
                    <p>
                      Get the latest news and updates from IFLRY.
                    </p>
                  }
                  action="#"
                />
              }
              links={
                <>
                  {settings?.footer?.columns?.map((column: any, index: number) => (
                    <FooterCategory key={index} title={column.title}>
                      {column.links?.map((link: any, linkIndex: number) => (
                        <FooterLink 
                          key={linkIndex} 
                          href={resolveFooterLinkHref(link, locale)}
                        >
                          {link.title}
                        </FooterLink>
                      ))}
                    </FooterCategory>
                  ))}
                </>
              }
              fineprint={settings?.footer?.fineprint || "© 2026 International Federation of Liberal Youth"}
              socialLinks={
                <>
                  {settings?.footer?.socialLinks?.map((link: any) => (
                    <SocialLink key={link.platform} href={link.url || "#"} name={link.platform}>
                      {getSocialIcon(link.platform)}
                    </SocialLink>
                  ))}
                </>
              }
            />
          </section>
          {isDraftMode && <VisualEditing />}
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
