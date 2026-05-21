"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function KnowledgePrivateGate({
  passwordConfigured,
}: {
  passwordConfigured: boolean;
}) {
  const t = useTranslations("Knowledge");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!passwordConfigured) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-sm text-amber-900">{t("privateNotConfigured")}</p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/knowledge/private", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (data.error === "wrong_password") {
        setError(t("privateWrongPassword"));
      } else {
        setError(t("privateUnlockError"));
      }
      return;
    }
    setPassword("");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{t("privateGateTitle")}</h2>
      <p className="mt-2 text-sm text-gray-600">{t("privateGateDescription")}</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="knowledge-private-password" className="sr-only">
            {t("privatePasswordLabel")}
          </label>
          <input
            id="knowledge-private-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("privatePasswordPlaceholder")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            required
            disabled={pending}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {pending ? t("privateUnlocking") : t("privateUnlock")}
        </button>
      </form>
    </div>
  );
}
