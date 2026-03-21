"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon, XIcon, ChevronDownIcon } from "lucide-react"

interface NavigationItemData {
  title?: string | null
  linkType?: "page" | "events" | "posts" | "trainers" | "vacancies" | "custom" | "submenu" | null
  page?: {
    language?: string | null
    slug?: { current?: string | null } | null
    type?: "other" | "programmes" | "members" | "partners" | "people" | "trainers" | "vacancies" | null
  } | null
  customUrl?: string | null
  children?: NavigationItemData[] | null
}

function resolveHref(item: NavigationItemData, language: string): string {
  switch (item.linkType) {
    case "page":
      const locale = item.page?.language || language
      if (item.page?.type === "members") return `/${locale}/members`
      if (item.page?.type === "partners") return `/${locale}/partners`
      if (item.page?.type === "programmes") return `/${locale}/programmes`
      if (item.page?.type === "people") return `/${locale}/people`
      return `/${locale}/pages/${item.page?.slug?.current}`
    case "events":
      return `/${language}/events`
    case "posts":
      return `/${language}/posts`
    case "trainers":
      return `/${language}/trainers`
    case "vacancies":
      return `/${language}/vacancies`
    case "custom":
      return item.customUrl || `/${language}`
    default:
      return `/${language}`
  }
}

function MobileNavItem({
  item,
  language,
  onNavigate,
}: {
  item: NavigationItemData
  language: string
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)

  if (item.linkType === "submenu" && item.children?.length) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between py-3 text-lg font-medium"
        >
          {item.title}
          <ChevronDownIcon
            className={`size-5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="space-y-1 pb-2 pl-4">
            {item.children.map((child, i) => (
              <MobileNavChild
                key={i}
                item={child}
                language={language}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={resolveHref(item, language)}
      onClick={onNavigate}
      className="block py-3 text-lg font-medium"
    >
      {item.title}
    </Link>
  )
}

function MobileNavChild({
  item,
  language,
  onNavigate,
}: {
  item: NavigationItemData
  language: string
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)

  if (item.linkType === "submenu" && item.children?.length) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between py-2 text-base text-gray-700"
        >
          {item.title}
          <ChevronDownIcon
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="space-y-1 pb-1 pl-4">
            {item.children.map((child, i) => (
              <MobileNavChild
                key={i}
                item={child}
                language={language}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={resolveHref(item, language)}
      onClick={onNavigate}
      className="block py-2 text-base text-gray-700"
    >
      {item.title}
    </Link>
  )
}

export default function MobileNavigation({
  navigation,
  language,
}: {
  navigation: NavigationItemData[]
  language: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative inline-flex size-10 items-center justify-center rounded-md hover:bg-gray-100"
      >
        {isOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-0 z-50 bg-white">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <div />
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <XIcon className="size-6" />
            </button>
          </div>
          <nav className="px-4 sm:px-6 lg:px-8">
            <div className="divide-y divide-gray-100">
              {navigation.map((item, index) => (
                <MobileNavItem
                  key={index}
                  item={item}
                  language={language}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
