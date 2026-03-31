import { supabase } from './supabaseClient'
import { calculateXPToNextLevel } from './gameLogic'

// Get current user ID
export const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

// Load character from database
export const loadCharacter = async () => {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Failed to load character:', error)
    return null
  }

  // Calculate xpToNextLevel from level if not stored
  const xpToNextLevel = calculateXPToNextLevel(data.level || 1)

  // Transform DB data to character format
  return {
    stats: {
      strength: data.stats?.strength || 0,
      endurance: data.stats?.endurance || 0,
      core: data.stats?.core || 0,
      overall: data.stats?.overall || 0,
    },
    level: data.level || 1,
    xp: data.total_xp || 0,
    xpToNextLevel,
    evolutionStage: data.evolution_stage || 0,
    unlockedZones: data.unlocked_zones || ['forest'],
    defeatedBosses: data.defeated_bosses || [],
    streak: {
      current: data.current_streak || 0,
      longest: data.longest_streak || 0,
      lastWorkoutDate: data.last_workout_date,
    },
    skillPoints: data.skill_points || 0,
    skillTreeUnlocks: data.skill_tree_data || { arms: [], legs: [], core: [] },
    totalWorkouts: data.total_workouts || 0,
    profile: {
      weight: data.weight || 70,
      height: data.height || 170,
      age: data.age || 25,
      gender: data.gender || 'male',
      activityLevel: data.activity_level || 1.2,
    },
    createdAt: data.created_at || new Date().toISOString(),
    initialized: true,
  }
}

// Save character to database
export const saveCharacter = async (character) => {
  const userId = await getUserId()
  if (!userId) return

  // Extract stats
  const { stats, streak, skillTreeUnlocks, profile, ...rest } = character

  const { error } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      level: rest.level,
      total_xp: rest.xp,
      evolution_stage: rest.evolutionStage,
      unlocked_zones: rest.unlockedZones,
      defeated_bosses: rest.defeatedBosses,
      current_streak: streak.current,
      longest_streak: streak.longest,
      last_workout_date: streak.lastWorkoutDate,
      skill_points: rest.skillPoints,
      skill_tree_data: skillTreeUnlocks,
      total_workouts: rest.totalWorkouts,
      weight: profile?.weight,
      height: profile?.height,
      age: profile?.age,
      gender: profile?.gender,
      activity_level: profile?.activityLevel,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Failed to save character:', error)
  }
}

// Load workout history
export const loadWorkoutHistory = async () => {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) {
    console.error('Failed to load workout history:', error)
    return []
  }

  return data.map(w => ({
    id: w.id,
    date: new Date(w.date),
    exerciseId: w.exercise_id,
    exerciseName: w.exercise_name,
    bodyPart: w.exercise_id.split('_')[0], // Extract from exercise_id
    xpEarned: w.calories_xp,
    durationMinutes: w.duration_minutes,
    perfectForm: false, // Not stored yet
  }))
}

// Save workout to history
export const saveWorkout = async (workoutEntry) => {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      exercise_id: workoutEntry.exerciseId,
      exercise_name: workoutEntry.exerciseName,
      duration_minutes: workoutEntry.durationMinutes || 20,
      calories_xp: workoutEntry.xpEarned,
      date: workoutEntry.date.toISOString().split('T')[0],
    })

  if (error) {
    console.error('Failed to save workout:', error)
  }
}

// Clear all data (for logout/testing)
export const clearAllData = async () => {
  const userId = await getUserId()
  if (!userId) return

  await supabase.from('workouts').delete().eq('user_id', userId)
  await supabase.from('user_stats').delete().eq('user_id', userId)
}
