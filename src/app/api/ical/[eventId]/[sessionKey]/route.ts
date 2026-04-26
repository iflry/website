import { sanityFetch } from "@/sanity/lib/fetch";
import { gaPreSessionQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const fmt = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const esc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/([,;])/g, "\\$1")
    .replace(/\r?\n/g, "\\n");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string; sessionKey: string }> },
) {
  const { eventId, sessionKey } = await params;

  const event = await sanityFetch({
    query: gaPreSessionQuery,
    params: { id: eventId, sessionKey },
    stega: false,
  });
  const session = event?.preSessions?.[0];
  if (!event || !session?.date || !session.title) {
    return new Response("Not found", { status: 404 });
  }

  const start = new Date(session.date);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const url = `https://new.iflry.org/${event.language}/ga/${event.slug}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IFLRY//GA Pre-Sessions//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${eventId}-${sessionKey}@iflry.org`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(session.title)}`,
    `DESCRIPTION:${esc(`${session.description ?? ""}\n\nMore info: ${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const safeName = session.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeName || "session"}.ics"`,
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
