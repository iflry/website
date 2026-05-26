"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type { KnowledgeTreeNode } from "@/src/lib/knowledge-data";

function TreeBranch({
  nodes,
  locale,
  activeSlug,
  privateUnlocked,
}: {
  nodes: KnowledgeTreeNode[];
  locale: string;
  activeSlug: string | null;
  privateUnlocked: boolean;
}) {
  const t = useTranslations("Knowledge");

  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const href = `/${locale}/knowledge/${node.slug}`;
        const isActive = activeSlug === node.slug;
        const isPrivate = Boolean(node.private);
        const locked = isPrivate && !privateUnlocked;

        const stateClasses = locked
          ? isActive
            ? "bg-gray-50 font-medium text-gray-500"
            : "text-gray-400 hover:bg-gray-50/80 hover:text-gray-500"
          : isActive
            ? "bg-gray-100 font-medium text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

        return (
          <li key={node._id}>
            <Link
              href={href}
              title={locked ? t("privateNavHint") : undefined}
              aria-label={locked ? `${node.title} (${t("privateNavLabel")})` : undefined}
              className={`flex items-center gap-2 rounded-md py-1.5 text-sm transition-colors ${stateClasses}`}
            >
              {locked ? (
                <LockIcon className="size-3.5 shrink-0 text-gray-400" aria-hidden />
              ) : null}
              <span className="min-w-0 flex-1 truncate">{node.title}</span>
            </Link>
            {node.children.length > 0 ? (
              <div className="mt-1 border-l border-gray-200 pl-3">
                <TreeBranch
                  nodes={node.children}
                  locale={locale}
                  activeSlug={activeSlug}
                  privateUnlocked={privateUnlocked}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function knowledgeSlugFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const parts = pathname.split("/").filter(Boolean);
  const k = parts.indexOf("knowledge");
  if (k === -1) return null;
  const slug = parts[k + 1];
  return slug && slug.length > 0 ? slug : null;
}

export function KnowledgeSidebar({
  tree,
  locale,
  hubLabel,
  privateUnlocked,
}: {
  tree: KnowledgeTreeNode[];
  locale: string;
  hubLabel: string;
  privateUnlocked: boolean;
}) {
  const pathname = usePathname();
  const activeSlug = knowledgeSlugFromPath(pathname);
  const hubPath = `/${locale}/knowledge`;
  const onHub =
    pathname === hubPath || pathname === `${hubPath}/`;

  return (
    <nav aria-label={hubLabel} className="text-sm">
      <Link
        href={hubPath}
        className={`mb-3 block rounded-md py-2 text-sm font-medium ${
          onHub && activeSlug === null
            ? "bg-gray-100 text-gray-900"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        {hubLabel}
      </Link>
      {tree.length > 0 ? (
        <TreeBranch
          nodes={tree}
          locale={locale}
          activeSlug={activeSlug}
          privateUnlocked={privateUnlocked}
        />
      ) : (
        <p className="text-gray-500">—</p>
      )}
    </nav>
  );
}

export function KnowledgeSidebarMobile({
  tree,
  locale,
  hubLabel,
  title,
  privateUnlocked,
}: {
  tree: KnowledgeTreeNode[];
  locale: string;
  hubLabel: string;
  title: string;
  privateUnlocked: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-medium text-gray-900"
        aria-expanded={open}
      >
        {title}
        <ChevronDownIcon className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <KnowledgeSidebar
            tree={tree}
            locale={locale}
            hubLabel={hubLabel}
            privateUnlocked={privateUnlocked}
          />
        </div>
      ) : null}
    </div>
  );
}
