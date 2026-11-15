import type { Item, RawItem } from "@/types/items";

const DEFAULT_LOCALE = "data-ru-RU";
const FALLBACK_LOCALE = "data-en-US";

export function toDisplayItem(
  raw: RawItem,
  category: string,
  locale: string = DEFAULT_LOCALE,
): Item {

  const safeNames = raw.names || {};

  const name =
    safeNames[locale] ||
    safeNames[FALLBACK_LOCALE] ||
    raw.name ||
    raw.imageHint ||
    `Неизвестный предмет (${category})`;

  let imageStr = "";
  if (raw.image) {
    imageStr = raw.image.startsWith("data:")
      ? raw.image
      : `data:image/png;base64,${raw.image}`;
  }

  return {
    id: raw.id || raw.name || name,
    category,
    image: imageStr,
    name: name,
    names: safeNames,
  };
}

export function toDisplayItems(
  rawItems: RawItem[],
  category: string,
  locale?: string,
): Item[] {
  return rawItems.map((r) => toDisplayItem(r, category, locale));
}