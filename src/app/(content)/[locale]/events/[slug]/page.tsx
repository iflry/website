import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import ContactView from "../../contact-view";
import CoverImage from "../../cover-image";
import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { eventQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { urlForImage } from "@/sanity/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import membershipData from "@/src/data/membership.json";
import regionalData from "@/src/data/regional.json";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const eventSlugs = defineQuery(
  `*[_type == "event" && defined(slug.current)]{"slug": slug.current, language}`,
);

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    ga: "General Assembly",
    seminar: "Seminar",
    workshop: "Workshop",
  };
  return labels[type] || type;
}

export async function generateStaticParams() {
  const events = await sanityFetch({
    query: eventSlugs,
    perspective: "published",
    stega: false,
  });
  return routing.locales.flatMap((locale) =>
    events
      .filter((event: any) => event.language === locale)
      .map((event: any) => ({
        locale,
        slug: event.slug,
      }))
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const event = await sanityFetch({
    query: eventQuery,
    params: { slug, language: locale },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(event?.image);

  return {
    title: event?.title,
    description: event?.description
      ? `${getEventTypeLabel(event.type || "")} - ${event.location || ""}`
      : undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function EventPage({ params }: Props) {
  const { slug, locale } = await params;
  const event = await sanityFetch({
    query: eventQuery,
    params: { slug, language: locale },
  });

  if (!event?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      <article>
        <div className="mb-8">
          {event.type && (
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
              {getEventTypeLabel(event.type)}
            </span>
          )}
          <h1 className="mb-6 text-6xl font-bold md:text-7xl lg:text-8xl">
            {event.title}
          </h1>
          <div className="mb-6 flex flex-wrap items-center gap-4 text-lg text-gray-600">
            {event.location && (
              <div className="flex items-center">
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
              <div className="flex items-center">
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
          </div>
        </div>

        {event.image && (
          <div className="mb-8 sm:mx-0 md:mb-16">
            <CoverImage image={event.image} priority />
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {event.description?.length && (
            <div className="mb-12">
              <PortableText
                className="prose-lg"
                value={event.description as PortableTextBlock[]}
              />
            </div>
          )}

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            {event.contactPerson?.person && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Contact Person</h2>
                <div className="flex items-center gap-4">
                  {event.contactPerson.person.picture && (
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={event.contactPerson.person.picture}
                        alt={event.contactPerson.person.name}
                      />
                      <AvatarFallback>
                        {event.contactPerson.person.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-semibold">
                      {event.contactPerson.person.name}
                    </p>
                    {event.contactPerson.email && (
                      <Link
                        href={`mailto:${event.contactPerson.email}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {event.contactPerson.email}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {event.programme && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Programme</h2>
                <p className="mb-2 font-medium">{event.programme.title}</p>
                {event.programme.email && (
                  <Link
                    href={`mailto:${event.programme.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {event.programme.email}
                  </Link>
                )}
              </div>
            )}
          </div>

          {event.trainers && event.trainers.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Trainers</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {event.trainers.map((trainer: any) => (
                  <div
                    key={trainer._id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    {trainer.person?.picture && (
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={trainer.person.picture}
                          alt={trainer.person.name}
                        />
                        <AvatarFallback>
                          {trainer.person.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{trainer.person?.name}</p>
                      {trainer.email && (
                        <Link
                          href={`mailto:${trainer.email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {trainer.email}
                        </Link>
                      )}
                      {trainer.expertises && trainer.expertises.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600">
                            Expertises:
                          </p>
                          <p className="text-sm text-gray-700">
                            {trainer.expertises.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.partners && event.partners.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Partners</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {event.partners.map((partner: any) => (
                  <div
                    key={partner._id}
                    className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.title}
                        className="mb-4 h-24 w-auto object-contain"
                      />
                    )}
                    <h3 className="mb-2 text-center font-semibold">
                      {partner.title}
                    </h3>
                    {partner.description && (
                      <p className="text-center text-sm text-gray-600">
                        {Array.isArray(partner.description)
                          ? partner.description
                              .filter((item: any) => item.value)
                              .map((item: any) => item.value)
                              .join(" ")
                          : partner.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.members && event.members.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold">Participating Members</h2>
              <div className="flex flex-wrap gap-2">
                {event.members.map((memberId: string, index: number) => {
                  const allMembers = [...membershipData, ...regionalData];
                  const member = allMembers.find((m) => m.id === memberId);
                  return (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      {member?.name || memberId}
                    </span>
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
