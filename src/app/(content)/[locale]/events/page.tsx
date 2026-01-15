import { sanityFetch } from "@/sanity/lib/fetch";
import { upcomingEventsQuery, upcomingEventsCountQuery } from "@/sanity/lib/queries";
import DateComponent from "@/src/components/date";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

const ITEMS_PER_PAGE = 20;

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    ga: "General Assembly",
    seminar: "Seminar",
    workshop: "Workshop",
  };
  return labels[type] || type;
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
          <Link href="/events/archive" className="text-blue-600 hover:underline">
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
    <div className="container mx-auto px-5">
      <div className="mb-12">
        <h1 className="mb-4 text-6xl font-bold md:text-7xl lg:text-8xl">Events</h1>
        <p className="text-lg text-gray-600">
          Upcoming events and activities organized by IFLRY
        </p>
      </div>

      {events && events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {event.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {event.type && (
                    <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {getEventTypeLabel(event.type)}
                    </span>
                  )}
                  <h3 className="mb-2 text-xl font-semibold line-clamp-2 group-hover:text-blue-600">
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
                  {event.slug && (
                    <Link
                      href={`/${locale}/events/${event.slug}`}
                      className="mt-auto text-blue-600 hover:underline"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              </div>
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
    </div>
  );
}
