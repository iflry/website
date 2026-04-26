import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`
  *[_type == "configuration" && language == $language][0] {
    ...,
    navigation[] {
      title,
      linkType,
      page-> {
        slug,
        type
      },
      customUrl,
      children[] {
        title,
        linkType,
        page-> {
          slug,
          type
        },
        customUrl,
        children[] {
          title,
          linkType,
          page-> {
            slug,
            type
          },
          customUrl,
          children[] {
            title,
            linkType,
            page-> {
              slug,
              type
            },
            customUrl
          }
        }
      }
    },
    announcementBanner {
      enabled,
      text,
      cta,
      href
    },
    footer {
      fineprint,
      columns[] {
        title,
        links[] {
          title,
          linkType,
          page-> {
            slug,
            type
          },
          customUrl
        }
      },
      socialLinks[] {
        platform,
        url
      }
    }
  }
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  type,
  image,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
  "attachments": attachments[]{ "title": coalesce(title, "Document"), "url": asset->url },
`;

export const featuredPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && language == $language] | order(date desc, _updatedAt desc) [0...$quantity] {
    content,
    ${postFields}
  }
`);

export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && language == $language && ($type == "" || type == $type)] | order(date desc, _updatedAt desc) [$offset...$limit] {
    ${postFields}
  }
`);

export const postsCountQuery = defineQuery(`
  count(*[_type == "post" && defined(slug.current) && language == $language && ($type == "" || type == $type)])
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current) && language == $language] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $language] [0] {
    content,
    ${postFields}
  }
`);

export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $language] [0] {
    _id,
    content,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
  }
`);

export const pageTypeQuery = defineQuery(`
  *[_type == "page" && type == $type && language == $language] [0] {
    _id,
    content,
    "title": coalesce(title, "Untitled"),
  }
`)

export const partnersQuery = defineQuery(`
  *[_type == "partner" && displayAsPartner == true] {
    _id,
    "title": coalesce(title, "Untitled"),
    "logo": logo.asset->url,
    description
  }
`)

export const donationItemsQuery = defineQuery(`
  *[_type == "donationItem"] | order(order asc) {
    _id,
    "title": coalesce(title, "Untitled"),
    description,
    "imageUrl": image.asset->url,
    "programme": programme->{ _id, name },
    amount,
    oneOffLink,
    recurringLink
  }
`)

export const coreDocumentsQuery = defineQuery(`
  *[_type == "coreDocument"] | order(order asc) {
    _id,
    "title": coalesce(title, "Untitled"),
    description,
    "fileUrl": file.asset->url
  }
`)

export const programmesQuery = defineQuery(`
  *[_type == "programme"] {
    _id,
    email,
    "title": coalesce(title, "Untitled"),
    "managers": managers[]->{
      _id,
      "name": coalesce(name, "Untitled"),
      "picture": picture.asset->url
    },
    "page": *[_type == "programmePage" && programme._ref == ^._id && language == $language][0] {
      "slug": slug.current,
      description
    }
  }
`)

export const programmePageQuery = defineQuery(`
  *[_type == "programmePage" && slug.current == $slug && language == $language][0] {
    _id,
    "slug": slug.current,
    description,
    "programme": programme->{
      _id,
      "title": coalesce(title, "Untitled"),
      email,
      "managers": managers[]->{
        _id,
        "name": coalesce(name, "Untitled"),
        picture,
        biography
      }
    }
  }
`)

export const eventsByProgrammeQuery = defineQuery(`
  *[_type == "event" && programme._ref == $programmeId && language == $language] | order(start desc) {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    type,
    location,
    start,
    end,
    "image": image.asset->url,
    description
  }
`)

export const peopleQuery = defineQuery(`
  *[_type == "role" && dateTime($date) >= dateTime(start + 'T00:00:00Z') && (dateTime($date) < dateTime(end + 'T00:00:00Z') || !defined(end))] {
    _id,
    type,
    email,
    title,
    bureauRole,
    officeRole,
    "organization": organization->name,
    "name": person->name,
    "picture": person->picture.asset->url,
    "biography": person->biography
  }
`)

export const peopleArchiveQuery = defineQuery(`
  *[_type == "role" && defined(end) && dateTime(end + 'T00:00:00Z') < dateTime($currentDate)] | order(end desc) {
    _id,
    type,
    email,
    title,
    bureauRole,
    officeRole,
    "organization": organization->name,
    "name": person->name,
    "picture": person->picture.asset->url,
    start,
    end
  }
`)

export const eventsQuery = defineQuery(`
  *[_type == "event" && language == $language] | order(start desc) {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    type,
    location,
    start,
    end,
    "image": image.asset->url,
    description,
    "contactPerson": {
      "person": contactPerson.person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url
      },
      "email": contactPerson.email
    },
    "trainers": trainers[]->{
      _id,
      email,
      expertises,
      languages,
      "person": person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url,
        biography
      }
    }
  }
