import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swords, Map, GitBranch, Zap, Target, Award, Flame, TrendingUp, Sparkles } from 'lucide-react';
import AvatarDisplay from '../Avatar/AvatarDisplay';
import StatsPanel from './StatsPanel';
import XPProgress from './XPProgress';
import StreakCounter from './StreakCounter';
import WorkoutLog from './WorkoutLog';
import CalorieTracker from './CalorieTracker';
import { useCharacter } from '../../contexts/CharacterContext';
import { useGame } from '../../contexts/GameContext';

const Dashboard = () => {
  const { state } = useCharacter();
  const { startBattle, setCurrentMode } = useGame();

  const quickActions = useMemo(() => [
    {
      icon: Swords,
      label: 'Battle',
      color: 'from-amber-500 via-orange-500 to-amber-600',
      description: 'Fight enemies & gain XP',
      action: () => startBattle('arms'),
      isNew: false,
      glowColor: 'rgba(251, 146, 60, 0.5)',
    },
    {
      icon: Map,
      label: 'Adventure',
      color: 'from-cyan-500 via-blue-500 to-cyan-600',
      description: 'Explore territories',
      action: () => setCurrentMode('adventure'),
      disabled: true, // Coming soon
      isNew: false,
      glowColor: 'rgba(6, 182, 212, 0.5)',
    },
    {
      icon: GitBranch,
      label: 'Skill Tree',
      color: 'from-violet-500 via-purple-500 to-violet-600',
      description: 'Unlock powerful abilities',
      action: () => setCurrentMode('skilltree'),
      disabled: false,
      isNew: true,
      glowColor: 'rgba(139, 92, 246, 0.5)',
    },
  ], [startBattle, setCurrentMode]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? '#58cc02' : i % 3 === 1 ? '#ff9600' : '#1cb0f6',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80, -20],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-16 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Enhanced animated background with multiple layers */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#58cc02]/30 via-[#ff9600]/15 to-[#58cc02]/30 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#58cc02]/20 via-[#ffd699]/10 to-[#58cc02]/20 rounded-full blur-2xl animate-pulse" />
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 left-1/4 w-24 h-1 bg-gradient-to-r from-transparent via-[#58cc02]/60 to-transparent"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-4 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-[#ffd699]/50 to-transparent"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />

          <motion.h1
            className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-4 relative tracking-wide"
            initial={{ letterSpacing: '0.05em' }}
            animate={{
              letterSpacing: ['0.02em', '0.08em', '0.02em'],
              textShadow: [
                '0 0 20px rgba(88, 204, 2, 0.4), 0 3px 20px rgba(88, 204, 2, 0.2)',
                '0 0 40px rgba(88, 204, 2, 0.6), 0 6px 40px rgba(88, 204, 2, 0.4)',
                '0 0 20px rgba(88, 204, 2, 0.4), 0 3px 20px rgba(88, 204, 2, 0.2)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58cc02] via-[#ffd699] to-[#58cc02] bg-[length:200%_100%] animate-gradient drop-shadow-2xl">
              BODYCRAFT
            </span>
          </motion.h1>

          <motion.div
            className="h-1 w-32 md:w-48 mx-auto bg-gradient-to-r from-transparent via-[#58cc02]/50 to-transparent mb-4 rounded-full"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.p
            className="text-lg md:text-2xl text-gray-300 font-semibold tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Build Your Character IRL
          </motion.p>

          {state.level > 1 && (
            <motion.div
              className="inline-flex items-center gap-4 px-8 py-3 bg-gradient-to-r from-[#58cc02]/25 via-[#46a302]/25 to-[#58cc02]/25 border-2 border-[#58cc02]/50 rounded-2xl shadow-2xl shadow-[#58cc02]/20 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-[#58cc02] to-[#46a302] rounded-xl">
                  <span className="text-white font-bold text-xl">Lv</span>
                </div>
                <div>
                  <div className="text-[#58cc02] font-black text-2xl tracking-tight">
                    {state.level}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Level</div>
                </div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#58cc02]/30 to-transparent" />
              <div>
                <div className="text-indigo-400 font-bold text-2xl tracking-tight">
                  {state.xp}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Experience</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Avatar & Stats */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="lg:sticky lg:top-6 lg:self-start">
              <div className="relative">
                {/* Decorative corner accents */}
                <div className="absolute -top-2 -left-2 w-16 h-16 border-t-2 border-l-2 border-[#58cc02]/30 rounded-tl-lg" />
                <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-2 border-r-2 border-[#58cc02]/30 rounded-br-lg" />
                <AvatarDisplay character={state} size="medium" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsPanel />
            </motion.div>
          </div>

          {/* Right Column - Actions & Progress */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Quick Actions Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
            >
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={action.action}
                  disabled={action.disabled}
                  className={`
                    relative group p-6 md:p-7 rounded-3xl text-left
                    bg-gradient-to-br ${action.color}
                    shadow-xl hover:shadow-2xl
                    transition-all duration-300 ease-out
                    backdrop-blur-sm
                    ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2'}
                  `}
                  variants={itemVariants}
                  whileHover={action.disabled ? {} : { scale: 1.03, y: -6 }}
                  whileTap={action.disabled ? {} : { scale: 0.97 }}
                >
                  {/* Multi-layer glow effect */}
                  {!action.disabled && (
                    <>
                      <motion.div
                        className="absolute -inset-3 rounded-4xl blur-2xl -z-10"
                        style={{ backgroundColor: action.glowColor }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 0.5, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.div
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </>
                  )}

                  {/* Premium NEW badge */}
                  {action.isNew && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180, x: 20, y: -20 }}
                      animate={{ scale: 1, rotate: 0, x: 0, y: 0 }}
                      className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 via-pink-600 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl z-20 border-2 border-white/30 flex items-center gap-1"
                    >
                      <span className="relative z-10">NEW</span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  )}

                  {/* Icon with enhanced styling */}
                  <div className="mb-5 flex items-center justify-between">
                    <motion.div
                      className="p-5 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 relative overflow-hidden"
                      whileHover={{
                        rotate: action.disabled ? 0 : [0, -5, 5, 0],
                        scale: 1.08
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10
                      }}
                    >
                      {/* Inner glow on icon */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                      <action.icon size={36} className="text-white relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]" />
                    </motion.div>
                    <motion.span
                      className="text-5xl font-bold text-white/80 drop-shadow-xl"
                      animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      {action.icon === Swords && '⚔️'}
                      {action.icon === Map && '🗺️'}
                      {action.icon === GitBranch && '🌳'}
                    </motion.span>
                  </div>

                  {/* Label with better typography */}
                  <div className="relative mb-2">
                    <div className="font-black text-3xl text-white mb-1 tracking-tight drop-shadow-lg">
                      {action.label}
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
                  </div>

                  {/* Description with improved styling */}
                  <div className="text-sm md:text-base text-white/90 leading-relaxed font-medium">
                    {action.description}
                  </div>

                  {/* Disabled overlay with blur */}
                  {action.disabled && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 rounded-3xl flex items-center justify-center backdrop-blur-[3px]"
                    >
                      <div className="text-center">
                        <span className="text-white font-black text-2xl mb-2 block">COMING SOON</span>
                        <div className="text-gray-400 text-sm">Under Development</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Dynamic bottom border accent */}
                  {!action.disabled && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-2 rounded-b-3xl"
                      initial={{ opacity: 0.3 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`h-full bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-b-3xl`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </motion.div>
                  )}

                  {/* Corner glow accents */}
                  {!action.disabled && (
                    <>
                      <motion.div
                        className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.6 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-lg"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.4 }}
                        transition={{ duration: 0.3 }}
                      />
                    </>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Stats Row - XP & Streak */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <motion.div variants={itemVariants}>
                <XPProgress />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StreakCounter />
              </motion.div>
            </motion.div>

            {/* Workout Log */}
            <motion.div variants={itemVariants}>
              <WorkoutLog />
            </motion.div>

            {/* Daily Goal Card */}
            <motion.div
              variants={itemVariants}
              className="relative glass-card glass-card-hover p-6 md:p-7 overflow-hidden group"
              whileHover={{ scale: 1.01, y: -2 }}
            >
              {/* Multi-layer animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#58cc02]/15 via-[#46a302]/10 to-[#58cc02]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="p-5 bg-gradient-to-br from-[#58cc02] via-[#6ee10a] to-[#46a302] rounded-2xl shadow-2xl shadow-[#58cc02]/40 border-2 border-[#58cc02]/30 relative overflow-hidden"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.1, rotate: 0 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl" />
                    <Target className="text-white relative z-10" size={30} strokeWidth={2.5} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight">DAILY GOAL</h3>
                    <p className="text-sm text-gray-400 font-semibold">Complete workout to maintain streak</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#58cc02] to-[#46a302]">
                      {state.totalWorkouts % 1}/1
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today</div>
                  </div>
                </div>

                {/* Enhanced progress bar */}
                <div className="relative mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-300">Progress</span>
                    <span className="text-sm font-bold text-[#58cc02] font-mono">
                      {Math.round((state.totalWorkouts % 1) * 100)}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-full h-6 overflow-hidden border-2 border-gray-700/50 shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#58cc02] via-[#6ee10a] to-[#46a302] rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (state.totalWorkouts % 1) * 100)}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                    {state.totalWorkouts % 1 === 1 && (
                      <motion.div
                        className="absolute -right-3 -top-2 w-8 h-8 bg-gradient-to-br from-[#58cc02] to-[#46a302] rounded-full shadow-2xl shadow-[#58cc02]/50 flex items-center justify-center border-2 border-white"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 400 }}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <CheckCircle size={16} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Motivational message */}
                {state.totalWorkouts % 1 === 0 && (
                  <motion.div
                    className="text-center py-3 px-4 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-xl border border-yellow-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-sm font-semibold text-yellow-400">
                      🎯 One workout completed = streak maintained!
                    </div>
                  </motion.div>
                )}

                {/* Decorative bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#58cc02]/40 to-transparent" />
              </div>
            </motion.div>

            {/* Calorie Tracker Card */}
            <CalorieTracker />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-gray-500 text-sm font-medium">
            Every rep = experience. Every workout = power.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Train hard. Level up. Become legendary.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
