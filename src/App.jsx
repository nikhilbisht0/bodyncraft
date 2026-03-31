import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CharacterProvider } from './contexts/CharacterContext';
import { GameProvider, GAME_MODES } from './contexts/GameContext';
import Dashboard from './components/Dashboard/Dashboard';
import BattleArena from './components/Battle/BattleArena';
import AdventureMap from './components/Adventure/WorldMap';
import SkillTree from './components/SkillTree/SkillTree';
import { useGame } from './contexts/GameContext';
import Login from './components/Auth/Login';
import { supabase } from './utils/supabaseClient';
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

const AppContent = ({ session }) => {
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
        return <Dashboard session={session} />;
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
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-green-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <CharacterProvider>
      <GameProvider>
        <AppContent session={session} />
      </GameProvider>
    </CharacterProvider>
  );
}

export default App;
