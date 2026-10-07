import "server-only";
import type { Locale } from "./config";
import tr from "./dictionaries/tr";
import en from "./dictionaries/en";

const dictionaries = { tr, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export type { Dictionary } from "./dictionaries/tr";
