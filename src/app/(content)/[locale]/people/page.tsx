import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery, peopleQuery } from "@/sanity/lib/queries";
import RoleView, { RoleType, BureauRole, OfficeRole } from "./role-view";
import PortableText from "@/src/components/portable-text";
import { PortableTextBlock } from "next-sanity";
import { Link } from "@/src/i18n/navigation";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Subheading } from "@/src/components/elements/subheading";
import { Document } from "@/src/components/elements/document";


const typeOrder: Record<RoleType, { order: number, title: string }> = {
  "bureau-member": { order: 1, title: "Bureau" },
  "regional-representative": { order: 2, title: "Regional Representatives" },
  "office": { order: 3, title: "Office" },
  "honorary-member": { order: 4, title: "Honorary Members" },
  "ombudsperson": { order: 5, title: "Ombudsperson" },
  "advisory-council": { order: 6, title: "Advisory Council" },
  "individual-member": { order: 7, title: "Individual Members" }
};

const bureauRoleOrder: Record<BureauRole, number> = {
  "president": 1,
  "secretary-general": 2,
  "treasurer": 3,
  "vice-president": 4
};

const officeRoleOrder: Record<OfficeRole, number> = {
  "executive-director": 1,
  "project-manager": 2,
  "intern": 3
};

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const currentDate = new Date().toISOString()
  const [page, people] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "people", language: locale } }),
    sanityFetch({ query: peopleQuery, params: { date: currentDate, language: locale } })
  ])
  
  const peopleByType: Record<string, any[]> = {};
  people.forEach(person => {
    if (person.type) {
      if (!peopleByType[person.type]) {
        peopleByType[person.type] = [];
      }
      peopleByType[person.type].push(person);
    }
  });
  
  const orderedSections = Object.entries(peopleByType)
    .map(([type, peopleList]) => {
      if (type === "bureau-member") {
        peopleList.sort((a, b) => {
          const orderA = a.bureauRole && (bureauRoleOrder[a.bureauRole as BureauRole] || 999);
          const orderB = b.bureauRole && (bureauRoleOrder[b.bureauRole as BureauRole] || 999);
          return orderA - orderB;
        });
      } else if (type === "office") {
        peopleList.sort((a, b) => {
          const orderA = a.officeRole && (officeRoleOrder[a.officeRole as OfficeRole] || 999);
          const orderB = b.officeRole && (officeRoleOrder[b.officeRole as OfficeRole] || 999);
          return orderA - orderB;
        });
      }

      return {
        type,
        title: type in typeOrder ? typeOrder[type as RoleType].title : type,
        order: type in typeOrder ? typeOrder[type as RoleType].order : 999,
        people: peopleList
      };
    })
    .sort((a, b) => a.order - b.order);

  return (
    <Main>
      <Section
        headline={page?.title || "Our People"}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
        cta={
          <Link
            href="/people/archive"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            View History →
          </Link>
        }
      >
        <div className="space-y-16">
          {orderedSections.map(section => (
            <div key={section.type}>
              <Subheading className="mb-8">{section.title}</Subheading>
              <div className="grid grid-cols-2 gap-x-2 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {section.people.map((person) => (
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
          ))}
        </div>
      </Section>
    </Main>
  );
}
