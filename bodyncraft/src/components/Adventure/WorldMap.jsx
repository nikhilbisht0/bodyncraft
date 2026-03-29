import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock, Star, ArrowRight } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';
import { zones } from '../../data/zones';

const WorldMap = () => {
  const { state } = useCharacter();

  // Filter unlocked zones
  const unlockedIndices = state.unlockedZones.map(z => zones.findIndex(zone => zone.id === z)).filter(i => i !== -1);
  const maxUnlockedIndex = unlockedIndices.length > 0 ? Math.max(...unlockedIndices) : -1;

  const getZoneStatus = (zone, index) => {
    const isUnlocked = state.unlockedZones.includes(zone.id);
    const isNextZone = index === maxUnlockedIndex + 1;
    return { isUnlocked, isNextZone };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🌍 World Map
          </h1>
          <p className="text-gray-400">
            Explore territories and conquer challenges
          </p>
        </motion.div>

        {/* Map Progress */}
        <div className="mb-8 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl">
          <div className="text-sm text-gray-400 mb-2">Progress</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white">
              {state.unlockedZones.length} / {zones.length} zones unlocked
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-indigo-400">
              Highest: {zones[Math.max(0, maxUnlockedIndex)]?.name || 'None'}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(state.unlockedZones.length / zones.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Zone Cards */}
        <div className="space-y-6">
          {zones.map((zone, index) => {
            const { isUnlocked, isNextZone } = getZoneStatus(zone, index);
            const isPreviousUnlocked = index <= maxUnlockedIndex;

            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 overflow-hidden ${
                  isUnlocked
                    ? 'border-emerald-600/50 bg-emerald-900/20'
                    : isNextZone
                    ? 'border-yellow-600/50 bg-yellow-900/10'
                    : 'border-gray-800 bg-gray-900/30 opacity-60'
                }`}
              >
                {/* Zone Header */}
                <div className={`p-6 ${zone.emojiBg} bg-opacity-30`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{zone.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{zone.name}</h3>
                        <p className="text-gray-300">{zone.description}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      isUnlocked
                        ? 'bg-emerald-600 text-white'
                        : isNextZone
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {isUnlocked ? '✓ Unlocked' : isNextZone ? '🔒 Next' : '🔒 Locked'}
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="p-4 bg-black/20">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Required Level:</span>
                      <span className={`ml-2 font-bold ${state.level >= zone.requiredLevel ? 'text-emerald-400' : 'text-red-400'}`}>
                        {zone.requiredLevel} (You: {state.level})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Required Stat:</span>
                      <span className={`ml-2 font-bold ${Math.max(state.stats.strength, state.stats.endurance, state.stats.core) >= zone.requiredStat ? 'text-emerald-400' : 'text-red-400'}`}>
                        {zone.requiredStat} (Best: {Math.max(state.stats.strength, state.stats.endurance, state.stats.core)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="p-4 border-t border-gray-800/30">
                  <div className="text-sm text-gray-400 mb-2">Rewards</div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={16} />
                      <span className="text-white">{Math.round(zone.rewards.xpBonus * 100)}% XP Bonus</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-400">{Math.round(zone.rewards.rareDropChance * 100)}%</span>
                      <span className="text-gray-300">Rare Drop Chance</span>
                    </div>
                  </div>
                </div>

                {/* Unlock indicator or action */}
                {isUnlocked ? (
                  <div className="p-4 bg-emerald-900/30 border-t border-emerald-800/30">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 text-sm">
                        {isPreviousUnlocked && index < maxUnlockedIndex
                          ? '✓ Completed'
                          : '🎮 Ready to Explore'}
                      </span>
                      <motion.button
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Enter Zone
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-900/30 border-t border-gray-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Lock size={16} />
                      <span className="text-sm">
                        {index <= maxUnlockedIndex
                          ? 'Complete previous zones first'
                          : 'Keep training to unlock!'}
                      </span>
                    </div>
                    {isNextZone && (
                      <ArrowRight className="text-yellow-500" size={20} />
                    )}
                  </div>
                )}

                {/* Connect to next zone */}
                {index < zones.length - 1 && isUnlocked && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="text-gray-600" size={24} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WorldMap;
