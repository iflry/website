import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery, postsCountQuery } from "@/sanity/lib/queries";
import ContactView from "../contact-view";
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
import PostsTabs from "./posts-tabs";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 20;

const POST_TYPES = [
  { value: "all", label: "All" },
  { value: "statement", label: "Statement" },
  { value: "press-release", label: "Press Release" },
  { value: "bureau-update", label: "Bureau Update" },
] as const;

function EmptyState({ type }: { type: string }) {
  const typeLabel =
    POST_TYPES.find((t) => t.value === type)?.label.toLowerCase() || "posts";

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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No posts found</h3>
        <p className="mt-2 text-sm text-gray-500">
          {type === "all"
            ? "There are no posts yet."
            : `There are no ${typeLabel} posts yet.`}
        </p>
      </div>
    </div>
  );
}

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { type = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const postType = type === "all" ? "" : type;

  const [posts, totalCount] = await Promise.all([
    sanityFetch({
      query: postsQuery,
      params: {
        language: locale,
        type: postType || "",
        offset,
        limit: offset + ITEMS_PER_PAGE,
      },
    }),
    sanityFetch({
      query: postsCountQuery,
      params: {
        language: locale,
        type: postType || "",
      },
    }),
  ]);

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-5">
      <h1 className="mb-12 text-6xl font-bold md:text-7xl lg:text-8xl">Posts</h1>

      <div className="mb-8">
        <Suspense fallback={<div className="h-9 w-full rounded-lg bg-muted" />}>
          <PostsTabs currentType={type} locale={locale} />
        </Suspense>
      </div>

      {posts && posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="group relative flex flex-col rounded-3xl bg-white p-2 shadow-md ring-1 shadow-black/5 ring-black/5 transition-shadow hover:shadow-lg"
              >
                {post.image && (
                  <img
                    src={urlForImage(post.image)?.size(1170, 780).url()}
                    className="aspect-3/2 w-full rounded-2xl object-cover"
                    alt={post.title}
                  />
                )}
                <div className="flex flex-1 flex-col p-8">
                  <DateComponent dateString={post.date} />
                  <div className="mt-2 text-base/7 font-medium">
                    <Link href={`/${locale}/posts/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </div>
                  {post.author && (
                    <div className="mt-4">
                      <ContactView name={post.author.name} picture={post.author.picture} />
                    </div>
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
                        href={`/${locale}/posts?type=${type}&page=${currentPage - 1}`}
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
                            href={`/${locale}/posts?type=${type}&page=${pageNum}`}
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
                        href={`/${locale}/posts?type=${type}&page=${currentPage + 1}`}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <EmptyState type={type} />
      )}
    </div>
  );
}
