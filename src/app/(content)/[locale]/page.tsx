import Link from "next/link";

import DateComponent from "@/src/components/date";
import HeroMap from "@/src/components/hero-map";
import { Card, CardImage } from "@/src/components/card";
import { Badge } from "@/src/components/ui/badge";

import {
  featuredPostsQuery,
  eventsQuery,
  partnersQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { getAllMembers } from "@/src/lib/members";
import { urlForImage } from "@/sanity/lib/utils";
import { Main } from "@/src/components/elements/main";
import { Container } from "@/src/components/elements/container";
import { Logo, LogoGrid } from "@/src/components/elements/logo-grid";
import { ArrowNarrowRightIcon } from "@/src/components/icons/arrow-narrow-right-icon";
import { AnnouncementBadge } from "@/src/components/elements/announcement-badge";
import { EmailSignupForm } from "@/src/components/elements/email-signup-form";
import { Wallpaper } from "@/src/components/elements/wallpaper";
import { Heading } from "@/src/components/elements/heading";
import { Subheading } from "@/src/components/elements/subheading";
import { cn } from "@/src/lib/utils";
// IFLRY brand colors
const IFLRY_DONATION_BLUE = "#0066CC"; // Primary blue for donations

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    ga: "General Assembly",
    seminar: "Seminar",
    workshop: "Workshop",
  };
  return labels[type] || type;
}

function getEventTypeBadgeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type) {
    case "ga":
      return "default";
    case "seminar":
      return "secondary";
    default:
      return "outline";
  }
}

