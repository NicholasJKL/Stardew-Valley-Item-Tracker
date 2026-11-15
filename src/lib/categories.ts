import type { RawItem } from "@/types/items";

import bigCraftables from '@/data/big-craftables.json';
import boots from '@/data/boots.json';
import flooring from '@/data/flooring.json';
import furniture from '@/data/furniture.json';
import hats from '@/data/hats.json';
import mannequins from '@/data/mannequins.json';
import objects from '@/data/objects.json';
import pants from '@/data/pants.json';
import shirts from '@/data/shirts.json';
import tools from '@/data/tools.json';
import trinkets from '@/data/trinkets.json';
import wallpaper from '@/data/wallpaper.json';
import weapons from '@/data/weapons.json';
import goldenHandsData from "@/data/golden_hands.json";

export const CATEGORIES = {
  objects: { label: 'Объекты', data: objects as RawItem[] },
  'big-craftables': { label: 'Большие ремесленные изделия', data: bigCraftables as RawItem[] },
  tools: { label: 'Инструменты', data: tools as RawItem[] },
  weapons: { label: 'Оружие', data: weapons as RawItem[] },
  furniture: { label: 'Мебель', data: furniture as RawItem[] },
  boots: { label: 'Ботинки', data: boots as RawItem[] },
  pants: { label: 'Штаны', data: pants as RawItem[] },
  shirts: { label: 'Рубашки', data: shirts as RawItem[] },
  hats: { label: 'Шляпы', data: hats as RawItem[] },
  trinkets: { label: 'Безделушки', data: trinkets as RawItem[] },
  mannequins: { label: 'Манекены', data: mannequins as RawItem[] },
  flooring: { label: 'Полы', data: flooring as RawItem[] },
  wallpaper: { label: 'Обои', data: wallpaper as RawItem[] },
  "golden-hands": { label: "Золотые руки 🌟", data: goldenHandsData },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export function getItemName(item: RawItem, lang: string = 'data-ru-RU'): string {
  return (
    item.names?.[lang] ||
    item.names?.['data-en-US'] ||
    (item.names ? Object.values(item.names)[0] : undefined) ||
    item.name ||
    item.imageHint ||
    'Unknown'
  );
}