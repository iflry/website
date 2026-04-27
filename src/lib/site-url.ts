/**
 * Canonical absolute URL for the public site.
 *
 * Set `NEXT_PUBLIC_SITE_URL` per environment (e.g. `https://iflry.org` in
 * production, `https://new.iflry.org` for the staging deploy). The fallback
 * keeps current staging behaviour for local dev when the env var is unset.
 *
 * Always exported without a trailing slash, so callers can do
 * `${SITE_URL}/en/posts/foo` safely.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://new.iflry.org"
).replace(/\/$/, "");
