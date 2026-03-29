// Skill trees for each body part
export const skillTrees = {
  arms: {
    name: 'Arm Strength',
    icon: '💪',
    description: 'Master the art of upper body power',
    tree: [
      {
        id: 'basic-strength',
        name: 'Basic Strength',
        description: '+10% XP from arm exercises',
        cost: 1,
        statBonus: { strength: 5 },
        unlocked: false,
        position: { x: 50, y: 20 }
      },
      {
        id: 'endurance-arm',
        name: 'Arm Endurance',
        description: 'Unlock high-rep arm exercises',
        cost: 2,
        statBonus: { endurance: 5 },
        requires: ['basic-strength'],
        unlocked: false,
        position: { x: 30, y: 40 }
      },
      {
        id: 'power-lifting',
        name: 'Power Lifter',
        description: '+20% damage with heavy arm workouts',
        cost: 3,
        statBonus: { strength: 15 },
        requires: ['basic-strength'],
        unlocked: false,
        position: { x: 70, y: 40 }
      },
      {
        id: 'explosive-power',
        name: 'Explosive Power',
        description: 'Unlock explosive arm movements',
        cost: 3,
        statBonus: { strength: 10 },
        requires: ['power-lifting'],
        unlocked: false,
        position: { x: 70, y: 60 }
      },
      {
        id: 'iron-arms',
        name: 'Iron Arms',
        description: '+50% to all arm exercise XP',
        cost: 5,
        statBonus: { strength: 25, overall: 10 },
        requires: ['explosive-power'],
        unlocked: false,
        position: { x: 70, y: 80 }
      }
    ]
  },

  legs: {
    name: 'Leg Power',
    icon: '🦵',
    description: 'Develop unstoppable lower body strength',
    tree: [
      {
        id: 'basic-endurance',
        name: 'Basic Endurance',
        description: '+10% XP from leg exercises',
        cost: 1,
        statBonus: { endurance: 5 },
        unlocked: false,
        position: { x: 50, y: 20 }
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Unlock fast-paced leg exercises',
        cost: 2,
        statBonus: { endurance: 5 },
        requires: ['basic-endurance'],
        unlocked: false,
        position: { x: 20, y: 40 }
      },
      {
        id: 'explosive-legs',
        name: 'Explosive Legs',
        description: '+20% damage with plyometric exercises',
        cost: 3,
        statBonus: { endurance: 10 },
        requires: ['basic-endurance'],
        unlocked: false,
        position: { x: 50, y: 50 }
      },
      {
        id: 'marathon-runner',
        name: 'Marathon Runner',
        description: 'Reduce fatigue from high-rep leg workouts',
        cost: 3,
        statBonus: { endurance: 15 },
        requires: ['speed-demon'],
        unlocked: false,
        position: { x: 20, y: 60 }
      },
      {
        id: 'thunder-thighs',
        name: 'Thunder Thighs',
        description: '+50% to all leg exercise XP',
        cost: 5,
        statBonus: { endurance: 25, overall: 10 },
        requires: ['explosive-legs', 'marathon-runner'],
        unlocked: false,
        position: { x: 35, y: 80 }
      }
    ]
  },

  core: {
    name: 'Core Stability',
    icon: '🧱',
    description: 'Forge an unbreakable center',
    tree: [
      {
        id: 'basic-core',
        name: 'Basic Core',
        description: '+10% XP from core exercises',
        cost: 1,
        statBonus: { core: 5 },
        unlocked: false,
        position: { x: 50, y: 20 }
      },
      {
        id: 'six-pack-shredder',
        name: 'Six Pack Shredder',
        description: '+15% definition gains',
        cost: 2,
        statBonus: { core: 10 },
        requires: ['basic-core'],
        unlocked: false,
        position: { x: 35, y: 40 }
      },
      {
        id: 'rigid-torso',
        name: 'Rigid Torso',
        description: '+20% resistance to fatigue',
        cost: 3,
        statBonus: { core: 15 },
        requires: ['basic-core'],
        unlocked: false,
        position: { x: 65, y: 40 }
      },
      {
        id: 'steel-abs',
        name: 'Steel Abs',
        description: 'Unlock advanced core movements',
        cost: 3,
        statBonus: { core: 10 },
        requires: ['rigid-torso'],
        unlocked: false,
        position: { x: 65, y: 60 }
      },
      {
        id: 'unbreakable-core',
        name: 'Unbreakable Core',
        description: '+50% to all core exercise XP',
        cost: 5,
        statBonus: { core: 25, overall: 10 },
        requires: ['six-pack-shredder', 'steel-abs'],
        unlocked: false,
        position: { x: 50, y: 80 }
      }
    ]
  }
};

// Get skill tree by body part
export const getSkillTree = (bodyPart) => {
  return skillTrees[bodyPart] || null;
};

// Calculate total skill points spent
export const getTotalSkillPoints = (tree) => {
  return tree.filter(node => node.unlocked).reduce((total, node) => total + node.cost, 0);
};
