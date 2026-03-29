import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Zap, Award } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';

const StreakCounter = () => {
  const { state } = useCharacter();
  const { current, longest } = state.streak;

  const getStreakGradient = (days) => {
    if (days >= 30) return 'from-red-500 via-orange-500 to-red-600';
    if (days >= 14) return 'from-orange-500 via-yellow-500 to-orange-600';
    if (days >= 7) return 'from-yellow-400 via-amber-400 to-yellow-500';
    return 'from-gray-400 via-gray-500 to-gray-600';
  };

  const getStreakColors = (days) => {
    if (days >= 30) return { primary: '#ef4444', secondary: '#f97316', glow: 'rgba(239, 68, 68, 0.4)' };
    if (days >= 14) return { primary: '#f97316', secondary: '#eab308', glow: 'rgba(249, 115, 22, 0.4)' };
    if (days >= 7) return { primary: '#fbbf24', secondary: '#f59e0b', glow: 'rgba(251, 191, 36, 0.4)' };
    return { primary: '#9ca3af', secondary: '#6b7280', glow: 'rgba(156, 163, 175, 0.3)' };
  };

  const colors = getStreakColors(current);
  const streakGradient = getStreakGradient(current);

  return (
    <motion.div
      className="relative glass-card glass-card-hover p-6 md:p-7 overflow-hidden group"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.01, y: -3 }}
    >
      {/* Animated background glow based on streak */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br opacity-30 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${colors.glow} 0%, transparent 50%, ${colors.glow} 100%)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        {/* Header with Fire badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-4 bg-gradient-to-br ${streakGradient} rounded-2xl shadow-xl border ${current >= 7 ? 'border-yellow-400/40' : 'border-white/10'} relative overflow-hidden`}
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent rounded-2xl" />
              <Flame className="text-white relative z-10" size={28} strokeWidth={2.5} />
              {current >= 7 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-xs text-black font-bold">!</span>
                </motion.div>
              )}
            </motion.div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1 tracking-tight">STREAK</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Consistency is Key</p>
            </div>
          </div>

          {current >= 7 && (
            <motion.div
              className="hidden sm:block px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-yellow-400 text-sm font-bold flex items-center gap-1">
                <Zap size={14} />
                ON FIRE!
              </div>
            </motion.div>
          )}
        </div>

        {/* Main streak count */}
        <div className="text-center py-6 mb-4">
          <motion.div
            className="text-7xl md:text-8xl font-black mb-3 inline-block"
            key={current}
            initial={{ scale: 1.5, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 8px 16px ${colors.glow})`,
            }}
          >
            {current}
          </motion.div>
          <div className="text-xl font-bold text-gray-300 tracking-wider">DAYS</div>
        </div>

        {/* Milestone badges */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { days: 3, label: 'START', emoji: '🌟', color: 'violet' },
            { days: 7, label: 'WEEK', emoji: '🔥', color: 'orange' },
            { days: 30, label: 'MONTH', emoji: '👑', color: 'red' },
          ].map((milestone, idx) => (
            <motion.div
              key={idx}
              className={`p-3 rounded-xl text-center border transition-all duration-300 ${
                current >= milestone.days
                  ? `bg-gradient-to-br from-${milestone.color}-500/20 to-${milestone.color}-600/10 border-${milestone.color}-500/40 shadow-lg shadow-${milestone.color}-500/20 scale-105`
                  : 'bg-gray-800/30 border-gray-700/40 opacity-40 hover:opacity-60'
              }`}
              whileHover={{ scale: current >= milestone.days ? 1.08 : 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <div className="text-2xl mb-1">{milestone.emoji}</div>
              <div className={`text-sm font-bold ${current >= milestone.days ? `text-${milestone.color}-400` : 'text-gray-500'}`}>
                {milestone.days}
              </div>
              <div className="text-xs text-gray-500">{milestone.label}</div>
              {current >= milestone.days && (
                <motion.div
                  className="mt-1 text-base"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Best streak & bonus */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <TrendingUp size={20} className="text-yellow-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Best Streak</div>
                <div className="text-2xl font-black text-white">{longest} <span className="text-sm font-normal text-gray-500">days</span></div>
              </div>
            </div>
            {longest > 0 && (
              <div className="text-4xl">🏆</div>
            )}
          </div>

          {/* Streak bonus */}
          {current >= 3 && (
            <motion.div
              className="relative overflow-hidden rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.7 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-yellow-500/20 border border-yellow-500/30 rounded-xl`} />
              <div className="relative p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-yellow-300 font-bold mb-1 flex items-center gap-1">
                    <Zap size={12} />
                    STREAK BONUS
                  </div>
                  <div className="text-sm text-gray-300">
                    Active streak multiplier
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    +{Math.floor(current * 2)}%
                  </div>
                  <div className="text-xs text-gray-400">XP Boost</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Decorative bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      </div>
    </motion.div>
  );
};

export default StreakCounter;
