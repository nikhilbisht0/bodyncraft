// Simplified enemy system - one enemy type per body part
// Enemy stats scale with character level

export const ENEMY_TYPES = {
  arms: {
    base: {
      id: 'golem-arms',
      name: 'Golem',
      emoji: '🪨',
      description: 'A powerful rock creature',
      baseHealth: 30,
      baseDamage: 3,
      baseXP: 15
    },
    scaling: {
      healthPerLevel: 10,
      damagePerLevel: 2,
      xpPerLevel: 5
    }
  },
  legs: {
    base: {
      id: 'beast-legs',
      name: 'Beast',
      emoji: '🐺',
      description: 'A swift predator',
      baseHealth: 40,
      baseDamage: 4,
      baseXP: 20
    },
    scaling: {
      healthPerLevel: 12,
      damagePerLevel: 2.5,
      xpPerLevel: 6
    }
  },
  core: {
    base: {
      id: 'titan-core',
      name: 'Titan',
      emoji: '🗿',
      description: 'A formidable Guardian',
      baseHealth: 50,
      baseDamage: 5,
      baseXP: 25
    },
    scaling: {
      healthPerLevel: 15,
      damagePerLevel: 3,
      xpPerLevel: 7
    }
  }
};

// Weekly bosses (still exist - special encounters)
export const weeklyBosses = [
  {
    id: 'titan-boss',
    name: 'Iron Titan',
    health: 500,
    maxHealth: 500,
    damage: 40,
    bodyPart: 'arms',
    isBoss: true,
    emoji: '🤖',
    description: 'Ancient war machine',
    xpReward: 300
  },
  {
    id: 'hydra-boss',
    name: 'Forest Hydra',
    health: 600,
    maxHealth: 600,
    damage: 35,
    bodyPart: 'legs',
    isBoss: true,
    emoji: '🐲',
    description: 'Multi-headed serpent beast',
    xpReward: 350
  },
  {
    id: 'abyss-demon',
    name: 'Abyss Demon',
    health: 700,
    maxHealth: 700,
    damage: 45,
    bodyPart: 'core',
    isBoss: true,
    emoji: '👹',
    description: 'Born from the depths of darkness',
    xpReward: 400
  },
];

// Generate a scaled enemy for the given body part and character level
export const generateEnemy = (bodyPart, level = 1) => {
  const type = ENEMY_TYPES[bodyPart];
  if (!type) return null;

  const { base, scaling } = type;

  // Calculate scaled stats
  const health = Math.floor(base.baseHealth + (level - 1) * scaling.healthPerLevel);
  const damage = Math.floor(base.baseDamage + (level - 1) * scaling.damagePerLevel);
  const xpReward = Math.floor(base.baseXP + (level - 1) * scaling.xpPerLevel);

  return {
    id: `${base.id}-lvl${level}`,
    name: `${base.name} Lvl. ${level}`,
    health: health,
    maxHealth: health,
    damage: damage,
    bodyPart: bodyPart,
    isBoss: false,
    emoji: base.emoji,
    description: base.description,
    xpReward: xpReward
  };
};

// Get random enemy for body part (scaled to character's level)
export const getRandomEnemy = (bodyPart, level = 1) => {
  return generateEnemy(bodyPart, level);
};

// Get weekly boss (unchanged)
export const getWeeklyBoss = (bodyPart) => {
  const bosses = weeklyBosses.filter(b => b.bodyPart === bodyPart);
  return bosses[Math.floor(Math.random() * bosses.length)];
};
