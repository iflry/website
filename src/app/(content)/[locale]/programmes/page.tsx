import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, programmesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { PortableTextBlock } from "next-sanity";
import ContactView from "../contact-view";
import { urlForImage } from "@/sanity/lib/utils";

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
    <div className="container mx-auto px-5">
      <div className="mb-12">
        <h1 className="mb-4 text-6xl font-bold md:text-7xl lg:text-8xl">
          {page?.title || "Programmes"}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>

      {programmes && programmes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(programmes as Programme[]).map((programme: Programme) => {
            return (
              <div
                key={programme._id}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="mb-4 text-2xl font-semibold">
                  {programme.title}
                </h2>

                {programme.page?.description && (
                  <div className="mb-4 flex-1 text-sm text-gray-700">
                    <PortableText
                      value={programme.page.description as PortableTextBlock[]}
                    />
                  </div>
                )}

                {programme.email && (
                  <div className="mb-4">
                    <Link
                      href={`mailto:${programme.email}`}
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {programme.email}
                    </Link>
                  </div>
                )}

                {programme.managers && programme.managers.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Programme Managers:
                    </h3>
                    <div className="space-y-3">
                      {programme.managers.map((manager: any) => (
                        <div key={manager._id} className="flex items-center gap-3">
                          {manager.picture && (
                            <div className="h-12 w-12">
                              <img
                                src={manager.picture}
                                alt={manager.name || "Manager"}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                          <div className="text-sm font-semibold">
                            {manager.name || "Unknown"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {programme.page?.slug && (
                  <Link
                    href={`/${locale}/programmes/${programme.page.slug}`}
                    className="mt-4 text-blue-600 hover:underline font-semibold"
                  >
                    See more →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
