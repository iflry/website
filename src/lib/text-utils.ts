import { PortableTextBlock } from "next-sanity";

/**
 * Extracts plain text from PortableText blocks
 * Recursively traverses the block structure to extract all text content
 */
export function extractTextFromPortableText(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (block._type === "block" && block.children) {
        return block.children
          .map((child: any) => {
            if (typeof child === "string") {
              return child;
            }
            if (child._type === "span" && child.text) {
              return child.text;
            }
            return "";
          })
          .join("");
      }
      return "";
    })
    .join(" ")
    .trim();
}

/**
 * Truncates text to a maximum length, adding ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + "...";
}
