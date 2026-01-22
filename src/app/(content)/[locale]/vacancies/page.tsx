import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, vacanciesQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";
import DateComponent from "@/src/components/date";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardImage } from "@/src/components/card";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Document } from "@/src/components/elements/document";

type Vacancy = {
  _id: string;
  title: string;
  slug: string;
  image?: any;
  location?: string;
  deadline?: string;
};

function getDeadlineBadgeVariant(deadline: string | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (!deadline) return "outline";
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return "outline"; // Past deadline
  if (daysUntil <= 7) return "destructive"; // Urgent
  if (daysUntil <= 30) return "secondary"; // Upcoming
  return "default"; // Normal
}

function getDeadlineLabel(deadline: string | undefined): string {
  if (!deadline) return "No deadline";
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return "Expired";
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  if (daysUntil <= 7) return `Due in ${daysUntil} days`;
  return `Deadline: ${deadlineDate.toLocaleDateString()}`;
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
    <Main>
      <Section
        headline={page?.title || "Vacancies"}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        {openVacancies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openVacancies.map((vacancy: Vacancy) => (
            <Card
              key={vacancy._id}
              href={`/${locale}/vacancies/${vacancy.slug}`}
              image={
                vacancy.image ? (
                  <CardImage
                    src={urlForImage(vacancy.image)?.size(1170, 780).url() || null}
                    alt={vacancy.title}
                  />
                ) : undefined
              }
              badge={
                vacancy.deadline && (
                  <Badge variant={getDeadlineBadgeVariant(vacancy.deadline)}>
                    {getDeadlineLabel(vacancy.deadline)}
                  </Badge>
                )
              }
              title={vacancy.title}
              titleAs="h2"
              metadata={
                vacancy.location && (
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
                    {vacancy.location}
                  </div>
                )
              }
              footer={
                vacancy.deadline && (
                  <div className="text-sm text-gray-600">
                    <DateComponent dateString={vacancy.deadline} />
                  </div>
                )
              }
            />
          ))}
        </div>
        ) : (
          <EmptyState />
        )}
      </Section>
    </Main>
  );
}
