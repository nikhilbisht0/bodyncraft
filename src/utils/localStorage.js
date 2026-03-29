// LocalStorage keys
const STORAGE_KEYS = {
  CHARACTER: 'bodyncraft_character',
  WORKOUTS: 'bodyncraft_workouts',
  SETTINGS: 'bodyncraft_settings',
};

// Character data structure
const defaultCharacter = {
  stats: {
    strength: 0,
    endurance: 0,
    core: 0,
    overall: 0,
  },
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  evolutionStage: 0,
  unlockedZones: ['forest'],
  defeatedBosses: [],
  streak: {
    current: 0,
    longest: 0,
    lastWorkoutDate: null,
  },
  skillPoints: 0,
  skillTreeUnlocks: {
    arms: [],
    legs: [],
    core: [],
  },
  totalWorkouts: 0,
  calories: 0,
  profile: {
    weight: 70, // kg
    height: 170, // cm
    age: 25,
    gender: 'male', // 'male' or 'female'
    activityLevel: 1.2, // 1.2: sedentary, 1.375: light, 1.55: moderate, 1.725: active, 1.9: very active
  },
  createdAt: new Date().toISOString(),
};

// Load character from localStorage
export const loadCharacter = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CHARACTER);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load character:', error);
  }
  return { ...defaultCharacter };
};

// Save character to localStorage
export const saveCharacter = (character) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
  } catch (error) {
    console.error('Failed to save character:', error);
  }
};

// Load workout history
export const loadWorkoutHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load workout history:', error);
  }
  return [];
};

// Save workout history
export const saveWorkoutHistory = (workouts) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to save workout history:', error);
  }
};

// Clear all data (for testing/reset)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export { STORAGE_KEYS, defaultCharacter };
