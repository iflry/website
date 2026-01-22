import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import CoverImage from "../../cover-image";
import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { eventQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import Link from "next/link";
import membershipData from "@/src/data/membership.json";
import regionalData from "@/src/data/regional.json";
import { Main } from "@/src/components/elements/main";
import { DocumentCentered } from "@/src/components/sections/document-centered";
import { Subheading } from "@/src/components/elements/subheading";
import { Badge } from "@/src/components/ui/badge";

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
    <Main>
      <DocumentCentered
        headline={
          <div>
            
            {event.title}
          </div>
        }
      >
        <div className="mb-6 flex flex-wrap items-center gap-4 text-lg text-gray-600">
        {event.type && (
        <Badge variant="outline">
          {getEventTypeLabel(event.type)}
        </Badge>
      )}
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

          {event.image && (
            <div className="mb-8 sm:mx-0 md:mb-16">
              <CoverImage image={event.image} priority />
            </div>
          )}

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
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <Subheading className="mb-4 text-xl">Contact Person</Subheading>
                <div className="flex items-center gap-2 text-sm">
                  {event.contactPerson.person.picture && (
                    <img
                      src={event.contactPerson.person.picture}
                      alt={event.contactPerson.person.name || ""}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <span className="text-gray-600">{event.contactPerson.person.name}</span>
                    {event.contactPerson.email && (
                      <>
                        {" · "}
                        <Link
                          href={`mailto:${event.contactPerson.email}`}
                          className="text-gray-900 underline underline-offset-4 hover:no-underline"
                        >
                          {event.contactPerson.email}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {event.programme && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <Subheading className="mb-4 text-xl">Programme</Subheading>
                <p className="mb-2 font-medium">{event.programme.title}</p>
                {event.programme.email && (
                  <Link
                    href={`mailto:${event.programme.email}`}
                    className="text-gray-900 underline underline-offset-4 hover:no-underline"
                  >
                    {event.programme.email}
                  </Link>
                )}
              </div>
            )}
          </div>

          {event.trainers && event.trainers.length > 0 && (
            <div className="mb-12">
              <Subheading className="mb-4">Trainers</Subheading>
              <div className="space-y-2">
                {event.trainers.map((trainer: any) => (
                  <div
                    key={trainer._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    {trainer.person?.picture && (
                      <img
                        src={trainer.person.picture}
                        alt={trainer.person.name || ""}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <span className="text-gray-600">{trainer.person?.name}</span>
                      {trainer.email && (
                        <>
                          {" · "}
                          <Link
                            href={`mailto:${trainer.email}`}
                            className="text-gray-900 underline underline-offset-4 hover:no-underline"
                          >
                            {trainer.email}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.partners && event.partners.length > 0 && (
            <div className="mb-12">
              <Subheading className="mb-6">Partners</Subheading>
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
              <Subheading className="mb-6">Participating Members</Subheading>
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
      </DocumentCentered>
    </Main>
  );
}
