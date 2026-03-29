import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Check } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';
import { getSkillTree } from '../../data/skillTrees';
import Button from '../Common/Button';

const SkillTree = () => {
  const { state, dispatch } = useCharacter();
  const [selectedBodyPart, setSelectedBodyPart] = useState('arms');

  const skillTree = useMemo(() => {
    return getSkillTree(selectedBodyPart);
  }, [selectedBodyPart]);

  // Get unlocked skills for this tree
  const unlockedSkillIds = state.skillTreeUnlocks[selectedBodyPart] || [];

  const canUnlockSkill = (skill) => {
    // Check if already unlocked
    if (unlockedSkillIds.includes(skill.id)) return false;

    // Check if has enough skill points
    if (state.skillPoints < skill.cost) return false;

    // Check prerequisites
    if (!skill.requires) return true;
    return skill.requires.every(prereqId => unlockedSkillIds.includes(prereqId));
  };

  const handleUnlockSkill = (skill) => {
    if (canUnlockSkill(skill)) {
      dispatch({
        type: 'UNLOCK_SKILL',
        payload: {
          bodyPart: selectedBodyPart,
          skill: skill,
        },
      });
    }
  };

  const getSkillPosition = (skill) => {
    // Use pre-defined positions from data, scaled to SVG viewbox
    return skill.position;
  };

  const connections = useMemo(() => {
    // Build connections based on prerequisites
    const lines = [];
    skillTree.tree.forEach(skill => {
      if (skill.requires) {
        skill.requires.forEach(prereqId => {
          const prereq = skillTree.tree.find(s => s.id === prereqId);
          if (prereq) {
            lines.push({
              from: prereq.position,
              to: skill.position,
              unlocked: unlockedSkillIds.includes(prereqId),
            });
          }
        });
      }
    });
    return lines;
  }, [skillTree, unlockedSkillIds]);

  const bodyParts = [
    { id: 'arms', name: 'Arms', icon: '💪', color: 'orange' },
    { id: 'legs', name: 'Legs', icon: '🦵', color: 'blue' },
    { id: 'core', name: 'Core', icon: '🧱', color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2 justify-center">
              <Sparkles className="text-indigo-400" size={32} />
              Skill Trees
            </h1>
            <p className="text-gray-400 mt-1">
              Spend skill points to unlock powerful abilities
            </p>
          </div>

          <div className="w-32 text-right">
            <div className="text-3xl font-bold text-indigo-400">{state.skillPoints}</div>
            <div className="text-sm text-gray-400">Skill Points</div>
          </div>
        </div>

        {/* Body Part Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {bodyParts.map((bp) => (
            <motion.button
              key={bp.id}
              onClick={() => setSelectedBodyPart(bp.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedBodyPart === bp.id
                  ? `bg-${bp.color}-600 text-white shadow-lg shadow-${bp.color}-500/30`
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: selectedBodyPart === bp.id ? `var(--color-${bp.color}-600)` : undefined,
              }}
            >
              <span className="text-xl mr-2">{bp.icon}</span>
              {bp.name}
              <div className="text-xs mt-1">
                {state.skillTreeUnlocks[bp.id]?.length || 0} / {skillTree.tree.length} skills
              </div>
            </motion.button>
          ))}
        </div>

        {/* Skill Tree Display */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 relative">
          {/* Draw connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {connections.map((conn, i) => (
              <line
                key={i}
                x1={`${conn.from.x}%`}
                y1={conn.from.y}
                x2={`${conn.to.x}%`}
                y2={conn.to.y}
                stroke={conn.unlocked ? '#6366f1' : '#4b5563'}
                strokeWidth="3"
                strokeDasharray={conn.unlocked ? '0' : '5,5'}
              />
            ))}
          </svg>

          {/* Skill Nodes */}
          <div className="relative" style={{ minHeight: '500px', zIndex: 1 }}>
            {skillTree.tree.map((skill) => {
              const isUnlocked = unlockedSkillIds.includes(skill.id);
              const canUnlock = canUnlockSkill(skill);

              return (
                <motion.div
                  key={skill.id}
                  className="absolute"
                  style={{
                    left: `${skill.position.x}%`,
                    top: skill.position.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className={`w-32 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isUnlocked
                        ? 'bg-indigo-900/80 border-indigo-500'
                        : canUnlock
                        ? 'bg-gray-800 border-yellow-500 hover:border-yellow-400'
                        : 'bg-gray-900/50 border-gray-700 opacity-50'
                    }`}
                    onClick={() => isUnlocked ? null : handleUnlockSkill(skill)}
                    whileHover={canUnlock ? { scale: 1.05 } : {}}
                    whileTap={canUnlock ? { scale: 0.95 } : {}}
                  >
                    {/* Top bar - unlock status */}
                    <div className="flex justify-between items-start mb-2">
                      {isUnlocked ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />
                      )}
                      <div className="text-xs font-bold text-yellow-400">
                        {skill.cost} ⭐
                      </div>
                    </div>

                    {/* Skill name */}
                    <div className="text-sm font-bold text-white mb-1 text-center">
                      {skill.name}
                    </div>

                    {/* Cost display */}
                    {!isUnlocked && (
                      <div className="text-center">
                        <div className="text-xs text-gray-400">{skill.cost} point{skill.cost > 1 ? 's' : ''}</div>
                      </div>
                    )}
                  </motion.div>

                  {/* Position label to help visualize */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    ({skill.position.x}%, {skill.position.y}px)
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Legend</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-900 border-2 border-indigo-500 rounded"></div>
                <span className="text-gray-300">Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 border-2 border-yellow-500 rounded"></div>
                <span className="text-gray-300">Can Unlock</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-900 border-2 border-gray-700 rounded opacity-50"></div>
                <span className="text-gray-300">Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Tree Stats */}
        <motion.div
          className="mt-6 bg-indigo-900/20 border border-indigo-800/50 rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-bold text-indigo-300 mb-4">
            {skillTree.icon} {skillTree.name}
          </h3>
          <p className="text-gray-300 mb-4">{skillTree.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-3">
              <div className="text-sm text-gray-400">Skills Unlocked</div>
              <div className="text-2xl font-bold text-indigo-400">
                {unlockedSkillIds.length} / {skillTree.tree.length}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3">
              <div className="text-sm text-gray-400">Points Spent</div>
              <div className="text-2xl font-bold text-emerald-400">
                {state.skillPoints}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3">
              <div className="text-sm text-gray-400">Stat Bonus</div>
              <div className="text-lg font-bold text-white">
                +{Math.max(...skillTree.tree.filter(s => unlockedSkillIds.includes(s.id)).map(s => s.statBonus[selectedBodyPart] || 0), 0)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillTree;
