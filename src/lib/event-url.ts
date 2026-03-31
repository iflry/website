export function getEventUrl(locale: string, slug: string, type?: string): string {
  if (type === "ga") {
    return `/${locale}/ga/${slug}`;
  }
  return `/${locale}/events/${slug}`;
}
