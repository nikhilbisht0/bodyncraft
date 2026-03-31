// Core game logic and calculations

// Calculate XP needed for next level (increases exponentially)
export const calculateXPToNextLevel = (level) => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

// Check if character should level up
export const shouldLevelUp = (character) => {
  return character.xp >= character.xpToNextLevel;
};

// Level up character
export const levelUp = (character) => {
  const newLevel = character.level + 1;
  const excessXP = character.xp - character.xpToNextLevel;
  return {
    ...character,
    level: newLevel,
    xp: excessXP,
    xpToNextLevel: calculateXPToNextLevel(newLevel),
    skillPoints: character.skillPoints + 1, // +1 skill point per level
  };
};

// Calculate XP reward with bonuses
export const calculateXPReward = (exercise, character, perfectForm = false) => {
  let baseXP = exercise.xpReward;

  // Apply zone multiplier if in adventure mode
  const zoneMultiplier = 1; // Can be modified based on zone

  // Apply skill bonuses
  let skillBonus = 1;
  const unlockedSkills = character.skillTreeUnlocks[exercise.bodyPart] || [];
  if (unlockedSkills.length > 0) {
    // Simple bonus: +5% per unlocked skill in this tree
    skillBonus = 1 + (unlockedSkills.length * 0.05);
  }

  // Perfect form bonus
  const perfectFormBonus = perfectForm ? 1.2 : 1;

  const totalXP = Math.floor(baseXP * zoneMultiplier * skillBonus * perfectFormBonus);
  return totalXP;
};

// Add XP to character
export const addXP = (character, amount) => {
  const newCharacter = {
    ...character,
    xp: character.xp + amount,
  };

  // Check for level ups (might be multiple)
  let updatedCharacter = newCharacter;
  while (shouldLevelUp(updatedCharacter)) {
    updatedCharacter = levelUp(updatedCharacter);
  }

  // Recalculate overall stat
  updatedCharacter.stats.overall = calculateOverallStat(updatedCharacter.stats);

  return updatedCharacter;
};

// Update character stats after workout
export const updateCharacterStats = (character, exercise, reps = 1) => {
  const statIncreases = {
    arms: 'strength',
    legs: 'endurance',
    core: 'core',
  };

  const statKey = statIncreases[exercise.bodyPart];
  if (!statKey) return character;

  const baseIncrease = Math.floor(exercise.damageMultiplier * 2);
  const increase = baseIncrease * reps;

  const newStats = { ...character.stats };
  newStats[statKey] += increase;
  newStats.overall = calculateOverallStat(newStats);

  // Check for evolution stage
  const newEvolutionStage = calculateEvolutionStage(newStats);

  return {
    ...character,
    stats: newStats,
    evolutionStage: Math.max(character.evolutionStage, newEvolutionStage),
  };
};

// Calculate overall stat (weighted average)
export const calculateOverallStat = (stats) => {
  return Math.floor(
    (stats.strength + stats.endurance + stats.core) / 3
  );
};

// Determine evolution stage based on stats
export const calculateEvolutionStage = (stats) => {
  const overall = stats.overall;

  if (overall >= 200) return 3; // Muscular
  if (overall >= 100) return 2; // Athletic
  if (overall >= 30) return 1;  // Fit
  return 0; // Beginner (Skinny)
};

// Update streak
export const updateStreak = (streak, today) => {
  const todayStr = today.toISOString().split('T')[0];
  const lastDate = streak.lastWorkoutDate
    ? new Date(streak.lastWorkoutDate)
    : null;

  // If last workout was today, streak unchanged
  if (lastDate && lastDate.toDateString() === today.toDateString()) {
    return streak;
  }

  // Check if workout was yesterday (maintain streak)
  if (lastDate) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate.toDateString() === yesterday.toDateString()) {
      return {
        ...streak,
        current: streak.current + 1,
        lastWorkoutDate: todayStr,
        longest: Math.max(streak.longest, streak.current + 1),
      };
    }
  }

  // Streak broken, reset to 1
  return {
    current: 1,
    longest: Math.max(streak.longest, 1),
    lastWorkoutDate: todayStr,
  };
};

// Log a completed workout
export const logWorkout = (character, exercise, reps = 1, perfectForm = false) => {
  // Calculate XP
  const xpEarned = calculateXPReward(exercise, character, perfectForm);

  // Add XP
  let newCharacter = addXP(character, xpEarned);

  // Update stats
  newCharacter = updateCharacterStats(newCharacter, exercise, reps);

  // Update streak
  newCharacter.streak = updateStreak(newCharacter.streak, new Date());

  // Increase total workouts
  newCharacter.totalWorkouts += 1;

  // Record workout in history
  const workoutEntry = {
    date: new Date().toISOString(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    bodyPart: exercise.bodyPart,
    xpEarned,
    reps,
    perfectForm,
  };

  return { character: newCharacter, workoutEntry };
};

// Check if zone should be unlocked
export const checkZoneUnlocks = (character) => {
  const zones = [
    { id: 'mountains', requiredLevel: 10, requiredStat: 50 },
    { id: 'volcano', requiredLevel: 25, requiredStat: 100 },
    { id: 'abyss', requiredLevel: 50, requiredStat: 200 },
  ];

  let newlyUnlocked = [];

  zones.forEach(zone => {
    if (
      !character.unlockedZones.includes(zone.id) &&
      character.level >= zone.requiredLevel &&
      Math.max(character.stats.strength, character.stats.endurance, character.stats.core) >= zone.requiredStat
    ) {
      newlyUnlocked.push(zone.id);
    }
  });

  if (newlyUnlocked.length > 0) {
    return {
      ...character,
      unlockedZones: [...character.unlockedZones, ...newlyUnlocked],
    };
  }

  return character;
};

// Complete battle/enemy defeat
export const completeBattle = (character, enemy, exerciseUsed, reps) => {
  const { character: updatedChar, workoutEntry } = logWorkout(
    character,
    exerciseUsed,
    reps,
    false
  );

  // Check for zone unlocks
  const finalChar = checkZoneUnlocks(updatedChar);

  // Record defeated boss if applicable
  if (enemy.isBoss) {
    if (!finalChar.defeatedBosses.includes(enemy.id)) {
      finalChar.defeatedBosses.push(enemy.id);
    }
  }

  return {
    character: finalChar,
    xpEarned: workoutEntry.xpEarned,
    workoutEntry, // Include full workout entry
  };
};

// Initialize new character
export const createNewCharacter = () => ({
  ...defaultCharacter,
});

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
  profile: {
    weight: 70,
    height: 170,
    age: 25,
    gender: 'male',
    activityLevel: 1.2,
  },
  createdAt: new Date().toISOString(),
};

export { defaultCharacter };
