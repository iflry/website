import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, programmesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { PortableTextBlock } from "next-sanity";
import { extractTextFromPortableText, truncateText } from "@/src/lib/text-utils";
import { Card } from "@/src/components/card";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Document } from "@/src/components/elements/document";

type Programme = {
  _id: string;
  title: string;
  email?: string;
  page?: {
    slug?: string;
    description?: PortableTextBlock[];
  };
  managers?: Array<{
    _id: string;
    name: string;
    picture?: string;
  }>;
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No programmes</h3>
        <p className="mt-2 text-sm text-gray-500">
          There are no programmes available yet.
        </p>
      </div>
    </div>
  );
}

export default async function ProgrammesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [page, programmes] = await Promise.all([
    sanityFetch({
      query: pageTypeQuery,
      params: { type: "programmes", language: locale },
    }),
    sanityFetch({ query: programmesQuery, params: { language: locale } }),
  ]);

  return (
    <Main>
      <Section
        headline={page?.title || "Programmes"}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        {programmes && programmes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(programmes as Programme[]).map((programme: Programme) => {
            const descriptionText = programme.page?.description
              ? extractTextFromPortableText(programme.page.description)
              : "";
            const excerpt = truncateText(descriptionText, 150);
            const hasMore = descriptionText.length > 150;

            return (
              <Card
                key={programme._id}
                href={programme.page?.slug ? `/${locale}/programmes/${programme.page.slug}` : undefined}
                title={programme.title}
                titleAs="h2"
              >
                {excerpt && (
                  <div className="mb-4 flex-1">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {excerpt}
                    </p>
                  </div>
                )}

                {programme.email && (
                  <div className="mb-4">
                    <Link
                      href={`mailto:${programme.email}`}
                      className="text-gray-900 underline underline-offset-4 hover:no-underline"
                    >
                      {programme.email}
                    </Link>
                  </div>
                )}

                {programme.managers && programme.managers.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Programme Managers:
                    </h3>
                    <div className="space-y-2">
                      {programme.managers.map((manager: any) => (
                        <div key={manager._id} className="flex items-center gap-2 text-sm">
                          {manager.picture && (
                            <img
                              src={manager.picture}
                              alt={manager.name || "Manager"}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                          <span className="text-gray-600">{manager.name || "Unknown"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {programme.page?.slug && (
                  <Link
                    href={`/${locale}/programmes/${programme.page.slug}`}
                    className="mt-auto text-gray-900 underline underline-offset-4 font-semibold"
                  >
                    {hasMore ? "Read more" : "See more"} →
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
        ) : (
          <EmptyState />
        )}
      </Section>
    </Main>
  );
}
