import { cache } from "react";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  knowledgeArticlesByLanguageQuery,
  knowledgeArticlesByLanguageNavQuery,
  knowledgeArticleBySlugQuery,
  knowledgeArticleChildrenQuery,
  knowledgeSearchQuery,
} from "@/sanity/lib/queries";

export type KnowledgeArticleSummary = {
  _id: string;
  title: string;
  slug: string;
  parentId?: string | null;
  order?: number | null;
  /** Present when fetched from CMS; used for nav (sidebar) lock state. */
  private?: boolean | null;
  /** Plain-text body; used for hub cards and search excerpts. */
  plain?: string | null;
};

export type KnowledgeSearchHit = KnowledgeArticleSummary & {
  excerpt: string;
};

export function excerptFromPlainText(plain: string | null | undefined, max = 220): string {
  const t = (plain ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export type KnowledgeTreeNode = KnowledgeArticleSummary & {
  children: KnowledgeTreeNode[];
};

export const getKnowledgeArticles = cache(async (language: string, includePrivate: boolean) => {
  const rows = await sanityFetch({
    query: knowledgeArticlesByLanguageQuery,
    params: { language, includePrivate },
    stega: false,
  });
  return (rows ?? []) as KnowledgeArticleSummary[];
});

/** All articles for sidebar / tree, including private (visibility styling handled in UI). */
export const getKnowledgeArticlesForNavigation = cache(async (language: string) => {
  const rows = await sanityFetch({
    query: knowledgeArticlesByLanguageNavQuery,
    params: { language },
    stega: false,
  });
  return (rows ?? []) as KnowledgeArticleSummary[];
});

export function buildKnowledgeTree(flat: KnowledgeArticleSummary[]): KnowledgeTreeNode[] {
  const byId = new Map<string, KnowledgeArticleSummary>();
  for (const row of flat) {
    byId.set(row._id, row);
  }

  const childMap = new Map<string | undefined, KnowledgeArticleSummary[]>();
  for (const row of flat) {
    const parentKey =
      row.parentId && byId.has(row.parentId) ? row.parentId : undefined;
    const list = childMap.get(parentKey) ?? [];
    list.push(row);
    childMap.set(parentKey, list);
  }

  const sortSiblings = (a: KnowledgeArticleSummary, b: KnowledgeArticleSummary) => {
    const oa = a.order ?? 0;
    const ob = b.order ?? 0;
    if (oa !== ob) return oa - ob;
    return a.title.localeCompare(b.title);
  };

  function attachChildren(row: KnowledgeArticleSummary): KnowledgeTreeNode {
    const rawKids = childMap.get(row._id) ?? [];
    const kids = [...rawKids].sort(sortSiblings).map(attachChildren);
    return { ...row, children: kids };
  }

  const rootsRaw = childMap.get(undefined) ?? [];
  const roots = [...rootsRaw].sort(sortSiblings);
  return roots.map(attachChildren);
}

export type KnowledgeParentChain = {
  title: string;
  slug: string;
  parent?: KnowledgeParentChain | null;
} | null;

export function ancestorsFromParentChain(
  chain: KnowledgeParentChain,
  locale: string,
): { label: string; href: string }[] {
  const acc: { label: string; href: string }[] = [];
  let node: KnowledgeParentChain = chain;
  while (node) {
    acc.push({
      label: node.title,
      href: `/${locale}/knowledge/${node.slug}`,
    });
    node = node.parent ?? null;
  }
  acc.reverse();
  return acc;
}

export type KnowledgeChildCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
};

export async function getKnowledgeArticleChildren(
  parentId: string,
  language: string,
  includePrivate: boolean,
): Promise<KnowledgeChildCard[]> {
  const rows = (await sanityFetch({
    query: knowledgeArticleChildrenQuery,
    params: { parentId, language, includePrivate },
    stega: false,
  })) as { _id: string; title: string; slug: string; plain?: string }[];
  return (rows ?? []).map((row) => ({
    _id: row._id,
    title: row.title,
    slug: row.slug,
    excerpt: excerptFromPlainText(row.plain),
  }));
}

export async function getKnowledgeArticleBySlug(slug: string, language: string) {
  return sanityFetch({
    query: knowledgeArticleBySlugQuery,
    params: { slug, language },
    stega: false,
  });
}

export async function searchKnowledgeArticles(
  language: string,
  terms: string,
  includePrivate: boolean,
): Promise<KnowledgeSearchHit[]> {
  const trimmed = terms.trim();
  if (!trimmed) return [];
  const rows = (await sanityFetch({
    query: knowledgeSearchQuery,
    params: { language, terms: trimmed, includePrivate },
    stega: false,
  })) as (KnowledgeArticleSummary & { plain?: string })[];
  return (rows ?? []).map((row) => ({
    _id: row._id,
    title: row.title,
    slug: row.slug,
    parentId: row.parentId,
    order: row.order,
    excerpt: excerptFromPlainText(row.plain),
  }));
}
