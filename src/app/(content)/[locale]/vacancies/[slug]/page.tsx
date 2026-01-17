import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";

import CoverImage from "../../cover-image";
import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { vacancyQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const vacancySlugs = defineQuery(
  `*[_type == "vacancy" && defined(slug.current)]{"slug": slug.current, language}`,
);

export async function generateStaticParams() {
  const vacancies = await sanityFetch({
    query: vacancySlugs,
    perspective: "published",
    stega: false,
  });
  return routing.locales.flatMap((locale) =>
    vacancies
      .filter((vacancy: any) => vacancy.language === locale)
      .map((vacancy: any) => ({
        locale,
        slug: vacancy.slug,
      }))
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const vacancy = await sanityFetch({
    query: vacancyQuery,
    params: { slug, language: locale },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(vacancy?.image);

  return {
    title: vacancy?.title,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function VacancyPage({ params }: Props) {
  const { slug, locale } = await params;
  const vacancy = await sanityFetch({
    query: vacancyQuery,
    params: { slug, language: locale },
  });

  if (!vacancy?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      <article>
        <div className="mb-8">
          <h1 className="mb-6 text-6xl font-bold md:text-7xl lg:text-8xl">
            {vacancy.title}
          </h1>
        </div>

        {vacancy.image && (
          <div className="mb-8 sm:mx-0 md:mb-16">
            <CoverImage image={vacancy.image} priority />
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {vacancy.location && (
            <div className="mb-6 flex items-center text-lg text-gray-600">
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
              {vacancy.location}
            </div>
          )}

          {vacancy.deadline && (
            <div className="mb-6 flex items-center text-lg text-gray-600">
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
              <span className="font-medium">Deadline: </span>
              <DateComponent dateString={vacancy.deadline} />
            </div>
          )}

          {vacancy.description?.length && (
            <div className="mb-12">
              <PortableText
                className="prose-lg"
                value={vacancy.description as PortableTextBlock[]}
              />
            </div>
          )}

          {vacancy.applicationUrl && (
            <div className="mb-12">
              <Link
                href={vacancy.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Apply Now
              </Link>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
