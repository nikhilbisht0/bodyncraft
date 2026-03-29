import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sword, Target, Zap, Award, RotateCcw } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useCharacter } from '../../contexts/CharacterContext';
import { getRandomEnemy, getEnemiesByBodyPart } from '../../data/enemies';
import { getExercisesByBodyPart } from '../../data/exercises';
import { logWorkout, completeBattle } from '../../utils/gameLogic';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

const BODY_PART_NAMES = {
  arms: 'Arms',
  legs: 'Legs',
  core: 'Core',
};

const BODY_PART_EMOJIS = {
  arms: '💪',
  legs: '🦵',
  core: '🧱',
};

const BattleArena = () => {
  const { state: character, dispatch } = useCharacter();
  const {
    currentMode,
    selectedBodyPart,
    currentEnemy,
    setCurrentEnemy,
    battleLog,
    addBattleLog,
    showVictory,
    showDefeat,
    endBattle,
    startBattle,
    returnToDashboard,
  } = useGame();

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [damageNumber, setDamageNumber] = useState(null);
  const [reps, setReps] = useState(10);

  // Get exercises for the selected body part
  const exercises = useMemo(() => {
    if (!selectedBodyPart) return [];
    return getExercisesByBodyPart(selectedBodyPart);
  }, [selectedBodyPart]);

  // Initialize enemy when body part is selected
  useEffect(() => {
    if (selectedBodyPart) {
      const enemy = getRandomEnemy(selectedBodyPart, character.unlockedZones[0]);
      if (enemy) {
        setCurrentEnemy(enemy);
        setEnemyHealth(enemy.health);
      }
    }
  }, [selectedBodyPart, setCurrentEnemy, character.unlockedZones]);

  // Enemy damage to player
  useEffect(() => {
    if (currentEnemy && enemyHealth <= 0) {
      // Victory already handled
    }
  }, [enemyHealth, currentEnemy]);

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  const performAttack = async () => {
    if (!selectedExercise || !currentEnemy || isAttacking) return;

    setIsAttacking(true);
    addBattleLog(`⚔️ You attack with ${selectedExercise.name}!`);

    // Calculate damage
    const damage = Math.floor(
      selectedExercise.damageMultiplier * 10 * (reps / 10) * (1 + character.stats.overall / 200)
    );

    // Show damage number
    setDamageNumber(damage);
    setTimeout(() => setDamageNumber(null), 1000);

    // Apply damage to enemy
    const newHealth = Math.max(0, enemyHealth - damage);
    setEnemyHealth(newHealth);

    // Check for victory
    if (newHealth <= 0) {
      addBattleLog(`💥 ${currentEnemy.name} defeated! +${currentEnemy.xpReward} XP earned!`);
      endBattle(true);

      // Complete battle in character state
      const result = completeBattle(character, currentEnemy, selectedExercise, reps);
      dispatch({ type: 'COMPLETE_WORKOUT', payload: result });
    } else {
      addBattleLog(`💥 Dealt ${damage} damage! Enemy has ${newHealth} HP remaining`);
    }

    setTimeout(() => {
      setIsAttacking(false);
    }, 500);
  };

  const resetBattle = () => {
    if (selectedBodyPart) {
      const enemy = getRandomEnemy(selectedBodyPart, character.unlockedZones[0]);
      setCurrentEnemy(enemy);
      setEnemyHealth(enemy.health);
      setSelectedExercise(null);
    }
  };

  if (!selectedBodyPart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-red-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={returnToDashboard} className="mb-6">
            ← Back to Dashboard
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-white mb-4 text-glow">
              ⚔️ Battle Arena
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Choose your weapon - which body part will you train?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(BODY_PART_NAMES).map(([key, name]) => (
                <motion.button
                  key={key}
                  onClick={() => startBattle(key)}
                  className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-xl hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-6xl mb-4">{BODY_PART_EMOJIS[key]}</div>
                  <div className="text-2xl font-bold">{name}</div>
                  <div className="text-sm text-indigo-200 mt-2">
                    {key === 'arms' && 'Fight with powerful strikes'}
                    {key === 'legs' && 'Dash and strike with speed'}
                    {key === 'core' && 'Defend and counterattack'}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-red-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={returnToDashboard}>
            ← Exit Battle
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              {BODY_PART_EMOJIS[selectedBodyPart]} {BODY_PART_NAMES[selectedBodyPart]} Training
            </h2>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enemy Side */}
          <div className="space-y-6">
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm border border-red-800/50 rounded-2xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <Sword className="text-red-400" size={24} />
                Enemy: {currentEnemy?.name}
              </h3>

              <div className="text-center mb-6">
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {currentEnemy?.emoji}
                </motion.div>
                <p className="text-gray-400">{currentEnemy?.description}</p>
              </div>

              {/* Enemy health bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-red-400 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    HP
                  </span>
                  <span className="text-white font-bold tabular-nums">
                    {enemyHealth} / {currentEnemy?.maxHealth}
                  </span>
                </div>
                <div className="w-full bg-gray-900/80 rounded-full overflow-hidden h-4 relative border border-gray-700/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full relative"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(enemyHealth / currentEnemy?.maxHealth) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    {/* Animated stripe */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-shimmer" />
                  </motion.div>
                  {/* Danger flash when low health */}
                  {enemyHealth / currentEnemy?.maxHealth < 0.3 && (
                    <motion.div
                      className="absolute inset-0 bg-red-500/20"
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>

              {/* Battle Log */}
              <div className="bg-gray-800/50 rounded-xl p-4 h-48 overflow-y-auto">
                <div className="text-sm space-y-2">
                  {battleLog.map((log) => (
                    <div key={log.id} className="text-gray-300 border-l-2 border-indigo-500 pl-2">
                      {log.message}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Player Side */}
          <div className="space-y-6">
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm border border-indigo-800/50 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                <Target className="text-indigo-400" size={24} />
                Choose Attack
              </h3>

              {/* Exercise Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {exercises.map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    className={`
                      relative p-4 rounded-xl cursor-pointer border-2 transition-all overflow-hidden
                      ${selectedExercise?.id === exercise.id
                        ? 'border-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/20'
                        : 'border-gray-700/60 bg-gray-900/40 hover:border-indigo-500/50 hover:bg-gray-800/40'
                      }
                    `}
                    onClick={() => handleExerciseSelect(exercise)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Selection glow */}
                    {selectedExercise?.id === exercise.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}

                    <div className="relative z-10">
                      <div className="text-3xl mb-3 filter drop-shadow-md">{exercise.icon}</div>
                      <div className="font-bold text-white text-lg mb-1">{exercise.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          exercise.difficulty === 1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          exercise.difficulty === 2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {exercise.difficulty === 1 && 'Easy'}
                          {exercise.difficulty === 2 && 'Medium'}
                          {exercise.difficulty === 3 && 'Hard'}
                        </span>
                      </div>
                    </div>

                    {selectedExercise?.id === exercise.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {selectedExercise && (
                <>
                  {/* Reps Slider */}
                  <div className="mb-6">
                    <label className="text-sm text-gray-400 block mb-2">
                      Number of reps: <span className="text-white font-bold">{reps}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={reps}
                      onChange={(e) => setReps(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>

                  {/* Attack Button */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button glow */}
                    <motion.div
                      className="absolute -inset-2 rounded-2xl blur-md -z-10 bg-gradient-to-r from-red-500/40 to-orange-500/40"
                      animate={{ opacity: [0.4, 0.6, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Button
                      size="large"
                      onClick={performAttack}
                      disabled={isAttacking}
                      className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 shadow-lg shadow-red-900/50"
                    >
                      {isAttacking ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                          >
                            <Zap className="mr-2" size={24} />
                          </motion.div>
                          <span className="font-black tracking-wider">ATTACKING!</span>
                        </>
                      ) : (
                        <>
                          <Sword className="mr-2" size={24} />
                          <span className="font-black tracking-wider">⚔️ ATTACK!</span>
                          <span className="ml-2 text-sm font-semibold opacity-80">
                            ({reps} {reps === 1 ? 'rep' : 'reps'})
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* XP Preview */}
                  <motion.div
                    className="mt-4 p-4 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-500/30 rounded-xl text-center relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-shimmer" />
                    <div className="relative z-10">
                      <div className="text-sm text-indigo-300 mb-1 font-medium">Expected XP</div>
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        +{selectedExercise.xpReward * 3}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {!selectedExercise && (
                <div className="text-center py-8 text-gray-500">
                  <Target size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Select an exercise to attack</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Victory Modal */}
      <Modal
        isOpen={showVictory}
        onClose={() => {}} // Must reset first
        title="🎉 Victory!"
        size="medium"
      >
        <div className="text-center">
          <motion.div
            className="text-7xl mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            🏆
          </motion.div>

          <motion.p
            className="text-2xl text-white mb-3 font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You defeated {currentEnemy?.name}!
          </motion.p>

          <motion.p
            className="text-xl font-black mb-8 bg-gradient-to-r from-[#ffd699] via-[#ffcc00] to-[#ffd699] bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            +{currentEnemy?.xpReward} XP Earned!
          </motion.p>

          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 rounded-xl p-5 border border-indigo-500/30 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-indigo-400 text-sm font-semibold mb-1">LEVEL</div>
              <div className="text-3xl font-black text-white">{character.level}</div>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 rounded-xl p-5 border border-emerald-500/30 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="text-emerald-400 text-sm font-semibold mb-1">TOTAL XP</div>
              <div className="text-3xl font-black text-white">{character.xp}</div>
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={() => { endBattle(false); resetBattle(); }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30"
              >
                🔄 Fight Next Enemy
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button variant="secondary" onClick={returnToDashboard} className="w-full">
                Return to Dashboard
              </Button>
            </motion.div>
          </div>
        </div>
      </Modal>

      {/* Defeat Modal */}
      <Modal
        isOpen={showDefeat}
        onClose={() => {}}
        title="💀 Defeated"
        size="medium"
      >
        <div className="text-center">
          <motion.div
            className="text-7xl mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            😤
          </motion.div>

          <motion.p
            className="text-2xl text-white mb-3 font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The {currentEnemy?.name} was too strong!
          </motion.p>

          <motion.p
            className="text-gray-400 text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Train more and come back stronger!
          </motion.p>

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={resetBattle}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <RotateCcw className="mr-2" size={20} />
                Try Again
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button variant="secondary" onClick={returnToDashboard} className="w-full">
                Train First
              </Button>
            </motion.div>
          </div>
        </div>
      </Modal>

      {/* Floating Damage */}
      <AnimatePresence>
        {damageNumber && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ scale: 0, y: 0, opacity: 1 }}
            animate={{ scale: 1.5, y: -80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-orange-400 to-red-600 drop-shadow-[0_4px_8px_rgba(220,38,38,0.6)] filter">
              -{damageNumber}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleArena;
