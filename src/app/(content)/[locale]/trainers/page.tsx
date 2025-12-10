import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, trainersQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import ContactView from "../contact-view";

const languageNames: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  nl: "Dutch",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  zh: "Chinese",
  ja: "Japanese",
};

export default async function TrainersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, trainers] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "trainers", language: locale } }),
    sanityFetch({ query: trainersQuery }),
  ]);

  return (
    <div className="container mx-auto px-5">
      <div>
        <h1 className="mb-12 text-6xl font-bold md:text-7xl lg:text-8xl">
          {page?.title || "Trainers"}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainers?.map((trainer: any) => (
          <div key={trainer._id}>
            {trainer.contact && (
              <ContactView name={trainer.contact.name} picture={trainer.contact.picture} />
            )}
            {trainer.email && <div>{trainer.email}</div>}
            {trainer.expertises && trainer.expertises.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {trainer.expertises.map((exp: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {exp}
                  </span>
                ))}
              </div>
            )}
            {trainer.languages && trainer.languages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {trainer.languages.map((lang: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 rounded text-sm">
                    {languageNames[lang] || lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

