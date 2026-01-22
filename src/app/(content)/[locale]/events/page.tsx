import { sanityFetch } from "@/sanity/lib/fetch";
import { upcomingEventsQuery, upcomingEventsCountQuery } from "@/sanity/lib/queries";
import DateComponent from "@/src/components/date";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardImage } from "@/src/components/card";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Heading } from "@/src/components/elements/heading";
import { Text } from "@/src/components/elements/text";

const ITEMS_PER_PAGE = 20;

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

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto max-w-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No upcoming events</h3>
        <p className="mt-2 text-sm text-gray-500">
          Check back later for new events, or view our{" "}
          <Link href="/events/archive" className="text-gray-900 underline underline-offset-4 font-semibold">
            event archive
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDate = new Date().toISOString();

  const [events, totalCount] = await Promise.all([
    sanityFetch({
      query: upcomingEventsQuery,
      params: { language: locale, currentDate, offset, limit: offset + ITEMS_PER_PAGE },
    }),
    sanityFetch({
      query: upcomingEventsCountQuery,
      params: { language: locale, currentDate },
    }),
  ]);

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <Main>
      <Section
        headline="Events"
        subheadline={
          <Text>
            Upcoming events and activities organized by IFLRY
          </Text>
        }
      >
        {events && events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
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
                        {event.end && (
                          <span>
                            {" - "}
                            <DateComponent dateString={event.end} />
                          </span>
                        )}
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

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/${locale}/events?page=${currentPage - 1}`}
                      />
                    </PaginationItem>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href={`/${locale}/events?page=${pageNum}`}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={`/${locale}/events?page=${currentPage + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
        ) : (
          <EmptyState />
        )}
      </Section>
    </Main>
  );
}
