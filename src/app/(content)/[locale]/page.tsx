import Link from "next/link";
import { Suspense } from "react";

import DateComponent from "@/src/components/date";
import MembersMap from "@/src/components/members-map";
import ContactView from "./contact-view";
import { Image } from "next-sanity/image";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  featuredPostsQuery,
  eventsQuery,
  partnersQuery,
  vacanciesQuery,
} from "@/sanity/lib/queries";
import { getAllMembers } from "@/src/lib/members";
import { urlForImage } from "@/sanity/lib/utils";

// IFLRY brand colors
const IFLRY_YELLOW = "#FFD700"; // Secondary yellow

function NewsSection({ posts, locale }: { posts: any[]; locale: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold md:text-5xl">Latest News</h2>
        <Link
          href={`/${locale}/posts`}
          className="text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/${locale}/posts/${post.slug}`}
            className="group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {post.image && (
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <img
                  src={urlForImage(post.image)?.size(600, 400).url()}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <DateComponent dateString={post.date} />
              <h3 className="mt-2 text-xl font-semibold line-clamp-2 group-hover:text-blue-600">
                {post.title}
              </h3>
              {post.author && (
                <div className="mt-4">
                  <ContactView name={post.author.name} picture={post.author.picture} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
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
    <section className="py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold md:text-5xl">Upcoming Events</h2>
        <Link
          href={`/${locale}/events`}
          className="text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {upcomingEvents.map((event) => (
          <div
            key={event._id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            {event.type && (
              <div className="text-sm text-gray-600 mb-2">{event.type}</div>
            )}
            {event.location && (
              <div className="text-sm text-gray-600 mb-2">{event.location}</div>
            )}
            {event.start && (
              <div className="text-sm text-gray-600">
                <DateComponent dateString={event.start} />
              </div>
            )}
            {event.slug && (
              <Link
                href={`/${locale}/events/${event.slug}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Learn more →
              </Link>
            )}
          </div>
        ))}
      </div>
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
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold md:text-5xl">Our Partners</h2>
        <Link
          href={`/${locale}/partners`}
          className="text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {featuredPartners.map((partner) => (
          <div
            key={partner._id}
            className="flex items-center justify-center rounded-lg bg-white p-6 shadow-sm border border-gray-200"
          >
            {partner.logo && (
              <Image
                src={partner.logo}
                alt={partner.title}
                width={120}
                height={120}
                className="max-h-16 w-full object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function VacanciesSection({
  vacancies,
  locale,
}: {
  vacancies: any[];
  locale: string;
}) {
  if (vacancies.length === 0) return null;

  // Show only open vacancies (deadline in future or no deadline)
  const openVacancies = vacancies.filter((vacancy) => {
    if (!vacancy.deadline) return true;
    const deadline = new Date(vacancy.deadline);
    return deadline >= new Date();
  });

  if (openVacancies.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold md:text-5xl">Open Vacancies</h2>
        <Link
          href={`/${locale}/vacancies`}
          className="text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {openVacancies.slice(0, 2).map((vacancy) => (
          <div
            key={vacancy._id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-2">{vacancy.title}</h3>
            {vacancy.location && (
              <div className="text-sm text-gray-600 mb-2">{vacancy.location}</div>
            )}
            {vacancy.deadline && (
              <div className="text-sm text-gray-600 mb-4">
                Deadline: <DateComponent dateString={vacancy.deadline} />
              </div>
            )}
            {vacancy.applicationUrl && (
              <Link
                href={vacancy.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Apply Now
              </Link>
            )}
          </div>
        ))}
      </div>
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
  const [members, posts, events, partners, vacancies] = await Promise.all([
    getAllMembers(),
    sanityFetch({
      query: featuredPostsQuery,
      params: { language: locale, quantity: 3 },
    }),
    sanityFetch({ query: eventsQuery, params: { language: locale } }),
    sanityFetch({ query: partnersQuery }),
    sanityFetch({ query: vacanciesQuery, params: { language: locale } }),
  ]);

  return (
    <div className="container mx-auto px-5">
      {/* Hero Section - World Map */}
      <section className="py-8 md:py-12">
        <div className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden p-4">
          <MembersMap members={members} />
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-8 md:py-12">
        <div
          className="rounded-lg p-8 md:p-12 text-center"
          style={{ backgroundColor: IFLRY_YELLOW }}
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-gray-900">
            Support IFLRY
          </h2>
          <p className="mb-6 text-lg text-gray-800">
            Help us continue our mission to promote liberal values and empower
            young leaders worldwide.
          </p>
          <Link
            href={`/${locale}/donation`}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Donate Now
          </Link>
        </div>
      </section>

      {/* News Section */}
      <NewsSection posts={posts || []} locale={locale} />

      {/* Events Section */}
      <EventsSection events={events || []} locale={locale} />

      {/* Partners Section */}
      <PartnersSection partners={partners || []} locale={locale} />

      {/* Vacancies Section - Conditional */}
      <VacanciesSection vacancies={vacancies || []} locale={locale} />
    </div>
  );
}
