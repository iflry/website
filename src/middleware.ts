import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Cookie name set by Next.js when draft mode is enabled via /api/draft-mode/enable.
const DRAFT_MODE_COOKIE = "__prerender_bypass";

export default function middleware(request: NextRequest) {
  const isDraft = request.cookies.has(DRAFT_MODE_COOKIE);
  const path = request.nextUrl.pathname;

  // Editors with the draft cookie are rewritten to the (draft)/preview route
  // group, which forces dynamic rendering and fetches drafts. Public visitors
  // fall through to the (content) route group, which is fully CDN-cacheable.
  if (isDraft && !path.startsWith("/preview")) {
    // Ensure the path includes a locale prefix; the (draft) route is
    // /preview/[locale]/...
    const firstSegment = path.split("/").filter(Boolean)[0];
    const hasLocale = (routing.locales as readonly string[]).includes(
      firstSegment ?? "",
    );
    const localePath = hasLocale
      ? path
      : `/${routing.defaultLocale}${path === "/" ? "" : path}`;

    const url = request.nextUrl.clone();
    url.pathname = `/preview${localePath}`;
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|studio|trpc|_next|_vercel|.*\\..*).*)",
};
