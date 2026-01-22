import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import CoverImage from "../../cover-image";
import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { urlForImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { Main } from "@/src/components/elements/main";
import { DocumentCentered } from "@/src/components/sections/document-centered";

type Props = {
  params: Promise<{ slug: string, locale: string }>;
};

const postSlugs = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  const posts = await sanityFetch({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await sanityFetch({
    query: postQuery,
    params: { slug, language: locale },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.image);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    //description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const { slug, locale } = await params;
  const post = await sanityFetch({ query: postQuery, params: { slug, language: locale } })

  if (!post?._id) {
    return notFound();
  }

  return (
    <Main>
      <DocumentCentered headline={post.title}>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.image} priority />
        </div>
        <div className="mb-6 flex items-center gap-2 text-sm">
          {post.author && (
            <>
              {post.author.picture?.asset?._ref && (
                <img
                  src={urlForImage(post.author.picture)?.height(32).width(32).fit("crop").url() || ""}
                  alt={post.author.name || ""}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <span className="text-gray-600">{post.author.name}</span>
            </>
          )}
          <span className="text-gray-400">·</span>
          <DateComponent dateString={post.date} />
        </div>
        {post.content?.length && (
          <PortableText
            value={post.content as PortableTextBlock[]}
          />
        )}
      </DocumentCentered>
    </Main>
  );
}
