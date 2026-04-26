import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Landmark,
  Vote,
  Mic,
  MessagesSquare,
  Map,
  Handshake,
  BookOpen,
  Globe,
  Calendar,
  CalendarPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { gaEventQuery, gaEventSlugs } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { Main } from "@/src/components/elements/main";
import { Container } from "@/src/components/elements/container";
import { Wallpaper } from "@/src/components/elements/wallpaper";
import { Heading } from "@/src/components/elements/heading";
import { Subheading } from "@/src/components/elements/subheading";
import { Section } from "@/src/components/elements/section";
import { JsonLd } from "@/src/components/json-ld";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { ArrowNarrowRightIcon } from "@/src/components/icons/arrow-narrow-right-icon";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const iconMap: Record<string, LucideIcon> = {
  landmark: Landmark,
  vote: Vote,
  mic: Mic,
  "messages-square": MessagesSquare,
  map: Map,
  handshake: Handshake,
  "book-open": BookOpen,
  globe: Globe,
  calendar: Calendar,
  users: Users,
};

export async function generateStaticParams() {
  const events = await sanityFetch({
    query: gaEventSlugs,
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
    query: gaEventQuery,
    params: { slug, language: locale },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(event?.image);

  return {
    title: event?.title,
    description: event?.title
      ? `General Assembly - ${event.location || ""}`
      : undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function GAEventPage({ params }: Props) {
  const { slug, locale } = await params;
  const event = await sanityFetch({
    query: gaEventQuery,
    params: { slug, language: locale },
  });

  if (!event?._id) {
    return notFound();
  }

  const baseUrl = "https://new.iflry.org";
  const isInPersonClosed =
    !!event.registrationDeadline &&
    new Date(event.registrationDeadline) < new Date();

  return (
    <Main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          ...(event.start && { startDate: event.start }),
          ...(event.end && { endDate: event.end }),
          ...(event.location && {
            location: {
              "@type": "Place",
              name: event.location,
            },
          }),
          description: `General Assembly${event.location ? ` in ${event.location}` : ""}`,
          organizer: {
            "@type": "Organization",
            name: "IFLRY",
            url: baseUrl,
          },
        }}
      />
      <Breadcrumbs
        items={[
          { label: "General Assembly", href: `/${locale}/events` },
          { label: event.title },
        ]}
        locale={locale}
      />

      {/* Hero Section */}
      <section className="px-2">
        <Wallpaper className="rounded-lg" color="blue">
          <Container className="pt-24 pb-16 sm:pt-32">
            <div className="flex flex-col items-start gap-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                General Assembly
              </p>
              <Heading color="light">{event.title}</Heading>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg/8 text-white/70">
                {event.location && <span>{event.location}</span>}
                {event.start && (
                  <span>
                    <DateComponent dateString={event.start} />
                    {event.end && (
                      <>
                        {" - "}
                        <DateComponent dateString={event.end} />
                      </>
                    )}
                  </span>
                )}
              </div>
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm/7 font-medium text-white inset-ring-1 inset-ring-white/10 hover:bg-white/20"
                >
                  {isInPersonClosed ? "Register Online" : "Register Now"}
                  <ArrowNarrowRightIcon />
                </a>
              )}
            </div>
          </Container>
        </Wallpaper>
      </section>

      {/* About Section */}
      {event.description?.length && (
        <Section eyebrow="About the GA" headline="About this General Assembly">
          <div className="max-w-2xl">
            <PortableText
              className="prose-lg"
              value={event.description as PortableTextBlock[]}
            />
          </div>
        </Section>
      )}

      {/* Programme Highlights Section */}
      {event.programmeHighlights && event.programmeHighlights.length > 0 && (
        <div className="bg-gray-50">
          <Section eyebrow="Programme" headline="What to Expect">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.programmeHighlights.map((highlight: any) => {
                const IconComponent = highlight.icon
                  ? iconMap[highlight.icon]
                  : null;
                return (
                  <div
                    key={highlight._key}
                    className="rounded-xl bg-white p-6 ring-1 ring-black/5"
                  >
                    {IconComponent && (
                      <IconComponent className="mb-3 h-6 w-6 text-gray-400" />
                    )}
                    <h3 className="mb-1 text-base font-semibold text-gray-900">
                      {highlight.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* Deadlines Section */}
      {event.deadlines && event.deadlines.length > 0 && (
        <Wallpaper color="blue">
          <Container className="py-16">
            <div className="flex flex-col gap-10 sm:gap-16">
              <div className="flex max-w-2xl flex-col gap-2">
                <p className="text-sm/7 font-semibold text-white/70">
                  Key Dates
                </p>
                <Subheading className="text-white">
                  Important Deadlines
                </Subheading>
              </div>
              <div className="max-w-3xl">
                {event.deadlines.map((deadline: any) => (
                  <div
                    key={deadline._key}
                    className="flex items-center justify-between border-b border-white/10 py-4 last:border-b-0"
                  >
                    <span className="text-sm text-white/70 sm:text-base">
                      {deadline.label}
                    </span>
                    <span className="font-medium text-white whitespace-nowrap pl-4 text-sm sm:text-base">
                      <DateComponent dateString={deadline.date} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Wallpaper>
      )}

      {/* Pre-Sessions Section */}
      {event.preSessions && event.preSessions.length > 0 && (
        <Section eyebrow="Pre-Sessions" headline="Online Sessions Ahead of the GA">
          <div className="flex max-w-3xl flex-col gap-3">
            {event.preSessions.map((session: any) => (
              <div
                key={session._key}
                className="flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-black/5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="sm:flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {session.description}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span className="whitespace-nowrap text-sm font-medium text-gray-500">
                    <DateComponent dateString={session.date} showTime />
                  </span>
                  <a
                    href={`/api/ical/${event._id}/${session._key}`}
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Add to calendar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Registration Section */}
      {(event.registrationLink || event.registrationDeadline || (event.additionalContacts && event.additionalContacts.length > 0)) && (
        <Section eyebrow="Registration" headline="Secure Your Place">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {(event.registrationLink || event.registrationDeadline) && (
              <div className="rounded-2xl bg-gray-900 p-8 text-white">
                <h3 className="mb-3 text-xl font-semibold">
                  {isInPersonClosed
                    ? "Online Registration Only"
                    : "Register for the General Assembly"}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-white/70">
                  {isInPersonClosed
                    ? "In-person registration has closed. Online registration remains open — you can still sign up to participate remotely."
                    : "Registration is now open. We warmly invite all Member Organisations to confirm their participation."}
                </p>
                {event.registrationDeadline && (
                  <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                      {isInPersonClosed
                        ? "In-Person Registration Closed"
                        : "Registration Deadline"}
                    </p>
                    <p className="mt-1 text-lg font-medium text-white">
                      <DateComponent dateString={event.registrationDeadline} />
                    </p>
                  </div>
                )}
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium text-white inset-ring-1 inset-ring-white/10 hover:bg-white/20"
                  >
                    {isInPersonClosed ? "Register Online" : "Register Here"}
                    <ArrowNarrowRightIcon />
                  </a>
                )}
                {event.visaNote && !isInPersonClosed && (
                  <div className="mt-6 border-l-2 border-white/20 pl-4 text-sm text-white/60">
                    {event.visaNote}
                  </div>
                )}
              </div>
            )}
            {/* Contacts Column */}
            <div className="flex flex-col gap-6">
              {event.additionalContacts && event.additionalContacts.length > 0 ? (
                event.additionalContacts.map((contact: any) => (
                  <div key={contact._key}>
                    {contact.role && (
                      <p className="mb-1 text-sm text-gray-500">
                        {contact.role}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      {contact.person?.picture && (
                        <Image
                          src={contact.person.picture}
                          alt={contact.person.name || ""}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.person?.name}
                        </p>
                        {contact.email && (
                          <Link
                            href={`mailto:${contact.email}`}
                            className="text-sm text-gray-900 underline underline-offset-4 hover:no-underline"
                          >
                            {contact.email}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : event.contactPerson?.person ? (
                <div>
                  <p className="mb-1 text-sm text-gray-500">Contact</p>
                  <div className="flex items-center gap-3">
                    {event.contactPerson.person.picture && (
                      <Image
                        src={event.contactPerson.person.picture}
                        alt={event.contactPerson.person.name || ""}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.contactPerson.person.name}
                      </p>
                      {event.contactPerson.email && (
                        <Link
                          href={`mailto:${event.contactPerson.email}`}
                          className="text-sm text-gray-900 underline underline-offset-4 hover:no-underline"
                        >
                          {event.contactPerson.email}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      )}

      {/* Partners */}
      {event.partners && event.partners.length > 0 && (
        <Section eyebrow="Partners" headline="Organised in Cooperation With">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {event.partners.map((partner: any) => (
              <div
                key={partner._id}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                {partner.logo && (
                  <div className="relative mb-4 h-24 w-full">
                    <Image
                      src={partner.logo}
                      alt={partner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                    />
                  </div>
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
        </Section>
      )}

      {/* Participating Members */}
      {event.members && event.members.length > 0 && (
        <Section eyebrow="Participating Members" headline="Member Organisations">
          <div className="flex flex-wrap gap-2">
            {event.members.map((member: any) => (
              <span
                key={member._id}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
              >
                {member.name}
              </span>
            ))}
          </div>
        </Section>
      )}
    </Main>
  );
}
