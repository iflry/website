import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, trainersQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Document } from "@/src/components/elements/document";
import { urlForImage } from "@/sanity/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";

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
    <Main>
      <Section
        headline={page?.title || "Trainers"}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        <ul role="list" className="grid grid-cols-2 gap-x-2 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {trainers?.map((trainer: any) => (
            <li key={trainer._id} className="flex flex-col gap-3 text-sm/7">
              {trainer.person && (
                <>
                  {trainer.person.picture?.asset?._ref ? (
                    <div className="aspect-3/4 w-full overflow-hidden rounded-sm outline -outline-offset-1 outline-black/5">
                      <img
                        src={urlForImage(trainer.person.picture)?.height(600).width(450).fit("crop").url() as string}
                        alt={trainer.person.name}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-3/4 w-full overflow-hidden rounded-sm outline -outline-offset-1 outline-black/5 bg-gray-100 flex items-center justify-center">
                      <span className="text-xl text-gray-400">{trainer.person.name?.charAt(0) || ""}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{trainer.person.name}</p>
                    {trainer.email && (
                      <p className="mt-1">
                        <Link
                          href={`mailto:${trainer.email}`}
                          className="text-gray-500 underline underline-offset-4 hover:text-gray-700"
                        >
                          {trainer.email}
                        </Link>
                      </p>
                    )}
                    {trainer.expertises && trainer.expertises.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        {trainer.expertises.join(", ")}
                      </p>
                    )}
                    {trainer.languages && trainer.languages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {trainer.languages.map((lang: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {languageNames[lang] || lang}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </Main>
  );
}

