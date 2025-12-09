import { PROFANITY_WORDS } from "../constants";

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.some((word) => lowerText.includes(word.toLowerCase()));
}

export function getProfanityWords(text: string): string[] {
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.filter((word) =>
    lowerText.includes(word.toLowerCase())
  );
}

