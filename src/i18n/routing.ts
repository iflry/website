import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  // Disable the NEXT_LOCALE cookie so responses are cacheable by Vercel's CDN.
  // Without this, every page response carries Set-Cookie which forces
  // cache-control: private, no-store and bypasses the edge cache.
  localeCookie: false,
})