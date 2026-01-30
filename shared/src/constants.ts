import { TradeCategory } from './enums';

export interface TradeCategoryInfo {
  name: string;
  slug: string;
  displayOrder: number;
  category: TradeCategory;
}

export const TRADE_CATEGORIES: TradeCategoryInfo[] = [
  { name: 'Electrical', slug: 'electrical', displayOrder: 1, category: TradeCategory.ELECTRICAL },
  { name: 'HVAC', slug: 'hvac', displayOrder: 2, category: TradeCategory.HVAC },
  { name: 'Plumbing', slug: 'plumbing', displayOrder: 3, category: TradeCategory.PLUMBING },
  { name: 'Welding', slug: 'welding', displayOrder: 4, category: TradeCategory.WELDING },
  { name: 'Carpentry', slug: 'carpentry', displayOrder: 5, category: TradeCategory.CARPENTRY },
  { name: 'Masonry', slug: 'masonry', displayOrder: 6, category: TradeCategory.MASONRY },
  { name: 'Roofing', slug: 'roofing', displayOrder: 7, category: TradeCategory.ROOFING },
  { name: 'Painting', slug: 'painting', displayOrder: 8, category: TradeCategory.PAINTING },
];

export interface SkillSeed {
  name: string;
  slug: string;
  categorySlug: string;
  aliases: string[];
}

export const SKILL_SEEDS: SkillSeed[] = [
  { name: 'Rough-in', slug: 'rough-in', categorySlug: 'electrical', aliases: ['rough in', 'roughing'] },
  { name: 'Conduit Bending', slug: 'conduit-bending', categorySlug: 'electrical', aliases: ['pipe bending', 'emt bending'] },
  { name: 'Panel Termination', slug: 'panel-termination', categorySlug: 'electrical', aliases: ['panel work', 'breaker panel'] },
  { name: 'Low Voltage', slug: 'low-voltage', categorySlug: 'electrical', aliases: ['LV', 'data', 'network cabling'] },
];

export const MIN_TOUCH_TARGET = 48;
