import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/**
 * Extract Sanity document types from a GROQ query string.
 * Looks for patterns like `_type == "post"` to generate cache tags.
 */
function extractTypeTags(query: string): string[] {
  const matches = query.matchAll(/_type\s*==\s*"(\w+)"/g);
  const types = new Set<string>();
  for (const match of matches) {
    types.add(match[1]);
  }
  return types.size > 0 ? Array.from(types) : ["sanity"];
}

/**
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective, tag-based revalidation is used so pages stay cached until
 * a Sanity webhook triggers on-demand revalidation for the relevant content type.
 * When using the "drafts" perspective then the data is fetched from the live API and isn't cached, it will also fetch draft content that isn't published yet.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  perspective: _perspective,
  /**
   * Stega embedded Content Source Maps are used by Visual Editing by both the Sanity Presentation Tool and Vercel Visual Editing.
   * The Sanity Presentation Tool will enable Draft Mode when loading up the live preview, and we use it as a signal for when to embed source maps.
   * When outside of the Sanity Studio we also support the Vercel Toolbar Visual Editing feature, which is only enabled in production when it's a Vercel Preview Deployment.
   */
  stega: _stega,
  tags: _tags,
}: {
  query: QueryString;
  params?: QueryParams | Promise<QueryParams>;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
  tags?: string[];
}) {
  const perspective =
    _perspective || (await draftMode()).isEnabled
      ? "drafts"
      : "published";
  const stega =
    _stega ||
    perspective === "drafts" ||
    process.env.VERCEL_ENV === "preview";
  if (perspective === "drafts") {
    return client.fetch(query, await params, {
      stega,
      perspective: "drafts",
      // The token is required to fetch draft content
      token,
      // The `drafts` perspective isn't available on the API CDN
      useCdn: false,
      // And we can't cache the responses as it would slow down the live preview experience
      next: { revalidate: 0 },
    });
  }
  // Auto-detect content type tags from the query, or use manually provided tags
  const tags = _tags ?? extractTypeTags(query);
  return client.fetch(query, await params, {
    stega,
    perspective: "published",
    // The `published` perspective is available on the API CDN
    useCdn: true,
    // Use tag-based revalidation: pages stay cached until a Sanity webhook
    // triggers revalidateTag() for the relevant content type
    next: { tags },
  });
}
