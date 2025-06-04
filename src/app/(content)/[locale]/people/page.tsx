import { sanityFetch } from "@/sanity/lib/fetch";
import { peopleQuery } from "@/sanity/lib/queries";
import RoleView, { RoleType, BureauRole, OfficeRole } from "./role-view";
import { getTranslations } from "next-intl/server";

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

export default async function PeoplePage() {
  const t = await getTranslations()
  const currentDate = new Date().toISOString()
  const people = await sanityFetch({ query: peopleQuery, params: { date: currentDate } })
  const peopleByType: Record<string, any[]> = {};
  people.forEach(person => {
    if (person.type) {
      if (!peopleByType[person.type]) {
        peopleByType[person.type] = [];
      }
      peopleByType[person.type].push(person);
    }
  });

  const typeOrder: Record<RoleType, { order: number, title: string }> = {
    "bureau-member": { order: 1, title: t("bureau") },
    "regional-representative": { order: 2, title: t("regional-representatives") },
    "office": { order: 3, title: t("office") },
    "honorary-member": { order: 4, title: t("honorary-members") },
    "ombudsperson": { order: 5, title: t("ombudsperson") },
    "advisory-council": { order: 6, title: t("advisory-council") },
    "individual-member": { order: 7, title: t("individual-members") }
  };
  
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
    <div className="container mx-auto px-5">      
      {orderedSections.map(section => (
        <div key={section.type} className="mb-16">
          <h3 className="mb-8 text-3xl font-bold">{section.title}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
  );
}
