import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";

import ContactView from "../../contact-view";
import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { programmePageQuery, eventsByProgrammeQuery } from "@/sanity/lib/queries";
import { routing } from "@/src/i18n/routing";
import { urlForImage } from "@/sanity/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const programmePageSlugs = defineQuery(
  `*[_type == "programmePage" && defined(slug.current)]{"slug": slug.current, language}`,
);

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    ga: "General Assembly",
    seminar: "Seminar",
    workshop: "Workshop",
  };
  return labels[type] || type;
}

function getBiographyForLocale(biography: any, locale: string): string | null {
  if (!biography || !Array.isArray(biography)) return null;
  // Biography uses internationalizedArrayString which has _key (system field)
  const localeBio = biography.find((item: any) => item._key === locale);
  if (localeBio?.value) return localeBio.value;
  const enBio = biography.find((item: any) => item._key === "en");
  if (enBio?.value) return enBio.value;
  const firstBio = biography.find((item: any) => item.value);
  return firstBio?.value || null;
}

export async function generateStaticParams() {
  const programmePages = await sanityFetch({
    query: programmePageSlugs,
    perspective: "published",
    stega: false,
  });
  return routing.locales.flatMap((locale) =>
    programmePages
      .filter((page: any) => page.language === locale)
      .map((page: any) => ({
        locale,
        slug: page.slug,
      }))
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const programmePage = await sanityFetch({
    query: programmePageQuery,
    params: { slug, language: locale },
    stega: false,
  });

  return {
    title: programmePage?.programme?.title,
    description: programmePage?.description
      ? `Programme: ${programmePage.programme?.title}`
      : undefined,
  } satisfies Metadata;
}

export default async function ProgrammePage({ params }: Props) {
  const { slug, locale } = await params;
  const programmePage = await sanityFetch({
    query: programmePageQuery,
    params: { slug, language: locale },
  });

  if (!programmePage?._id || !programmePage?.programme) {
    return notFound();
  }

  const programme = programmePage.programme;

  // Fetch events for this programme
  const programmeEvents = await sanityFetch({
    query: eventsByProgrammeQuery,
    params: { programmeId: programme._id, language: locale },
  });

  return (
    <div className="container mx-auto px-5">
      <article>
        <div className="mb-8">
          <h1 className="mb-6 text-6xl font-bold md:text-7xl lg:text-8xl">
            {programme.title}
          </h1>

          {programme.email && (
            <div className="mb-6 flex items-center text-lg text-gray-600">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <Link
                href={`mailto:${programme.email}`}
                className="text-blue-600 hover:underline"
              >
                {programme.email}
              </Link>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-2xl">
          {programmePage.description?.length && (
            <div className="mb-12">
              <PortableText
                className="prose-lg"
                value={programmePage.description as PortableTextBlock[]}
              />
            </div>
          )}

          {programmeEvents && programmeEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-3xl font-bold">Events</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {programmeEvents.map((event: any) => (
                  <Link
                    key={event._id}
                    href={`/${locale}/events/${event.slug}`}
                    className="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {event.type && (
                      <span className="mb-2 inline-block w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {getEventTypeLabel(event.type)}
                      </span>
                    )}
                    <h3 className="mb-2 text-xl font-semibold group-hover:text-blue-600">
                      {event.title}
                    </h3>
                    {event.location && (
                      <div className="mb-2 flex items-center text-sm text-gray-600">
                        <svg
                          className="mr-2 h-4 w-4"
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
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <DateComponent dateString={event.start} />
                        {event.end && (
                          <>
                            {" - "}
                            <DateComponent dateString={event.end} />
                          </>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {programme.managers && programme.managers.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-3xl font-bold">Programme Managers</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {programme.managers.map((manager: any) => {
                  const biography = getBiographyForLocale(
                    manager.biography,
                    locale
                  );
                  return (
                    <div
                      key={manager._id}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4">
                        <ContactView
                          name={manager.name || "Unknown"}
                          picture={manager.picture}
                        />
                      </div>
                      {biography && (
                        <div className="text-sm text-gray-700">
                          <p>{biography}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
