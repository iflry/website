"use client";

import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

const POST_TYPES = [
  { value: "all", label: "All" },
  { value: "statement", label: "Statement" },
  { value: "press-release", label: "Press Release" },
  { value: "bureau-update", label: "Bureau Update" },
] as const;

export default function PostsTabs({
  currentType,
  locale,
}: {
  currentType: string;
  locale: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", newType);
    params.delete("page"); // Reset to page 1 when changing type
    router.push(`/${locale}/posts?${params.toString()}`);
  };

  return (
    <Tabs value={currentType} onValueChange={handleTypeChange}>
      <TabsList>
        {POST_TYPES.map((postType) => (
          <TabsTrigger key={postType.value} value={postType.value}>
            {postType.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
