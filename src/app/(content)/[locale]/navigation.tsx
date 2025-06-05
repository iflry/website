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
  linkType?: "page" | "events" | "posts" | "custom" | "submenu" | null;
  page?: {
    slug?: { current?: string | null } | null;
    type?: "other" | "programmes" | "members" | "partners" | "people" | null;
  } | null;
  customUrl?: string | null;
  children?: NavigationItemData[] | null;
}

function resolveNavigationHref(item: NavigationItemData): string {  
  switch (item.linkType) {
    case "page":
      if (item.page?.type === "members") return `/members`;
      if (item.page?.type === "partners") return `/partners`;
      if (item.page?.type === "programmes") return `/programmes`;
      if (item.page?.type === "people") return `/people`;
      return `/pages/${item.page?.slug?.current}`
    case "events":
      return "/events";
    case "posts":
      return "/posts";
    case "custom":
      return item.customUrl || "/";
    default:
      return "/";
  }
}

function renderNavigationItem(item: NavigationItemData, index: number) {
  if (item.linkType === "submenu" && item.children?.length) {
    return (
      <NavigationMenuItem key={index}>
        <NavigationMenuTrigger>
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="w-[200px] p-2">
          <div className="space-y-1">
            {item.children.map((child: NavigationItemData, childIndex: number) => 
              renderNavigationChild(child, childIndex)
            )}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={index}>
      <NavigationMenuLink 
        href={resolveNavigationHref(item)} 
        className={navigationMenuTriggerStyle()}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function renderNavigationChild(item: NavigationItemData, index: number) {
  if (item.linkType === "submenu" && item.children?.length) {
    return (
      <div key={index} className="space-y-1">
        <div className="font-medium text-sm px-3 py-2 text-gray-700">
          {item.title}
        </div>
        <div className="pl-3 space-y-1">
          {item.children.map((child: NavigationItemData, childIndex: number) => 
            renderNavigationChild(child, childIndex)
          )}
        </div>
      </div>
    );
  }

  return (
    <NavigationMenuLink 
      key={index}
      href={resolveNavigationHref(item)}
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
          renderNavigationItem(item, index)
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
