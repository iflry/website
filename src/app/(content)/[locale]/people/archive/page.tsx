import { sanityFetch } from "@/sanity/lib/fetch";
import { peopleArchiveQuery } from "@/sanity/lib/queries";
import RoleView from "../role-view";
import DateComponent from "@/src/components/date";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Text } from "@/src/components/elements/text";

export default async function PeopleArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentDate = new Date().toISOString();
  const people = await sanityFetch({
    query: peopleArchiveQuery,
    params: { currentDate },
  });

  return (
    <Main>
      <Section
        headline="People History"
        subheadline={
          <Text>
            Past roles and positions in IFLRY
          </Text>
        }
      >
        {people && people.length > 0 ? (
        <div className="space-y-6">
          {people.map((person) => (
            <div
              key={person._id}
              className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:flex-row"
            >
              <RoleView
                picture={person.picture}
                name={person.name}
                title={person.title}
                email={person.email}
                type={person.type}
                bureauRole={person.bureauRole}
                officeRole={person.officeRole}
              />
              <div className="flex flex-1 flex-col justify-center md:ml-4">
                {person.organization && (
                  <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Organization: </span>
                    {person.organization}
                  </div>
                )}
                {person.start && person.end && (
                  <div className="text-sm text-gray-600">
                    <DateComponent dateString={person.start} />
                    {" - "}
                    <DateComponent dateString={person.end} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No past roles</h3>
              <p className="mt-2 text-sm text-gray-500">
                There are no past roles in the archive yet.
              </p>
            </div>
          </div>
        )}
      </Section>
    </Main>
  );
}
