import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenuTrigger, 
    navigationMenuTriggerStyle 
  } from "@/src/components/ui/navigation-menu";

import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

interface NavigationItemData {
  title?: string | null;
  linkType?: "page" | "events" | "posts" | "trainers" | "vacancies" | "custom" | "submenu" | null;
  page?: {
    language?: string | null;
    slug?: { current?: string | null } | null;
    type?: "other" | "programmes" | "members" | "partners" | "people" | "trainers" | "vacancies" | null;
  } | null;
  customUrl?: string | null;
  children?: NavigationItemData[] | null;
}

function resolveNavigationHref(item: NavigationItemData, language: string): string {  
  switch (item.linkType) {
    case "page":
      const locale = item.page?.language || language;
      if (item.page?.type === "members") return `/${locale}/members`;
      if (item.page?.type === "partners") return `/${locale}/partners`;
      if (item.page?.type === "programmes") return `/${locale}/programmes`;
      if (item.page?.type === "people") return `/${locale}/people`;
      return `/${locale}/pages/${item.page?.slug?.current}`
    case "events":
      return `/${language}/events`;
    case "posts":
      return `/${language}/posts`;
    case "trainers":
      return `/${language}/trainers`;
    case "vacancies":
      return `/${language}/vacancies`;
    case "custom":
      return item.customUrl || `/${language}`;
    default:
      return `/${language}`;
  }
}

function renderNavigationItem(item: NavigationItemData, index: number, language: string) {
  if (item.linkType === "submenu" && item.children?.length) {
    return (
      <NavigationMenuItem key={index}>
        <NavigationMenuTrigger>
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="space-y-1 w-[160px]">
            {item.children.map((child: NavigationItemData, childIndex: number) => 
              renderNavigationChild(child, childIndex, language)
            )}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={index}>
      <NavigationMenuLink 
        href={resolveNavigationHref(item, language)} 
        className={navigationMenuTriggerStyle()}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function renderNavigationChild(item: NavigationItemData, index: number, language: string) {
  if (item.linkType === "submenu" && item.children?.length) {
    return (
      <div key={index} className="space-y-1">
        <div className="font-medium text-sm px-3 py-2 text-gray-700">
          {item.title}
        </div>
        <div className="pl-3 space-y-1">
          {item.children.map((child: NavigationItemData, childIndex: number) => 
            renderNavigationChild(child, childIndex, language)
          )}
        </div>
      </div>
    );
  }

  return (
    <NavigationMenuLink 
      key={index}
      href={resolveNavigationHref(item, language)}
      className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
    >
      {item.title}
    </NavigationMenuLink>
  );
}

export default async function Navigation(params: { language: string }) {
  const data = await sanityFetch({ 
    query: settingsQuery, 
    params: { language: params.language } 
  });
  const navigation = data?.navigation || [];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigation.map((item: NavigationItemData, index: number) => 
          renderNavigationItem(item, index, params.language)
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
