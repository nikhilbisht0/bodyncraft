import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext(null);

// Game modes
export const GAME_MODES = {
  DASHBOARD: 'dashboard',
  BATTLE: 'battle',
  ADVENTURE: 'adventure',
  SKILL_TREE: 'skilltree',
};

export const GameProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(GAME_MODES.DASHBOARD);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);

  // Reset battle state when switching modes
  useEffect(() => {
    if (currentMode !== GAME_MODES.BATTLE) {
      setCurrentEnemy(null);
      setSelectedBodyPart(null);
      setBattleLog([]);
      setShowVictory(false);
      setShowDefeat(false);
    }
  }, [currentMode]);

  const startBattle = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    setCurrentMode(GAME_MODES.BATTLE);
    setBattleLog([]);
    setShowVictory(false);
    setShowDefeat(false);
  };

  const spawnEnemy = (enemy) => {
    setCurrentEnemy(enemy);
  };

  const addBattleLog = (message) => {
    setBattleLog(prev => [...prev, { id: Date.now(), message }]);
  };

  const endBattle = (victory) => {
    if (victory) {
      setShowVictory(true);
    } else {
      setShowDefeat(true);
    }
  };

  const returnToDashboard = () => {
    setCurrentMode(GAME_MODES.DASHBOARD);
  };

  const value = {
    currentMode,
    setCurrentMode,
    currentEnemy,
    setCurrentEnemy,
    selectedBodyPart,
    setSelectedBodyPart,
    battleLog,
    addBattleLog,
    showVictory,
    setShowVictory,
    showDefeat,
    setShowDefeat,
    endBattle,
    startBattle,
    returnToDashboard,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