function NewsSection({ posts, locale }: { posts: any[]; locale: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10 sm:gap-16">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Subheading>Latest News</Subheading>
          </div>
          <Link
            href={`/${locale}/posts`}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            View all →
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post._id}
                href={`/${locale}/posts/${post.slug}`}
                image={
                  <CardImage
                    src={post.image ? urlForImage(post.image)?.size(600, 400).url() : null}
                    alt={post.title}
                  />
                }
                metadata={<DateComponent dateString={post.date} />}
                title={post.title}
                footer={
                  post.author && (
                    <div className="flex items-center gap-2 text-sm">
                      {post.author.picture?.asset?._ref && (
                        <img
                          src={urlForImage(post.author.picture)?.height(32).width(32).fit("crop").url() || ""}
                          alt={post.author.name || ""}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-gray-600">{post.author.name}</span>
                    </div>
                  )
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function EventsSection({ events, locale }: { events: any[]; locale: string }) {
  if (events.length === 0) return null;

  // Show upcoming events (limit to 3)
  const upcomingEvents = events
    .filter((event) => {
      if (!event.start) return false;
      const eventDate = new Date(event.start);
      return eventDate >= new Date();
    })
    .slice(0, 3);

  if (upcomingEvents.length === 0) return null;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10 sm:gap-16">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Subheading>Upcoming Events</Subheading>
          </div>
          <Link
            href={`/${locale}/events`}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            View all →
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card
                key={event._id}
                href={`/${locale}/events/${event.slug}`}
                image={
                  <CardImage
                    src={event.image || null}
                    alt={event.title}
                    placeholder={
                      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                }
                badge={
                  event.type && (
                    <Badge variant={getEventTypeBadgeVariant(event.type)} className="w-fit">
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  )
                }
                title={event.title}
                metadata={
                  <>
                    {event.location && (
                      <div className="mb-2 flex items-center text-sm text-gray-600">
                        <svg
                          className="mr-2 h-4 w-4 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.location}
                      </div>
                    )}
                    {event.start && (
                      <div className="mb-4 text-sm text-gray-600">
                        <DateComponent dateString={event.start} />
                      </div>
                    )}
                  </>
                }
                footer={
                  event.slug && (
                    <Link
                      href={`/${locale}/events/${event.slug}`}
                      className="text-gray-900 underline underline-offset-4 font-semibold"
                    >
                      Learn more →
                    </Link>
                  )
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function PartnersSection({
  partners,
  locale,
}: {
  partners: any[];
  locale: string;
}) {
  if (partners.length === 0) return null;

  // Limit to 6 partners for home page
  const featuredPartners = partners.slice(0, 6);

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10 sm:gap-16">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Subheading>Our Partners</Subheading>
          </div>
          <Link
            href={`/${locale}/partners`}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            View all →
          </Link>
        </div>
        <div>
          <LogoGrid>
            {featuredPartners.map((partner) => (
              <Logo key={partner._id}>
                {partner.logo && (
                  <img
                    src={partner.logo}
                    alt={partner.title}
                    className="h-full w-full object-contain opacity-60 transition-opacity hover:opacity-100"
                  />
                )}
              </Logo>
            ))}
          </LogoGrid>
        </div>
      </Container>
    </section>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch all data in parallel
  const [members, posts, events, partners, settings] = await Promise.all([
    getAllMembers(),
    sanityFetch({
      query: featuredPostsQuery,
      params: { language: locale, quantity: 3 },
    }),
    sanityFetch({ query: eventsQuery, params: { language: locale } }),
    sanityFetch({ query: partnersQuery }),
    sanityFetch({ query: settingsQuery, params: { language: locale } }),
  ]);

  return (
    <Main>
      {/* Hero Section - World Map */}
      <section id="hero" className={cn('flex flex-col gap-16 px-2 pb-16')}>
        <Wallpaper className="rounded-lg" color="blue">
          <div className="-mx-2 sm:px-6 md:px-12 lg:px-0">
            <Container className="flex flex-col gap-16">
              <div className="flex gap-x-10 gap-y-16 max-lg:flex-col sm:gap-y-24">
                <div className="flex shrink-0 flex-col items-start gap-6 pt-16 sm:pt-32 lg:basis-lg lg:py-40">
                  {settings?.announcementBanner?.enabled && settings?.announcementBanner?.text && (
                    <AnnouncementBadge 
                      href={settings.announcementBanner.href || "#"} 
                      text={settings.announcementBanner.text} 
                      cta={settings.announcementBanner.cta || "Learn more"} 
                      variant="overlay" 
                    />
                  )}
                  <Heading className="max-w-5xl" color="light">
                    Globalising freedom since 1949
                  </Heading>
                  <div className="flex max-w-3xl flex-col gap-4 text-lg/8 text-white/70">
                    <p>
                      International Federation of Liberal Youth
                    </p>
                  </div>
                  <EmailSignupForm
                    className="max-w-full"
                    variant="overlay"
                    cta={
                      <>
                        Subscribe <ArrowNarrowRightIcon />
                      </>
                    }
                  />
                </div>
                <div>
                  <div className="relative h-72 sm:h-92 md:h-125 lg:size-full">
                    <div className="absolute inset-y-0 left-0 flex w-screen overflow-hidden *:h-full *:w-auto *:max-w-none max-lg:rounded-t-lg lg:rounded-tl-lg">
                      <HeroMap members={members} locale={locale} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </Wallpaper>
      </section>

      {/* News Section */}
      <NewsSection posts={posts || []} locale={locale} />

      {/* Events Section */}
      <EventsSection events={events || []} locale={locale} />

      {/* Donation CTA */}
      <section className="py-8 md:py-12">
        <Container>
          <div
            className="rounded-3xl p-8 md:p-12 text-center"
            style={{ backgroundColor: IFLRY_DONATION_BLUE }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white">
              Support IFLRY
            </h2>
            <p className="mb-6 text-lg text-white/90">
              Help us continue our mission to promote liberal values and empower
              young leaders worldwide.
            </p>
            <Link
              href={`/${locale}/donation`}
              className="inline-block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              Donate Now
            </Link>
          </div>
        </Container>
      </section>
      {/* Partners Section */}
      <PartnersSection partners={partners || []} locale={locale} />
      
    </Main>
  );
}
