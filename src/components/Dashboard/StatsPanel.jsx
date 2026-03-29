import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Swords, Flame, Target, TrendingUp, Star, Crown } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';

const StatsPanel = () => {
  const { state } = useCharacter();

  // Calculate XP percentage
  const xpPercentage = (state.xp / state.xpToNextLevel) * 100;

  const statItems = [
    {
      label: 'Level',
      value: state.level,
      icon: Crown,
      color: 'text-[#ffd700]',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      glowColor: 'rgba(255, 215, 0, 0.3)',
      subtitle: `${state.xp} / ${state.xpToNextLevel} XP`,
    },
    {
      label: 'Power',
      value: state.stats.overall,
      icon: Swords,
      color: 'text-[#ff9600]',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      glowColor: 'rgba(255, 150, 0, 0.3)',
      subtitle: 'Overall strength',
    },
    {
      label: 'Workouts',
      value: state.totalWorkouts,
      icon: Target,
      color: 'text-[#1cb0f6]',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      glowColor: 'rgba(28, 176, 246, 0.3)',
      subtitle: 'Total completed',
    },
    {
      label: 'Streak',
      value: state.streak.current,
      icon: Flame,
      color: 'text-[#ff4757]',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      glowColor: 'rgba(255, 71, 87, 0.3)',
      subtitle: `${state.streak.longest} days best`,
      suffix: 'days',
    },
    {
      label: 'Skills',
      value: Object.values(state.skillTreeUnlocks)?.reduce((sum, arr) => sum + arr.length, 0) || 0,
      icon: Star,
      color: 'text-[#a855f7]',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      subtitle: 'Skills unlocked',
    },
  ];

  // Get top stat
  const maxStat = Math.max(state.stats.strength, state.stats.endurance, state.stats.core);
  const topStatLabel = state.stats.strength === maxStat ? '💪 Arms' : state.stats.endurance === maxStat ? '🦵 Legs' : '🧱 Core';

  return (
    <motion.div
      className="glass-card glass-card-hover p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', damping: 20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg">
          <Trophy className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Character Stats</h3>
          <p className="text-sm text-gray-400">{topStatLabel} is your strongest</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`relative p-3 md:p-4 rounded-xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm overflow-hidden`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index + 0.3 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{ backgroundColor: stat.glowColor }}
            />

            {/* Icon */}
            <div className={`${stat.color} mb-2 relative z-10`}>
              <stat.icon size={18} />
            </div>

            {/* Value */}
            <div className="text-2xl font-black text-white mb-1 relative z-10">
              {stat.value}
              {stat.suffix && <span className="text-sm font-normal text-gray-400 ml-1">{stat.suffix}</span>}
            </div>

            {/* Label */}
            <div className="text-xs text-gray-400 relative z-10">{stat.label}</div>

            {/* Subtitle */}
            {stat.subtitle && (
              <div className="text-[10px] text-gray-500 mt-1 relative z-10">{stat.subtitle}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* XP Progress Bar */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-300">Next Level</span>
          <span className="text-sm font-bold text-[#58cc02]">{Math.round(xpPercentage)}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#58cc02] to-[#46a302] rounded-full relative progress-glow"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          >
            {/* Animated stripe */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </motion.div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          {Math.floor(state.xpToNextLevel - state.xp)} XP to level {state.level + 1}
        </div>
      </motion.div>

      {/* Skill Points */}
      {state.skillPoints > 0 && (
        <motion.div
          className="mt-4 p-4 bg-gradient-to-br from-[#a855f7]/20 to-[#7e22ce]/20 border border-[#a855f7]/40 rounded-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#a855f7] rounded-lg">
                <Star size={16} className="text-white" />
              </div>
              <span className="text-[#d8b4fe] font-semibold">Unspent Skill Points</span>
            </div>
            <motion.span
              className="text-3xl font-black text-[#d8b4fe]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {state.skillPoints}
            </motion.span>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-10">
            Visit the Skill Tree to upgrade your abilities
          </p>
        </motion.div>
      )}

      {/* Unlocked Zones */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#1cb0f6]" />
          Unlocked Zones
        </div>
        <div className="flex gap-2 flex-wrap">
          {state.unlockedZones.map((zone, idx) => (
            <motion.span
              key={zone}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + idx * 0.05 }}
              className="px-3 py-1 bg-gradient-to-r from-[#1cb0f6]/20 to-[#0095e8]/20 text-[#1cb0f6] text-xs font-semibold rounded-full border border-[#1cb0f6]/40 shadow-sm"
            >
              {zone.charAt(0).toUpperCase() + zone.slice(1)}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsPanel;
