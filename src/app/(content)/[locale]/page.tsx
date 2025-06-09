import Link from "next/link";
import { Suspense } from "react";

import CoverImage from "./cover-image";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import DateComponent from "@/src/components/date";

import { sanityFetch } from "@/sanity/lib/fetch";
import { featuredPostsQuery } from "@/sanity/lib/queries";
import PersonView from "./person-view";
import { Post } from "@/sanity.types";

function HeroPost({
  title,
  slug,
  image,
  date,
  author,
}: {
  title: string;
  slug: string | null;
  image: any;
  date: string;
  author: { name: string; picture: any } | null;
}) {
  if (!slug) return null;

  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={image} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={date || ''} />
          </div>
        </div>
        <div>
          {author && <PersonView name={author.name} picture={author.picture} />}
        </div>
      </div>
    </article>
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const posts = await sanityFetch({ query: featuredPostsQuery, params: { language: locale, quantity: 1 } })
  const heroPost = posts.length > 0 ? posts[0] : null

  return (
    <div className="container mx-auto px-5">
      {heroPost && heroPost.slug && heroPost.title ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          image={heroPost.image}
          date={heroPost.date}
          author={heroPost.author}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside>
          <h2 className="mb-8 text-6xl font-bold md:text-7xl">
            More Stories
          </h2>
          <Suspense>
            <MoreStories skip={heroPost._id} limit={100} language={locale} />
          </Suspense>
        </aside>
      )}
    </div>
  );
}
