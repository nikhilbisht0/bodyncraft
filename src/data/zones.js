// Adventure zones with progression requirements
export const zones = [
  {
    id: 'forest',
    name: 'Enchanted Forest',
    emoji: '🌲',
    description: 'Beginner territory where your journey begins',
    requiredLevel: 1,
    requiredStat: 0,
    emojiBg: 'bg-green-900',
    unlocked: true,
    rewards: {
      xpBonus: 1.0,
      rareDropChance: 0.05
    }
  },
  {
    id: 'mountains',
    name: 'Crystal Mountains',
    emoji: '⛰️',
    description: 'Intermediate challenges await the dedicated',
    requiredLevel: 10,
    requiredStat: 50, // Requires at least 50 in any body stat
    emojiBg: 'bg-blue-800',
    unlocked: false,
    rewards: {
      xpBonus: 1.5,
      rareDropChance: 0.10
    }
  },
  {
    id: 'volcano',
    name: 'Inferno Volcano',
    emoji: '🌋',
    description: 'Advanced territory for elite warriors only',
    requiredLevel: 25,
    requiredStat: 100, // Requires at least 100 in any body stat
    emojiBg: 'bg-red-900',
    unlocked: false,
    rewards: {
      xpBonus: 2.0,
      rareDropChance: 0.20
    }
  },
  {
    id: 'abyss',
    name: 'The Abyss',
    emoji: '🌑',
    description: 'The ultimate challenge - only the strongest survive',
    requiredLevel: 50,
    requiredStat: 200,
    emojiBg: 'bg-purple-900',
    unlocked: false,
    rewards: {
      xpBonus: 3.0,
      rareDropChance: 0.30
    }
  },
];

// Check if zone is unlocked for character
export const isZoneUnlocked = (zone, character) => {
  if (zone.id === 'forest') return true;
  return (
    character.level >= zone.requiredLevel &&
    Math.max(character.stats.strength, character.stats.endurance, character.stats.core) >= zone.requiredStat
  );
};

// Get next zone to unlock
export const getNextZone = (character) => {
  const unlockedZones = zones.filter(z => isZoneUnlocked(z, character));
  const nextZone = zones.find(z => !isZoneUnlocked(z, character));
  return { unlockedZones, nextZone };
};
