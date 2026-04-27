import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from "next/image";

import { sanityFetch } from "@/sanity/lib/fetch";
import { coreDocumentsQuery, settingsQuery } from "@/sanity/lib/queries";
import { Container } from "@/src/components/elements/container";
import { FacebookIcon } from "@/src/components/icons/social/facebook-icon";
import { InstagramIcon } from "@/src/components/icons/social/instagram-icon";
import { XIcon } from "@/src/components/icons/social/x-icon";
import LanguageSelector from "@/src/components/language-selector";
import { FooterCategory } from "@/src/components/sections/footer-with-link-categories";
import {
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
  SocialLink,
} from "@/src/components/sections/footer-with-newsletter-form-categories-and-social-icons";
import { Link } from "@/src/i18n/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import MobileNavigation from "@/src/app/(content)/[locale]/mobile-navigation";
import Navigation from "@/src/app/(content)/[locale]/navigation";

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

const resolveFooterLinkHref = (link: any): string => {
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

export async function SiteShell({
  locale,
  children,
  topSlot,
  bottomSlot,
}: {
  locale: string;
  children: React.ReactNode;
  topSlot?: React.ReactNode;
  bottomSlot?: React.ReactNode;
}) {
  const t = await getTranslations();

  const [settings, coreDocuments] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
      params: { language: locale },
      stega: false,
    }),
    sanityFetch({ query: coreDocumentsQuery }),
  ]);

  return (
    <NextIntlClientProvider>
      <section className="min-h-screen">
        <header>
          {topSlot}
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
                <MobileNavigation
                  navigation={settings?.navigation || []}
                  language={locale}
                />
              </div>
            </div>
          </Container>
        </header>
        <main>{children}</main>
        <FooterWithNewsletterFormCategoriesAndSocialIcons
          id="footer"
          cta={
            <NewsletterForm
              headline={t("newsletter.heading")}
              subheadline={<p>{t("newsletter.subheading")}</p>}
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
                      href={resolveFooterLinkHref(link)}
                    >
                      {link.title}
                    </FooterLink>
                  ))}
                  {column.title === "Documents" &&
                    coreDocuments?.map((doc: any) => (
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
          fineprint={
            settings?.footer?.fineprint ||
            `© ${new Date().getFullYear()} International Federation of Liberal Youth`
          }
          socialLinks={
            <>
              {settings?.footer?.socialLinks?.map((link: any) => (
                <SocialLink
                  key={link.platform}
                  href={link.url || "#"}
                  name={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </SocialLink>
              ))}
            </>
          }
        />
      </section>
      {bottomSlot}
      <SpeedInsights />
    </NextIntlClientProvider>
  );
}
