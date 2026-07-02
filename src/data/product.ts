export type FrameType = "solo" | "duo";

export interface FrameConfig {
  type: FrameType;
  time: string;
  firstName: string;
  lastName: string;
  partner1: string;
  partner2: string;
  city: string;
  year: string;
  rankingOverall: string; // #OV — classement général
  rankingAge: string; // #AG — classement catégorie d'âge
}

// Pays figé : France uniquement pour l'instant.
export const COUNTRY_CODE = "FR";
export const COUNTRY_LABEL = "FRA";

export const PRICE_EUR = 29.99;

export const defaultConfig: FrameConfig = {
  type: "solo",
  time: "01:11:45",
  firstName: "Pierre",
  lastName: "Anthony",
  partner1: "Pierre Anthony",
  partner2: "Marie Laurent",
  city: "Toulouse",
  year: "2026",
  rankingOverall: "57",
  rankingAge: "128",
};

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🏳️";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}
