import { sanityFetch } from "@/sanity/lib/fetch";
import { pastEventsQuery, pastEventsCountQuery } from "@/sanity/lib/queries";
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
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
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

export default async function EventsArchivePage({
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
      query: pastEventsQuery,
      params: { language: locale, currentDate, offset, limit: offset + ITEMS_PER_PAGE },
    }),
    sanityFetch({
      query: pastEventsCountQuery,
      params: { language: locale, currentDate },
    }),
  ]);

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <Main>
      <Section
        headline="Event Archive"
        subheadline={
          <Text>
            Past events and activities organized by IFLRY
          </Text>
        }
      >
        {events && events.length > 0 ? (
        <>
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:flex-row"
              >
                {event.image && (
                  <div className="h-48 w-full overflow-hidden rounded-lg md:h-32 md:w-48">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    {event.type && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                        {getEventTypeLabel(event.type)}
                      </span>
                    )}
                    {event.start && (
                      <span className="text-sm text-gray-600">
                        <DateComponent dateString={event.start} />
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                  {event.location && (
                    <div className="mb-2 text-sm text-gray-600">{event.location}</div>
                  )}
                  {event.slug && (
                    <Link
                      href={`/${locale}/events/${event.slug}`}
                      className="mt-auto text-gray-900 underline underline-offset-4 font-semibold"
                    >
                      View details →
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
                        href={`/${locale}/events/archive?page=${currentPage - 1}`}
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
                            href={`/${locale}/events/archive?page=${pageNum}`}
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
                      <PaginationNext
                        href={`/${locale}/events/archive?page=${currentPage + 1}`}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
        ) : (
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No past events</h3>
              <p className="mt-2 text-sm text-gray-500">
                There are no past events in the archive yet.
              </p>
            </div>
          </div>
        )}
      </Section>
    </Main>
  );
}
