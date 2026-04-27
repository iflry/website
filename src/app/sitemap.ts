import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { routing } from "@/src/i18n/routing";
import { SITE_URL } from "@/src/lib/site-url";

const BASE_URL = SITE_URL;

const postSlugsQuery = defineQuery(
  `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, language }`
);

const eventSlugsQuery = defineQuery(
  `*[_type == "event" && defined(slug.current)]{ "slug": slug.current, language }`
);

const pageSlugsQuery = defineQuery(
  `*[_type == "page" && defined(slug.current)]{ "slug": slug.current, language }`
);

const programmeSlugsQuery = defineQuery(
  `*[_type == "programmePage" && defined(slug.current)]{ "slug": slug.current, language }`
);

const vacancySlugsQuery = defineQuery(
  `*[_type == "vacancy" && defined(slug.current)]{ "slug": slug.current, language }`
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events, pages, programmes, vacancies] = await Promise.all([
    client.fetch(postSlugsQuery, {}, { perspective: "published", useCdn: true }),
    client.fetch(eventSlugsQuery, {}, { perspective: "published", useCdn: true }),
    client.fetch(pageSlugsQuery, {}, { perspective: "published", useCdn: true }),
    client.fetch(programmeSlugsQuery, {}, { perspective: "published", useCdn: true }),
    client.fetch(vacancySlugsQuery, {}, { perspective: "published", useCdn: true }),
  ]);

  const staticRoutes = [
    "",
    "/events",
    "/posts",
    "/people",
    "/members",
    "/partners",
    "/programmes",
    "/trainers",
    "/documents",
    "/donation",
    "/vacancies",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes for each locale
  for (const route of staticRoutes) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic post routes
  for (const post of posts) {
    const locale = post.language || routing.defaultLocale;
    entries.push({
      url: `${BASE_URL}/${locale}/posts/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Dynamic event routes
  for (const event of events) {
    const locale = event.language || routing.defaultLocale;
    entries.push({
      url: `${BASE_URL}/${locale}/events/${event.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Dynamic page routes
  for (const page of pages) {
    const locale = page.language || routing.defaultLocale;
    entries.push({
      url: `${BASE_URL}/${locale}/pages/${page.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Dynamic programme routes
  for (const programme of programmes) {
    const locale = programme.language || routing.defaultLocale;
    entries.push({
      url: `${BASE_URL}/${locale}/programmes/${programme.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Dynamic vacancy routes
  for (const vacancy of vacancies) {
    const locale = vacancy.language || routing.defaultLocale;
    entries.push({
      url: `${BASE_URL}/${locale}/vacancies/${vacancy.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
