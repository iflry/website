import Link from "next/link";

import ContactView from "./contact-view";
import CoverImage from "./cover-image";
import DateComponent from "@/src/components/date";

import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
  language: string;
}) {
  const data = await sanityFetch({ query: moreStoriesQuery, params });

  return (
    <>
      <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {data?.map((post) => {
          const { _id, title, slug, image, author } = post;
          return (
            <article key={_id}>
              <Link href={`/posts/${slug}`} className="group mb-5 block">
                <CoverImage image={image} priority={false} />
              </Link>
              <h3 className="text-balance mb-3 text-3xl leading-snug">
                <Link href={`/posts/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </h3>
              <div className="mb-4 text-lg">
                <DateComponent dateString={post.date} />
              </div>
              {author && <ContactView name={author.name} picture={author.picture} />}
            </article>
          );
        })}
      </div>
    </>
  );
}
