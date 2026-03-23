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
import { settingsQuery, coreDocumentsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {Link} from '@/src/i18n/navigation';
import Navigation from "./navigation";
import MobileNavigation from "./mobile-navigation";
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
  const plainDescription = description ? toPlainText(description) : undefined;

  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: plainDescription,
    openGraph: {
      images: ogImage ? [ogImage] : [],
      locale,
      type: "website",
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title: {
        template: `%s | ${title}`,
        default: title,
      },
      description: plainDescription,
      images: ogImage ? [ogImage.url] : [],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
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
  
  const [settings, coreDocuments] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
      params: { language: locale },
      stega: false,
    }),
    sanityFetch({ query: coreDocumentsQuery }),
  ]);

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

  const resolveFooterLinkHref = (link: any, _language: string): string => {
    switch (link.linkType) {
      case "page":
        if (link.page?.type === "members") return `/members`;
        if (link.page?.type === "partners") return `/partners`;
        if (link.page?.type === "programmes") return `/programmes`;
        if (link.page?.type === "people") return `/people`;
        if (link.page?.type === "documents") return `/documents`;
        if (link.page?.type === "vacancies") return `/vacancies`;
        if (link.page?.type === "trainers") return `/trainers`;
        if (link.page?.type === "events") return `/events`;
        if (link.page?.type === "posts") return `/posts`;
        if (link.page?.type === "donation") return `/donation`;
        return `/pages/${link.page?.slug?.current || ""}`;
      case "events":
        return `/events`;
      case "posts":
        return `/posts`;
      case "trainers":
        return `/trainers`;
      case "vacancies":
        return `/vacancies`;
      case "custom":
        return link.customUrl || `/`;
      default:
        return `/`;
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
                    <div className="hidden lg:block">
                      <Navigation language={locale} />
                    </div>
                    <LanguageSelector locale={locale} />
                    <MobileNavigation navigation={settings?.navigation || []} language={locale} />
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
                  action="https://iflry.us4.list-manage.com/subscribe?u=f084df7f03936bcc68ef9dc7d&id=e229b70e26"
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
                      {column.title === "Documents" && coreDocuments?.map((doc: any) => (
                        <FooterLink
                          key={doc._id}
                          href={doc.fileUrl || "/documents"}
                          target={doc.fileUrl ? "_blank" : undefined}
                          rel={doc.fileUrl ? "noopener noreferrer" : undefined}
                        >
                          {doc.title}
                        </FooterLink>
                      ))}
                    </FooterCategory>
                  ))}
                </>
              }
              fineprint={settings?.footer?.fineprint || `© ${new Date().getFullYear()} International Federation of Liberal Youth`}
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
