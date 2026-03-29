import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Target } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';
import ProgressBar from '../Common/ProgressBar';

const XPProgress = () => {
  const { state } = useCharacter();
  const progressPercentage = (state.xp / state.xpToNextLevel) * 100;

  return (
    <motion.div
      className="relative glass-card glass-card-hover p-6 md:p-7 overflow-hidden group"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.01, y: -3 }}
    >
      {/* Enhanced background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-[#7e22ce]/5 to-[#a855f7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        {/* Header with icon and level */}
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            className="p-4 bg-gradient-to-br from-[#a855f7] via-[#9333ea] to-[#7e22ce] rounded-2xl shadow-xl shadow-[#a855f7]/30 border border-[#a855f7]/20 relative overflow-hidden"
            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            <Star className="text-white relative z-10" size={26} strokeWidth={2.5} />
          </motion.div>

          <div className="flex-1">
            <h3 className="text-xl font-black text-white mb-1 tracking-tight">EXPERIENCE</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Level {state.level}</p>
          </div>

          <motion.div
            className="text-right"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#a855f7] via-[#c084fc] to-[#7e22ce] drop-shadow-lg">
              {state.level}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Current</div>
          </motion.div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-300">Progress to Next Level</span>
            <span className="text-sm font-mono text-[#58cc02] font-bold">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <ProgressBar
            value={state.xp}
            max={state.xpToNextLevel}
            color="bg-gradient-to-r from-[#58cc02] via-[#6ee10a] to-[#46a302]"
            size="large"
            label=""
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500 font-mono">{state.xp} XP</span>
            <span className="text-xs text-gray-500 font-mono">{state.xpToNextLevel} XP</span>
          </div>
        </div>

        {/* XP Remaining Badge */}
        <motion.div
          className="mb-5 p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1 font-medium">Remaining to Level Up</div>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#58cc02] to-[#46a302]">
              {Math.floor(state.xpToNextLevel - state.xp)}
              <span className="text-lg text-gray-500 font-normal ml-1">XP</span>
            </div>
          </div>
        </motion.div>

        {/* Workout XP Estimates */}
        <motion.div
          className="p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl border border-gray-700/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-sm text-gray-400 mb-3 text-center font-semibold flex items-center justify-center gap-2">
            <Zap size={14} className="text-[#58cc02]" />
            Estimated XP per Workout
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Arms', value: '~15', color: 'orange', icon: '💪' },
              { label: 'Legs', value: '~15', color: 'blue', icon: '🦵' },
              { label: 'Core', value: '~10', color: 'green', icon: '🧱' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className={`bg-${stat.color}-500/10 border border-${stat.color}-500/30 rounded-xl p-3 text-center hover:bg-${stat.color}-500/15 transition-colors`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className={`text-${stat.color}-400 font-black text-2xl mb-1`}>{stat.value}</div>
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <span>{stat.icon}</span>
                  <span>{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent" />
      </div>
    </motion.div>
  );
};

export default XPProgress;
