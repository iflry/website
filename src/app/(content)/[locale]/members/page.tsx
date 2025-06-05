import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { Image } from "next-sanity/image";
import { membersQuery, pageTypeQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";


export default async function MembersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, members] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "members", language: locale } }),
    sanityFetch({ query: membersQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <div>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {page?.title}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => (
          <div key={member._id}>
            {member.logo && <Image src={member.logo} alt={member.name} width={100} height={100} />}
            {member.name}
          </div>
        ))}
      </div>
    </div>
  );
}
