import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import {
  createKnowledgePrivateCookieValue,
  KNOWLEDGE_PRIVATE_COOKIE_NAME,
} from "@/src/lib/knowledge-private-auth";

export async function POST(request: Request) {
  const expected = process.env.KNOWLEDGE_PRIVATE_PASSWORD;
  if (!expected?.length) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password?: unknown }).password ?? "")
      : "";

  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }

  const token = createKnowledgePrivateCookieValue();
  if (!token) {
    return NextResponse.json({ error: "signing_failed" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(KNOWLEDGE_PRIVATE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
