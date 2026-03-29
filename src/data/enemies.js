// Enemies organized by body part and zone
export const enemies = {
  // ARM ENEMIES
  arms: [
    {
      id: 'stone-golem',
      name: 'Stone Golem',
      health: 50,
      maxHealth: 50,
      damage: 5,
      bodyPart: 'arms',
      zone: 'forest',
      isBoss: false,
      emoji: '🪨',
      description: 'A towering rock creature',
      xpReward: 25
    },
    {
      id: 'iron-fist',
      name: 'Iron Fist Master',
      health: 80,
      maxHealth: 80,
      damage: 10,
      bodyPart: 'arms',
      zone: 'mountains',
      isBoss: false,
      emoji: '👊',
      description: 'Martial arts expert with crushing fists',
      xpReward: 50
    },
    {
      id: 'dragon-claw',
      name: 'Dragon Claw',
      health: 150,
      maxHealth: 150,
      damage: 20,
      bodyPart: 'arms',
      zone: 'volcano',
      isBoss: false,
      emoji: '🐉',
      description: 'Ancient dragon with razor-sharp claws',
      xpReward: 100
    },
  ],

  // LEG ENEMIES
  legs: [
    {
      id: 'runner-beast',
      name: 'Runner Beast',
      health: 60,
      maxHealth: 60,
      damage: 8,
      bodyPart: 'legs',
      zone: 'forest',
      isBoss: false,
      emoji: '🐺',
      description: 'Swift predator with powerful legs',
      xpReward: 30
    },
    {
      id: 'centaur-warrior',
      name: 'Centaur Warrior',
      health: 100,
      maxHealth: 100,
      damage: 15,
      bodyPart: 'legs',
      zone: 'mountains',
      isBoss: false,
      emoji: '🐴',
      description: 'Half-human, half-horse with devastating kicks',
      xpReward: 60
    },
    {
      id: 'spider-queen',
      name: 'Spider Queen',
      health: 200,
      maxHealth: 200,
      damage: 25,
      bodyPart: 'legs',
      zone: 'volcano',
      isBoss: false,
      emoji: '🕷️',
      description: 'Eight legs of deadly precision',
      xpReward: 120
    },
  ],

  // CORE ENEMIES
  core: [
    {
      id: 'slime-king',
      name: 'Slime King',
      health: 70,
      maxHealth: 70,
      damage: 12,
      bodyPart: 'core',
      zone: 'forest',
      isBoss: false,
      emoji: '🟢',
      description: 'Bouncy gelatinous monarch',
      xpReward: 35
    },
    {
      id: 'stone-golem-core',
      name: 'Granite Guardian',
      health: 120,
      maxHealth: 120,
      damage: 18,
      bodyPart: 'core',
      zone: 'mountains',
      isBoss: false,
      emoji: '🗿',
      description: 'Living statue with impenetrable core',
      xpReward: 70
    },
    {
      id: 'lava-golem',
      name: 'Lava Golem',
      health: 250,
      maxHealth: 250,
      damage: 30,
      bodyPart: 'core',
      zone: 'volcano',
      isBoss: false,
      emoji: '🌋',
      description: 'Molten core burns with eternal fire',
      xpReward: 150
    },
  ],
};

// Weekly bosses (harder, special enemies)
export const weeklyBosses = [
  {
    id: 'titan',
    name: 'Iron Titan',
    health: 500,
    maxHealth: 500,
    damage: 40,
    bodyPart: 'arms',
    zone: 'all',
    isBoss: true,
    emoji: '🤖',
    description: 'Ancient war machine',
    xpReward: 300
  },
  {
    id: 'hydra',
    name: 'Forest Hydra',
    health: 600,
    maxHealth: 600,
    damage: 35,
    bodyPart: 'legs',
    zone: 'all',
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
    zone: 'all',
    isBoss: true,
    emoji: '👹',
    description: 'Born from the depths of darkness',
    xpReward: 400
  },
];

// Get enemy by body part and zone
export const getEnemiesByBodyPart = (bodyPart, zone = null) => {
  let filtered = enemies[bodyPart] || [];
  if (zone) {
    filtered = filtered.filter(e => e.zone === zone);
  }
  return filtered;
};

// Get random enemy for body part
export const getRandomEnemy = (bodyPart, zone = null) => {
  const pool = getEnemiesByBodyPart(bodyPart, zone);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};

// Get weekly boss
export const getWeeklyBoss = (bodyPart) => {
  const bosses = weeklyBosses.filter(b => b.bodyPart === bodyPart);
  return bosses[Math.floor(Math.random() * bosses.length)];
};