`)

const eventFields = /* groq */ `
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  type,
  location,
  start,
  end,
  "image": image.asset->url,
  description,
  "contactPerson": {
    "person": contactPerson.person->{
      _id,
      "name": coalesce(name, "Untitled"),
      "picture": picture.asset->url
    },
    "email": contactPerson.email
  },
  registrationLink,
  registrationDeadline,
  "attachments": attachments[]{ "title": coalesce(title, "Document"), "url": asset->url },
  "trainers": trainers[]->{
    _id,
    email,
    expertises,
    languages,
    "person": person->{
      _id,
      "name": coalesce(name, "Untitled"),
      "picture": picture.asset->url,
      biography
    }
  }
`;

export const upcomingEventsQuery = defineQuery(`
  *[_type == "event" && language == $language && dateTime(start) >= dateTime($currentDate)] | order(start asc) [$offset...$limit] {
    ${eventFields}
  }
`)

export const upcomingEventsCountQuery = defineQuery(`
  count(*[_type == "event" && language == $language && dateTime(start) >= dateTime($currentDate)])
`)

export const pastEventsQuery = defineQuery(`
  *[_type == "event" && language == $language && dateTime(start) < dateTime($currentDate)] | order(start desc) [$offset...$limit] {
    ${eventFields}
  }
`)

export const pastEventsCountQuery = defineQuery(`
  count(*[_type == "event" && language == $language && dateTime(start) < dateTime($currentDate)])
`)

export const eventQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug && language == $language] [0] {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    type,
    location,
    start,
    end,
    image,
    description,
    "contactPerson": {
      "person": contactPerson.person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url
      },
      "email": contactPerson.email
    },
    "programme": programme->{
      _id,
      "title": coalesce(title, "Untitled"),
      email
    },
    "partners": partners[]->{
      _id,
      "title": coalesce(title, "Untitled"),
      "logo": logo.asset->url,
      description
    },
    "members": members[]->{
      _id,
      _type,
      name,
      memberId,
      "logo": logo.asset->url
    },
    registrationLink,
    registrationDeadline,
    "attachments": attachments[]{ "title": coalesce(title, "Document"), "url": asset->url },
    "trainers": trainers[]->{
      _id,
      email,
      expertises,
      languages,
      "person": person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url,
        biography
      }
    }
  }
`)

export const gaEventQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug && language == $language && type == "ga"][0] {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    type,
    location,
    start,
    end,
    image,
    description,
    "contactPerson": {
      "person": contactPerson.person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url
      },
      "email": contactPerson.email
    },
    "programme": programme->{
      _id,
      "title": coalesce(title, "Untitled"),
      email
    },
    "partners": partners[]->{
      _id,
      "title": coalesce(title, "Untitled"),
      "logo": logo.asset->url,
      description
    },
    "members": members[]->{
      _id,
      _type,
      name,
      memberId,
      "logo": logo.asset->url
    },
    registrationLink,
    registrationDeadline,
    "attachments": attachments[]{ "title": coalesce(title, "Document"), "url": asset->url },
    "trainers": trainers[]->{
      _id,
      email,
      expertises,
      languages,
      "person": person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url,
        biography
      }
    },
    deadlines,
    programmeHighlights,
    preSessions,
    visaNote,
    "additionalContacts": additionalContacts[]{
      "person": person->{
        _id,
        "name": coalesce(name, "Untitled"),
        "picture": picture.asset->url
      },
      email,
      role
    }
  }
`)

export const gaPreSessionQuery = defineQuery(`
  *[_type == "event" && _id == $id][0]{
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    language,
    location,
    "preSessions": preSessions[_key == $sessionKey]{
      _key,
      title,
      description,
      date
    }
  }
`)

export const gaEventSlugs = defineQuery(
  `*[_type == "event" && type == "ga" && defined(slug.current)]{"slug": slug.current, language}`
)

export const vacanciesQuery = defineQuery(`
  *[_type == "vacancy" && language == $language] | order(deadline asc) {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    image,
    location,
    deadline
  }
`)

export const vacancyQuery = defineQuery(`
  *[_type == "vacancy" && slug.current == $slug && language == $language][0] {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    description,
    image,
    location,
    applicationUrl,
    deadline
  }
`)

export const trainersQuery = defineQuery(`
  *[_type == "trainer" && displayAsTrainer == true] {
    _id,
    email,
    expertises,
    languages,
    "person": person->{
      _id,
      "name": coalesce(name, "Untitled"),
      picture,
      biography
    }
  }
`)

export const memberOrganisationsQuery = defineQuery(`
  *[_type == "memberOrganisation"] | order(name asc) {
    _id,
    name,
    memberId,
    country,
    countryName,
    membershipType,
    primaryRegion,
    secondaryRegion,
    votes,
    "logo": logo.asset->url,
    website,
    wiki,
    fb,
    twitter,
    ig
  }
`)

export const regionalNetworksQuery = defineQuery(`
  *[_type == "regionalNetwork"] | order(name asc) {
    _id,
    name,
    fullName,
    memberId,
    region,
    "logo": logo.asset->url,
    website,
    wiki,
    fb,
    twitter,
    ig
  }
`)