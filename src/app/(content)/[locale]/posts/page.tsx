import { sanityFetch } from "@/sanity/lib/fetch";
import { featuredPostsQuery } from "@/sanity/lib/queries";
import ContactView from "../contact-view";
import DateComponent from "@/src/components/date";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const posts = await sanityFetch({ query: featuredPostsQuery, params: { language: locale, quantity: 3 } })

    return (
        <div className="container mx-auto px-5">
            <h1>Posts</h1>
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {posts.map((post) => (
                    <div
                        key={post.slug}
                        className="relative flex flex-col rounded-3xl bg-white p-2 shadow-md ring-1 shadow-black/5 ring-black/5"
                    >
                        {post && (
                            <img
                                src={urlForImage(post.image)?.size(1170, 780).url()}
                                className="aspect-3/2 w-full rounded-2xl object-cover"
                            />
                        )}
                        <div className="flex flex-1 flex-col p-8">
                            <DateComponent dateString={post.date} />
                            <div className="mt-2 text-base/7 font-medium">
                                <Link href={`/posts/${post.slug}`}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </Link>
                            </div>
                            {/* <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                                {post.content}
                            </div> */}
                            {post.author && (
                                <ContactView name={post.author.name} picture={post.author.picture} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}