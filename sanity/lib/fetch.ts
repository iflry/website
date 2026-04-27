import "server-only";

import type { QueryParams } from "next-sanity";
import { cache } from "react";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/**
 * Request-scoped draft state. React's `cache()` returns the same object
 * within a single request, so calling `enableDraftFetch()` from a layout
 * makes any subsequent `sanityFetch` call in the same request fetch drafts.
 *
 * This avoids calling `draftMode()` inside `sanityFetch` itself, which
 * would opt every page into dynamic rendering and disable CDN caching.
 */
const draftState = cache(() => ({ enabled: false }));

export function enableDraftFetch() {
  draftState().enabled = true;
}

export function isDraftFetchEnabled() {
  return draftState().enabled;
}

/**
 * Extract Sanity document types from a GROQ query string for tag-based
 * cache invalidation. The `/api/revalidate` webhook fires
 * `revalidateTag(_type)` whenever a document of that type changes.
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
 * Fetch from Sanity in a Server Component.
 *
 * - In the public path, returns published content with tag-based revalidation.
 *   The page is fully static and CDN-cached until a webhook invalidates the tag.
 * - In the `/preview/*` path, the layout calls `enableDraftFetch()` first, so
 *   this fetcher returns drafts with stega encoding for Visual Editing.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  perspective: _perspective,
  stega: _stega,
  tags: _tags,
}: {
  query: QueryString;
  params?: QueryParams | Promise<QueryParams>;
  perspective?: "published" | "drafts";
  stega?: boolean;
  tags?: string[];
}) {
  const isDraft = isDraftFetchEnabled();
  const perspective = _perspective ?? (isDraft ? "drafts" : "published");

  if (perspective === "drafts") {
    return client.fetch(query, await params, {
      stega: _stega ?? true,
      perspective: "drafts",
      token,
      useCdn: false,
      next: { revalidate: 0 },
    });
  }

  const tags = _tags ?? extractTypeTags(query);
  return client.fetch(query, await params, {
    stega: _stega ?? false,
    perspective: "published",
    useCdn: true,
    next: { tags },
  });
}
