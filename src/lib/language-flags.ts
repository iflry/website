// Map language codes to flag emojis
export function getLanguageFlag(langCode: string): string {
  const flagMap: Record<string, string> = {
    en: "🇬🇧", // English - UK flag
    fr: "🇫🇷", // French
    es: "🇪🇸", // Spanish
    de: "🇩🇪", // German
    nl: "🇳🇱", // Dutch
    it: "🇮🇹", // Italian
    pt: "🇵🇹", // Portuguese
    ru: "🇷🇺", // Russian
    ar: "🇸🇦", // Arabic - Saudi Arabia flag
    zh: "🇨🇳", // Chinese
    ja: "🇯🇵", // Japanese
  };
  
  return flagMap[langCode] || "🌐"; // Default to globe if language not found
}
