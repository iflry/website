import { defineQuery, toPlainText } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import CoverImage from "../../cover-image";
import DateComponent from "@/src/components/date";
import PortableText from "@/src/components/portable-text";

import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { urlForImage } from "@/sanity/lib/utils";
import { routing } from "@/src/i18n/routing";
import { Main } from "@/src/components/elements/main";
import { DocumentCentered } from "@/src/components/sections/document-centered";
import { JsonLd } from "@/src/components/json-ld";
import { Breadcrumbs } from "@/src/components/breadcrumbs";

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
    description: post?.content
      ? toPlainText(post.content as PortableTextBlock[]).slice(0, 160)
      : undefined,
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

  const plainDescription = post.content
    ? toPlainText(post.content as PortableTextBlock[]).slice(0, 160)
    : undefined;

  return (
    <Main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          ...(post.date && { datePublished: post.date }),
          ...(post.author?.name && {
            author: {
              "@type": "Person",
              name: post.author.name,
            },
          }),
          ...(plainDescription && { description: plainDescription }),
          publisher: {
            "@type": "Organization",
            name: "IFLRY",
            url: "https://new.iflry.org",
          },
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Posts", href: `/${locale}/posts` },
          { label: post.title },
        ]}
        locale={locale}
      />
      <DocumentCentered headline={post.title}>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.image} priority />
        </div>
        <div className="mb-6 flex items-center gap-2 text-sm">
          {post.author && (
            <>
              {post.author.picture?.asset?._ref && (
                <Image
                  src={urlForImage(post.author.picture)?.height(32).width(32).fit("crop").url() || ""}
                  alt={post.author.name || ""}
                  width={32}
                  height={32}
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
