// Workout exercises mapped to body parts
export const exercises = [
  // ARM EXERCISES
  {
    id: 'pushups',
    name: 'Push-ups',
    bodyPart: 'arms',
    xpReward: 15,
    damageMultiplier: 2,
    difficulty: 1,
    description: 'Build chest and arm strength',
    icon: '💪'
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    bodyPart: 'arms',
    xpReward: 12,
    damageMultiplier: 1.8,
    difficulty: 1,
    description: 'Isolate and strengthen biceps',
    icon: '🔨'
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    bodyPart: 'arms',
    xpReward: 14,
    damageMultiplier: 2,
    difficulty: 2,
    description: 'Target the back of your arms',
    icon: '🎯'
  },
  {
    id: 'pullups',
    name: 'Pull-ups',
    bodyPart: 'arms',
    xpReward: 25,
    damageMultiplier: 3,
    difficulty: 3,
    description: 'Ultimate upper body strength test',
    icon: '🔥'
  },

  // LEG EXERCISES
  {
    id: 'squats',
    name: 'Squats',
    bodyPart: 'legs',
    xpReward: 15,
    damageMultiplier: 2,
    difficulty: 1,
    description: 'The king of leg exercises',
    icon: '🦵'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    bodyPart: 'legs',
    xpReward: 12,
    damageMultiplier: 1.8,
    difficulty: 1,
    description: 'Build balance and leg strength',
    icon: '🚶'
  },
  {
    id: 'jump-squats',
    name: 'Jump Squats',
    bodyPart: 'legs',
    xpReward: 20,
    damageMultiplier: 2.5,
    difficulty: 2,
    description: 'Explosive leg power builder',
    icon: '⚡'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    bodyPart: 'legs',
    xpReward: 30,
    damageMultiplier: 3.5,
    difficulty: 3,
    description: 'Full body conditioning',
    icon: '💥'
  },

  // CORE EXERCISES
  {
    id: 'plank',
    name: 'Plank',
    bodyPart: 'core',
    xpReward: 10,
    damageMultiplier: 1.5,
    difficulty: 1,
    description: 'Build core stability',
    icon: '🧱'
  },
  {
    id: 'crunches',
    name: 'Crunches',
    bodyPart: 'core',
    xpReward: 8,
    damageMultiplier: 1.2,
    difficulty: 1,
    description: 'Classic ab builder',
    icon: '🌀'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    bodyPart: 'core',
    xpReward: 18,
    damageMultiplier: 2.2,
    difficulty: 2,
    description: 'Core + cardio combo',
    icon: '🏔️'
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    bodyPart: 'core',
    xpReward: 16,
    damageMultiplier: 2,
    difficulty: 2,
    description: 'Target obliques',
    icon: '🎪'
  },
];

// Get exercises by body part
export const getExercisesByBodyPart = (bodyPart) => {
  return exercises.filter(ex => ex.bodyPart === bodyPart);
};

// Get exercise by ID
export const getExerciseById = (id) => {
  return exercises.find(ex => ex.id === id);
};
