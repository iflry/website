import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery } from "@/sanity/lib/queries";
import PortableText from "@/src/components/portable-text";
import { PortableTextBlock } from "next-sanity";
import { Main } from "@/src/components/elements/main";
import { DocumentCentered } from "@/src/components/sections/document-centered";


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
    <Main>
      <DocumentCentered
        headline={page?.title || "Donation"}
      >
        {page?.content?.length && (
          <PortableText
            value={page.content as PortableTextBlock[]}
          />
        )}
      </DocumentCentered>
    </Main>
  );
}
