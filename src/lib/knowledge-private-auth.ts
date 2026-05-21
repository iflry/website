import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const KNOWLEDGE_PRIVATE_COOKIE_NAME = "iflry_knowledge_private_v1";

const COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function signingSecret(): string | null {
  const password = process.env.KNOWLEDGE_PRIVATE_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", "iflry-knowledge-private-cookie").update(password).digest("hex");
}

/** True when private knowledge articles can be unlocked (password is set). */
export function isKnowledgePrivatePasswordConfigured(): boolean {
  return Boolean(process.env.KNOWLEDGE_PRIVATE_PASSWORD?.length);
}

/**
 * Creates a signed cookie value: base64url(expiryMs).base64url(hmac)
 * Returns null if the server cannot sign (no password / secret material).
 */
export function createKnowledgePrivateCookieValue(): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const exp = Date.now() + COOKIE_TTL_MS;
  const payload = String(exp);
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  const b64 = Buffer.from(payload, "utf8").toString("base64url");
  return `${b64}.${sig}`;
}

export function verifyKnowledgePrivateCookieValue(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const secret = signingSecret();
  if (!secret) return false;
  const dot = token.indexOf(".");
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expectedSig = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expectedSig, "utf8");
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const exp = Number.parseInt(payload, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export async function readKnowledgePrivateUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return verifyKnowledgePrivateCookieValue(jar.get(KNOWLEDGE_PRIVATE_COOKIE_NAME)?.value);
}
