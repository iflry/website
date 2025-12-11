import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery } from "@/sanity/lib/queries";
import PortableText from "@/src/components/portable-text";
import { PortableTextBlock } from "next-sanity";


export default async function DonationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await sanityFetch({
    query: pageTypeQuery,
    params: { type: "donation", language: locale },
  });

  return (
    <div className="container mx-auto px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-5xl font-bold md:text-6xl lg:text-7xl">
          {page?.title || "Donation"}
        </h1>

        {page?.content?.length && (
          <div className="mb-12">
            <PortableText
              className="prose prose-lg max-w-none"
              value={page.content as PortableTextBlock[]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
