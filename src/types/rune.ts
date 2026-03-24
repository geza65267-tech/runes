export type RuneType = 'fury' | 'aegis' | 'vitality';
export type RuneRarity = 'minor' | 'major' | 'legendary';
export type AffixRarity = 'common' | 'rare' | 'epic';

export interface Affix {
  id: string;
  name: string;
  description: string;
  rarity: AffixRarity;
}

export interface Rune {
  id: string;
  type: RuneType;
  rarity: RuneRarity;
  fixedStat: {
    name: string;
    value: number;
  };
  affixes: Affix[];
  corrupted?: boolean;
  corruptionEffect?: string;
}

export interface RuneSlot {
  id: number;
  rune: Rune | null;
  unlocked: boolean;
}

export interface SetBonus {
  type: RuneType;
  count: number;
  bonuses: string[];
}
