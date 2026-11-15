export interface RawItem {
  id?: string;
  image?: string | null;
  names?: Record<string, string>;
  name?: string;
  imageHint?: string;
}

export interface Item {
  id: string;
  category: string;
  image: string;
  name: string;
  names: Record<string, string>;
}

export type ItemCategory = string;

/** Уникальный ключ для трекера */
export const itemKey = (item: Pick<Item, "id" | "category">) =>
  `${item.category}:${item.id}`;