import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { loadCharacter, saveCharacter } from '../utils/database';
import { defaultCharacter } from '../utils/gameLogic';
import {
  addXP,
  updateCharacterStats,
  levelUp,
  checkZoneUnlocks,
} from '../utils/gameLogic';

const CharacterContext = createContext(null);

const characterReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CHARACTER':
      return { ...state, ...action.payload, initialized: true };

    case 'ADD_XP':
      const newCharWithXP = addXP(state, action.payload);
      return newCharWithXP;

    case 'UPDATE_STATS':
      const newStats = { ...state.stats };
      newStats[action.payload.bodyPart] += action.payload.amount;
      newStats.overall = Math.floor(
        (newStats.strength + newStats.endurance + newStats.core) / 3
      );
      return { ...state, stats: newStats };

    case 'ADD_CALORIES':
      return {
        ...state,
        calories: state.calories + action.payload.amount,
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };

    case 'COMPLETE_WORKOUT':
      // Apply stat increases from workout
      let updatedState = { ...state };
      const statMap = { arms: 'strength', legs: 'endurance', core: 'core' };
      const statKey = statMap[action.payload.exercise.bodyPart];
      if (statKey) {
        const increase = action.payload.exercise.damageMultiplier * 2 * action.payload.reps;
        updatedState.stats[statKey] += increase;
        updatedState.stats.overall = Math.floor(
          (updatedState.stats.strength + updatedState.stats.endurance + updatedState.stats.core) / 3
        );
        updatedState.totalWorkouts += 1;
      }

      // Add XP
      updatedState = addXP(updatedState, action.payload.xp);

      // Update streak
      updatedState.streak = action.payload.newStreak;

      // Check for zone unlocks
      updatedState = checkZoneUnlocks(updatedState);

      // Save immediately
      saveCharacter(updatedState);

      return updatedState;

    case 'UNLOCK_SKILL':
      const skillCost = action.payload.skill.cost;
      if (state.skillPoints >= skillCost) {
        const newSkillTreeUnlocks = { ...state.skillTreeUnlocks };
        if (!newSkillTreeUnlocks[action.payload.bodyPart]) {
          newSkillTreeUnlocks[action.payload.bodyPart] = [];
        }
        newSkillTreeUnlocks[action.payload.bodyPart].push(action.payload.skill.id);

        return {
          ...state,
          skillPoints: state.skillPoints - skillCost,
          skillTreeUnlocks: newSkillTreeUnlocks,
        };
      }
      return state;

    case 'RESET_CHARACTER':
      return { ...defaultCharacter, initialized: true };

    default:
      return state;
  }
};

export const CharacterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(characterReducer, { ...defaultCharacter, initialized: false });
  const [loading, setLoading] = useState(true);

  // Load character on mount
  useEffect(() => {
    const loadData = async () => {
      const savedCharacter = await loadCharacter();
      if (savedCharacter) {
        dispatch({ type: 'LOAD_CHARACTER', payload: savedCharacter });
      } else {
        // No user data, initialize with defaults
        dispatch({ type: 'LOAD_CHARACTER', payload: { ...defaultCharacter, initialized: true } });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Save character whenever state changes
  useEffect(() => {
    if (state.initialized) {
      saveCharacter(state);
    }
  }, [state]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-green-950 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading your adventure...</p>
      </div>
    </div>;
  }

  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
