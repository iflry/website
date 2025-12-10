import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, vacanciesQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import DateComponent from "@/src/components/date";
import Link from "next/link";

export default async function VacanciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, vacancies] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "vacancies", language: locale } }),
    sanityFetch({ query: vacanciesQuery, params: { language: locale } }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <div>
        <h1 className="mb-12 text-6xl font-bold md:text-7xl lg:text-8xl">
          {page?.title || "Vacancies"}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div>
        {vacancies?.map((vacancy) => (
          <div key={vacancy._id} className="mb-8">
            <div className="font-bold text-xl">{vacancy.title}</div>
            {vacancy.location && <div>{vacancy.location}</div>}
            {vacancy.deadline && <DateComponent dateString={vacancy.deadline} />}
            {vacancy.applicationUrl && (
              <Link href={vacancy.applicationUrl} className="text-blue-600 underline">
                Apply
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

