import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery, postsCountQuery } from "@/sanity/lib/queries";
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
import { Badge } from "@/src/components/ui/badge";
import { Card, CardImage } from "@/src/components/card";
import PostsTabs from "./posts-tabs";
import { Suspense } from "react";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";

const ITEMS_PER_PAGE = 20;

const POST_TYPES = [
  { value: "all", label: "All" },
  { value: "statement", label: "Statement" },
  { value: "press-release", label: "Press Release" },
  { value: "bureau-update", label: "Bureau Update" },
] as const;

function getPostTypeBadgeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type) {
    case "press-release":
      return "default";
    case "bureau-update":
      return "secondary";
    default:
      return "outline";
  }
}

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
    <Main>
      <Section headline="Posts">
        <div className="mb-8">
          <Suspense fallback={<div className="h-9 w-full rounded-lg bg-muted" />}>
            <PostsTabs currentType={type} locale={locale} />
          </Suspense>
        </div>

        {posts && posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Card
                key={post.slug}
                href={`/${locale}/posts/${post.slug}`}
                image={
                  <CardImage
                    src={post.image ? urlForImage(post.image)?.size(1170, 780).url() : null}
                    alt={post.title}
                    placeholder={
                      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  />
                }
                badge={
                  (post as any).type && (
                    <Badge variant={getPostTypeBadgeVariant((post as any).type)}>
                      {POST_TYPES.find((t) => t.value === (post as any).type)?.label || (post as any).type}
                    </Badge>
                  )
                }
                title={post.title}
                metadata={
                  <DateComponent dateString={post.date} />
                }
                footer={
                  post.author && (
                    <div className="flex items-center gap-2 text-sm">
                      {post.author.picture?.asset?._ref && (
                        <img
                          src={urlForImage(post.author.picture)?.height(32).width(32).fit("crop").url() || ""}
                          alt={post.author.name || ""}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-gray-600">{post.author.name}</span>
                    </div>
                  )
                }
              />
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
      </Section>
    </Main>
  );
}
