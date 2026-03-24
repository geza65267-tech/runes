import { Rune, RuneType, RuneRarity, AffixRarity } from '../types/rune';

export const AFFIX_POOLS = {
  fury: {
    common: [
      { name: '+Attack Speed', description: '+15% Attack Speed' },
      { name: '+Crit Chance', description: '+8% Crit Chance' },
      { name: '+Crit Damage', description: '+25% Crit Damage' },
    ],
    rare: [
      { name: 'Splash Damage', description: 'Every 5th hit = splash (50%)' },
      { name: 'Rage Stack', description: 'Kill → +10% ATK for 3s (stack 3x)' },
      { name: 'Bleed on Crit', description: 'Crit → apply bleed DoT' },
    ],
    epic: [
      { name: 'Chain Attack', description: 'Attack chains to 2 targets' },
      { name: 'Overkill Spread', description: 'Overkill damage spreads nearby' },
      { name: 'Berserk', description: 'Below 30% HP: +50% attack speed' },
    ],
  },
  aegis: {
    common: [
      { name: '+Block Chance', description: '+15% Block Chance' },
      { name: '-Damage Taken', description: '-8% Damage Taken' },
      { name: '+Shield Efficiency', description: '+30% Shield efficiency' },
    ],
    rare: [
      { name: 'Stun on Block', description: 'Block → stun enemy (0.5s)' },
      { name: 'Shield Gain', description: 'Hit → gain shield (5s CD)' },
      { name: 'Reflect Damage', description: 'Reflect 15% damage' },
    ],
    epic: [
      { name: 'Immortal', description: 'Fatal hit → survive at 1 HP (30s CD)' },
      { name: 'Shield Explosion', description: 'Shield break → AoE damage' },
      { name: 'Taunt Aura', description: 'Enemies prioritize you' },
    ],
  },
  vitality: {
    common: [
      { name: '+HP Regen', description: '+5 HP regen/sec' },
      { name: '+Healing Received', description: '+15% healing received' },
      { name: '+Max HP', description: '+50 Max HP' },
    ],
    rare: [
      { name: 'Overheal Shield', description: 'Overheal converts to shield' },
      { name: 'Emergency Regen', description: 'Low HP → regen boost' },
      { name: 'Kill Heal', description: 'Kill → heal 10% HP' },
    ],
    epic: [
      { name: 'Phoenix', description: 'Revive once per run' },
      { name: 'Lifesteal Aura', description: '15% lifesteal on all attacks' },
      { name: 'Adaptive Healing', description: 'Damage taken → heal over time' },
    ],
  },
};

export const RUNE_CONFIG = {
  fury: {
    name: 'Fury Rune',
    color: 'crimson',
    stats: {
      minor: 2,
      major: 5,
      legendary: 12,
    },
  },
  aegis: {
    name: 'Aegis Rune',
    color: 'cyan',
    stats: {
      minor: 3,
      major: 8,
      legendary: 15,
    },
  },
  vitality: {
    name: 'Vitality Rune',
    color: 'emerald',
    stats: {
      minor: 20,
      major: 50,
      legendary: 120,
    },
  },
};

function generateAffix(type: RuneType, rarity: AffixRarity): any {
  const pool = AFFIX_POOLS[type][rarity];
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...selected,
    rarity,
  };
}

export function generateMockRune(
  type: RuneType,
  rarity: RuneRarity,
  corrupted = false
): Rune {
  const config = RUNE_CONFIG[type];
  const statValue = config.stats[rarity];

  const affixCount = rarity === 'minor' ? 1 : 2;
  const affixes = [];

  for (let i = 0; i < affixCount; i++) {
    const affixRarity: AffixRarity =
      Math.random() < 0.6 ? 'common' : Math.random() < 0.8 ? 'rare' : 'epic';
    affixes.push(generateAffix(type, affixRarity));
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    rarity,
    fixedStat: {
      name: type === 'fury' ? 'ATK' : type === 'aegis' ? 'DEF' : 'HP',
      value: statValue,
    },
    affixes,
    corrupted,
    corruptionEffect: corrupted ? 'Lose 2% HP/sec' : undefined,
  };
}
