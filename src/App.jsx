import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CharacterProvider } from './contexts/CharacterContext';
import { GameProvider, GAME_MODES } from './contexts/GameContext';
import Dashboard from './components/Dashboard/Dashboard';
import BattleArena from './components/Battle/BattleArena';
import AdventureMap from './components/Adventure/WorldMap';
import SkillTree from './components/SkillTree/SkillTree';
import { useGame } from './contexts/GameContext';
import './index.css';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.02, y: -20 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

const AppContent = () => {
  const { currentMode } = useGame();

  const renderCurrentMode = () => {
    switch (currentMode) {
      case GAME_MODES.BATTLE:
        return <BattleArena />;
      case GAME_MODES.ADVENTURE:
        return <AdventureMap />;
      case GAME_MODES.SKILL_TREE:
        return <SkillTree />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentMode}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {renderCurrentMode()}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <CharacterProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </CharacterProvider>
  );
}

export default App;
