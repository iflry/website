import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, vacanciesQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import CoverImage from "../cover-image";

type Vacancy = {
  _id: string;
  title: string;
  slug: string;
  image?: any;
  deadline?: string;
};

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
  const openVacancies = (vacancies as Vacancy[] | undefined)?.filter((vacancy: Vacancy) => {
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openVacancies.map((vacancy: Vacancy) => (
            <Link
              key={vacancy._id}
              href={`/${locale}/vacancies/${vacancy.slug}`}
              className="group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
            >
              {vacancy.image && (
                <div className="w-full">
                  <CoverImage image={vacancy.image} />
                </div>
              )}
              <div className="flex flex-col p-6">
                <h2 className="text-2xl font-semibold group-hover:text-blue-600">
                  {vacancy.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
