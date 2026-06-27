// Canonical training categories. The `key` is what gets stored on a training;
// labels are localized in the UI. Used by the builder's category select, the
// home filter bar, and card/chip styling.
export interface Category {
  key: string;
  de: string;
  en: string;
  /** Tailwind classes for the small chip shown on cards. */
  chip: string;
  /** Tailwind classes for the active filter button. */
  filter: string;
}

export const CATEGORIES: Category[] = [
  { key: 'Kraft', de: 'Kraft', en: 'Strength', chip: 'bg-violet-500/20 text-violet-300', filter: 'bg-violet-600 text-white' },
  { key: 'Core', de: 'Core', en: 'Core', chip: 'bg-emerald-500/20 text-emerald-300', filter: 'bg-emerald-600 text-white' },
  { key: 'HIIT', de: 'HIIT', en: 'HIIT', chip: 'bg-yellow-500/20 text-yellow-300', filter: 'bg-yellow-500 text-black' },
  { key: 'Cardio', de: 'Cardio', en: 'Cardio', chip: 'bg-rose-500/20 text-rose-300', filter: 'bg-rose-600 text-white' },
  { key: 'Mobilität', de: 'Mobilität', en: 'Mobility', chip: 'bg-pink-500/20 text-pink-300', filter: 'bg-pink-600 text-white' },
  { key: 'Ganzkörper', de: 'Ganzkörper', en: 'Full Body', chip: 'bg-sky-500/20 text-sky-300', filter: 'bg-sky-600 text-white' },
  { key: 'Oberkörper', de: 'Oberkörper', en: 'Upper Body', chip: 'bg-indigo-500/20 text-indigo-300', filter: 'bg-indigo-600 text-white' },
  { key: 'Unterkörper', de: 'Unterkörper', en: 'Lower Body', chip: 'bg-orange-500/20 text-orange-300', filter: 'bg-orange-600 text-white' },
];

const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

export function categoryLabel(key: string, lang: 'de' | 'en'): string {
  const c = CATEGORY_MAP[key];
  if (!c) return key;
  return lang === 'de' ? c.de : c.en;
}

export function categoryChipClass(key: string): string {
  return CATEGORY_MAP[key]?.chip ?? 'bg-gray-700 text-gray-300';
}

export function categoryFilterClass(key: string): string {
  return CATEGORY_MAP[key]?.filter ?? 'bg-violet-600 text-white';
}

/** i18n category map { key: localizedLabel } for a language. */
export function categoryI18nMap(lang: 'de' | 'en'): Record<string, string> {
  return Object.fromEntries(CATEGORIES.map(c => [c.key, lang === 'de' ? c.de : c.en]));
}
