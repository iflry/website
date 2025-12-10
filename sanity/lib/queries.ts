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
    }
  }
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  image,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const featuredPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && language == $language] | order(date desc, _updatedAt desc) [0...$quantity] {
    content,
    ${postFields}
  }
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
  *[_type == "partner"] {
    _id,
    "title": coalesce(title, "Untitled"),
    "logo": logo.asset->url,
    description
  }
`)

export const programmesQuery = defineQuery(`
  *[_type == "programme"] {
    _id,
    email,
    "title": coalesce(title, "Untitled"),
    description,
    "managers": managers[]->{
      _id,
      "name": coalesce(name, "Untitled"),
      "picture": picture.asset->url
    }
  }
`)

const roleFields = /* groq */ `
  _id,
  type,
  email,
  title,
  bureauRole,
  officeRole,
  organization,
  "name": person->name,
  "picture": person->picture.asset->url
`;

export const peopleQuery = defineQuery(`
  *[_type == "role" && dateTime($date) >= dateTime(start + 'T00:00:00Z') && (dateTime($date) < dateTime(end + 'T00:00:00Z') || !defined(end))] {
    ${roleFields}
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

export const vacanciesQuery = defineQuery(`
  *[_type == "vacancy" && language == $language] | order(deadline asc) {
    _id,
    "title": coalesce(title, "Untitled"),
    description,
    location,
    applicationUrl,
    deadline
  }
`)

export const trainersQuery = defineQuery(`
  *[_type == "trainer"] {
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

export const membersQuery = defineQuery(`
  *[_type == "member"] {
    _id,
    memberId,
    name,
    "logo": logo.asset->url,
    website,
    wiki,
    fb,
    twitter,
    ig
  }
`)