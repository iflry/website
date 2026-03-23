import type { Metadata } from "next";
import PortableText from "@/src/components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, coreDocumentsQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Document } from "@/src/components/elements/document";
import { FileTextIcon } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Documents",
    description:
      "Core documents, statutes, and official publications of the International Federation of Liberal Youth (IFLRY).",
  };
}

export default async function DocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, documents] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "documents", language: locale } }),
    sanityFetch({ query: coreDocumentsQuery }),
  ]);

  return (
    <Main>
      <Section
        headline={page?.title || "Documents"}
        headlineAs="h1"
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents?.map((doc) => (
            <a
              key={doc._id}
              href={doc.fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/5 transition hover:bg-gray-50 hover:ring-black/10"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <FileTextIcon className="size-5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{doc.title}</p>
                {doc.description && (
                  <p className="mt-1 text-sm text-gray-500">{doc.description}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </Section>
    </Main>
  );
}
