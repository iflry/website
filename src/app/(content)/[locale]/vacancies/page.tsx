import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, vacanciesQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import DateComponent from "@/src/components/date";
import Link from "next/link";

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
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No open vacancies</h3>
        <p className="mt-2 text-sm text-gray-500">
          There are currently no open positions. Check back later for new opportunities.
        </p>
      </div>
    </div>
  );
}

export default async function VacanciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, vacancies] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "vacancies", language: locale } }),
    sanityFetch({ query: vacanciesQuery, params: { language: locale } }),
  ]);

  // Filter for open vacancies (deadline in future or no deadline)
  const openVacancies = vacancies?.filter((vacancy) => {
    if (!vacancy.deadline) return true;
    const deadline = new Date(vacancy.deadline);
    return deadline >= new Date();
  }) || [];

  return (
    <div className="container mx-auto px-5">
      <div className="mb-12">
        <h1 className="mb-4 text-6xl font-bold md:text-7xl lg:text-8xl">
          {page?.title || "Vacancies"}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>

      {openVacancies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {openVacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="mb-3 text-2xl font-semibold">{vacancy.title}</h2>
              
              {vacancy.location && (
                <div className="mb-3 flex items-center text-sm text-gray-600">
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
                  {vacancy.location}
                </div>
              )}

              {vacancy.deadline && (
                <div className="mb-4 flex items-center text-sm text-gray-600">
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
                  <span className="font-medium">Deadline: </span>
                  <DateComponent dateString={vacancy.deadline} />
                </div>
              )}

              {vacancy.description && (
                <div className="mb-4 flex-1 text-sm text-gray-700">
                  {Array.isArray(vacancy.description) ? (
                    vacancy.description
                      .filter((item: any) => item.value)
                      .map((item: any, index: number) => (
                        <p key={index} className="mb-2">
                          {item.value}
                        </p>
                      ))
                  ) : (
                    <p>{vacancy.description}</p>
                  )}
                </div>
              )}

              {vacancy.applicationUrl && (
                <Link
                  href={vacancy.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Apply Now
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
