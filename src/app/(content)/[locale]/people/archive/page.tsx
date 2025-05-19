import { sanityFetch } from "@/sanity/lib/fetch";
import { peopleQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import RoleView from "../role-view";

export default async function PeoplePage() {
  const t = await getTranslations()
  const people = await sanityFetch({ query: peopleQuery, params: { date: new Date("2025-05-13").toISOString() } })

  return (
    <div className="container mx-auto px-5">
      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {t("title")}
        </Link>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {people?.map((person) => (
          <RoleView 
            key={person._id} 
            picture={person.picture} 
            name={person.name} 
            title={person.title} 
            email={person.email} 
            type={person.type}
            bureauRole={person.bureauRole}
            officeRole={person.officeRole}
          />
        ))}
      </div>
    </div>
  );
}
