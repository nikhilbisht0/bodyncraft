import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAvatar } from '../../utils/avatarEvolution';
import { useCharacter } from '../../contexts/CharacterContext';
import { useGame } from '../../contexts/GameContext';

const AvatarDisplay = ({ character, size = 'medium' }) => {
  const { state } = useCharacter();
  const { startBattle } = useGame();
  const stats = character?.stats || state.stats;
  const avatar = useMemo(() => generateAvatar(stats), [stats]);
  const [prevStages, setPrevStages] = useState(avatar.bodyPartStages);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);

  // Detect stage changes for animation
  useEffect(() => {
    const hasChanged = Object.keys(avatar.bodyPartStages).some(
      (bp) => prevStages[bp] !== avatar.bodyPartStages[bp]
    );
    if (hasChanged) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevStages(avatar.bodyPartStages);
  }, [avatar.bodyPartStages, prevStages]);

  // Check if a body part stage changed
  const stageChanged = (bodyPart) => {
    return prevStages[bodyPart] !== avatar.bodyPartStages[bodyPart];
  };

  const sizes = {
    small: { width: 160, height: 220, containerScale: 0.7 },
    medium: { width: 240, height: 320, containerScale: 0.9 },
    large: { width: 300, height: 400, containerScale: 1.1 },
  };

  const { width, height, containerScale } = sizes[size];

  // Find the strongest body part
  const maxStat = Math.max(state.stats.strength, state.stats.endurance, state.stats.core);
  const strongestPart = state.stats.strength === maxStat ? 'arms' :
                       state.stats.endurance === maxStat ? 'legs' : 'core';

  const bodyParts = [
    {
      key: 'arms',
      label: 'Arms',
      icon: '💪',
      stat: state.stats.strength,
      stage: avatar.bodyPartStages.arms,
      stageName: avatar.stageNames.arms,
      color: avatar.colors.arms.start,
      glowColor: avatar.glowColors.arms,
      description: 'Train arms for powerful strikes',
    },
    {
      key: 'upper',
      label: 'Chest',
      icon: '🏋️',
      stat: state.stats.strength,
      stage: avatar.bodyPartStages.upper,
      stageName: avatar.stageNames.upper,
      color: avatar.colors.chest.start, // Use chest color (same as back in yellow scheme)
      glowColor: avatar.glowColors.chest,
      description: 'Train chest and back',
    },
    {
      key: 'core',
      label: 'Core',
      icon: '🧱',
      stat: state.stats.core,
      stage: avatar.bodyPartStages.core,
      stageName: avatar.stageNames.core,
      color: avatar.colors.core.start,
      glowColor: avatar.glowColors.core,
      description: 'Train core for stability and power',
    },
    {
      key: 'legs',
      label: 'Legs',
      icon: '🦵',
      stat: state.stats.endurance,
      stage: avatar.bodyPartStages.legs,
      stageName: avatar.stageNames.legs,
      color: avatar.colors.legs.start,
      glowColor: avatar.glowColors.legs,
      description: 'Train legs for speed and endurance',
    },
  ];

  // SVG Gradient definitions
  const gradientDefs = useMemo(() => (
    <defs>
      <linearGradient id={avatar.gradientIds.arms} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={avatar.colors.arms.start} />
        <stop offset="100%" stopColor={avatar.colors.arms.end} />
      </linearGradient>
      <linearGradient id={avatar.gradientIds.legs} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={avatar.colors.legs.start} />
        <stop offset="100%" stopColor={avatar.colors.legs.end} />
      </linearGradient>
      <linearGradient id={avatar.gradientIds.core} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={avatar.colors.core.start} />
        <stop offset="100%" stopColor={avatar.colors.core.end} />
      </linearGradient>
      <linearGradient id={avatar.gradientIds.back} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={avatar.colors.back.start} />
        <stop offset="100%" stopColor={avatar.colors.back.end} />
      </linearGradient>
      <linearGradient id={avatar.gradientIds.chest} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={avatar.colors.chest.start} />
        <stop offset="100%" stopColor={avatar.colors.chest.end} />
      </linearGradient>
      <linearGradient id={avatar.gradientIds.upper} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={avatar.colors.chest.start} />
        <stop offset="100%" stopColor={avatar.colors.chest.end} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="strongGlow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="muscleShadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="1" dy="1" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0.5 0"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="hoverGlow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  ), [avatar]);

  const handleBodyPartClick = (bodyPartKey) => {
    // Map 'back', 'chest', and 'upper' to 'arms' for battles (back and chest exercises not yet implemented)
    const battleBodyPart = bodyPartKey === 'back' || bodyPartKey === 'chest' || bodyPartKey === 'upper' ? 'arms' : bodyPartKey;
    startBattle(battleBodyPart);
  };

  const containerVariants = {
    initial: { scale: 0.8, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  };

  const statCardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, y: -4 },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: [0, -5, 5, 0] }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-4 py-2 bg-gradient-to-r from-[#ffd699] via-[#ffcc00] to-[#ffd699] text-[#1a1a2e] font-bold rounded-full shadow-xl shadow-[#ffd699]/50 text-sm border border-[#ffcc00]/30">
              ⬆️ Stage Up!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Container */}
      <div className="relative" style={{ transform: `scale(${containerScale})` }}>
        {/* Ambient glow based on strongest body part */}
        <motion.div
          className="absolute -inset-12 rounded-full blur-3xl -z-10"
          style={{ backgroundColor: avatar.glowColors[strongestPart] }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Avatar SVG */}
        <svg
          width={width}
          height={height}
          viewBox="0 0 300 400"
          className="drop-shadow-2xl"
        >
          {gradientDefs}

          {/* Background glow ellipse */}
          <ellipse
            cx="150"
            cy="385"
            rx="95"
            ry="20"
            fill={avatar.glowColors[strongestPart]}
            opacity={0.4}
          >
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Left Leg */}
          <motion.path
            d={avatar.parts.leftLeg}
            fill={`url(#${avatar.gradientIds.legs})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            filter="url(#glow)"
            onMouseEnter={() => setHoveredPart('legs')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('legs')}
            style={{ cursor: 'pointer' }}
          />

          {/* Right Leg */}
          <motion.path
            d={avatar.parts.rightLeg}
            fill={`url(#${avatar.gradientIds.legs})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            filter="url(#glow)"
            onMouseEnter={() => setHoveredPart('legs')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('legs')}
            style={{ cursor: 'pointer' }}
          />

          {/* Back/Shoulders */}
          <motion.path
            d={avatar.parts.back?.shape || avatar.parts.back}
            fill={`url(#${avatar.gradientIds.back})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            filter="url(#glow)"
            onMouseEnter={() => setHoveredPart('upper')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('upper')}
            style={{ cursor: 'pointer' }}
          />

          {/* Chest */}
          <motion.path
            d={avatar.parts.chest?.shape || avatar.parts.chest}
            fill={`url(#${avatar.gradientIds.chest})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
            filter="url(#glow)"
            onMouseEnter={() => setHoveredPart('upper')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('upper')}
            style={{ cursor: 'pointer' }}
          />

          {/* Core/Torso */}
          <motion.path
            d={avatar.parts.core?.shape || avatar.parts.core}
            fill={`url(#${avatar.gradientIds.core})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            filter="url(#glow)"
            onMouseEnter={() => setHoveredPart('core')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('core')}
            style={{ cursor: 'pointer' }}
          />

          {/* Left Arm */}
          <motion.path
            d={avatar.parts.leftArm}
            fill={`url(#${avatar.gradientIds.arms})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
            filter="url(#glow)"
            pointerEvents="none"
          />

          {/* Right Arm */}
          <motion.path
            d={avatar.parts.rightArm}
            fill={`url(#${avatar.gradientIds.arms})`}
            stroke="#1a1a2e"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            filter="url(#glow)"
            pointerEvents="none"
          />

          {/* Invisible hit areas for arms (to avoid blocking chest/back) */}
          <rect
            x="75"
            y="160"
            width="35"
            height="110"
            fill="transparent"
            pointerEvents="all"
            onMouseEnter={() => setHoveredPart('arms')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('arms')}
            style={{ cursor: 'pointer' }}
          />
          <rect
            x="195"
            y="160"
            width="35"
            height="110"
            fill="transparent"
            pointerEvents="all"
            onMouseEnter={() => setHoveredPart('arms')}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleBodyPartClick('arms')}
            style={{ cursor: 'pointer' }}
          />

          {/* Head */}
          <motion.circle
            cx="150"
            cy="95"
            r="38"
            fill={avatar.colors.core.start}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7, type: 'spring' }}
          />

          {/* Head highlight */}
          <motion.circle
            cx="140"
            cy="85"
            r="12"
            fill="rgba(255,255,255,0.15)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />

          {/* Face features */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.1 }}>
            <circle cx="140" cy="92" r="3" fill="#1a1a2e" />
            <circle cx="160" cy="92" r="3" fill="#1a1a2e" />
            <path d="M 142 105 Q 150 112 158 105" fill="#1a1a2e" />
          </motion.g>

          {/* Strongest body part highlight ring */}
          {strongestPart && (
            <motion.circle
              cx={strongestPart === 'core' ? 150 : strongestPart === 'arms' ? 50 : 150}
              cy={strongestPart === 'core' ? 235 : strongestPart === 'arms' ? 195 : 340}
              r={strongestPart === 'core' ? 60 : strongestPart === 'arms' ? 60 : 65}
              fill="none"
              stroke={avatar.glowColors[strongestPart]}
              strokeWidth="4"
              strokeDasharray="8,4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </svg>

        {/* Hover pulse effect */}
        <AnimatePresence>
          {hoveredPart && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: hoveredPart === 'arms' ? '53%' : hoveredPart === 'upper' ? '30%' : hoveredPart === 'core' ? '30%' : '30%',
                  top: hoveredPart === 'arms' ? '36%' : hoveredPart === 'upper' ? '26%' : hoveredPart === 'core' ? '42%' : '75%',
                  width: 120,
                  height: 120,
                  transform: 'translate(-50%, -50%)',
                  border: '4px solid',
                  borderColor: bodyParts.find(bp => bp.key === hoveredPart)?.color || '#58cc02',
                }}
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage badges */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {bodyParts.map((bp) => (
            <motion.div
              key={bp.key}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-lg cursor-pointer ${
                stageChanged(bp.key)
                  ? 'bg-gradient-to-r from-[#ffd699] to-[#ffcc00] text-[#1a1a2e] scale-110'
                  : 'bg-gray-800/90 text-gray-300 border border-gray-600'
              }`}
              style={{ borderColor: bp.color.start }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
              onMouseEnter={() => setHoveredPart(bp.key)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleBodyPartClick(bp.key)}
            >
              {bp.icon} {bp.stageName}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Body part stats cards */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
        {bodyParts.map((bp, index) => {
          const isHovered = hoveredPart === bp.key;
          const isStrongest = strongestPart === bp.key;

          return (
            <motion.div
              key={bp.key}
              className={`glass-card glass-card-hover p-5 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer ${
                isHovered ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''
              }`}
              style={{
                borderColor: isHovered ? bp.color.start : undefined,
                boxShadow: isHovered ? `0 0 30px ${bp.color.start}40` : undefined,
              }}
              variants={statCardVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.1 * index }}
              onMouseEnter={() => setHoveredPart(bp.key)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleBodyPartClick(bp.key)}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: bp.color.start }}
                animate={{ opacity: isHovered ? [0.3, 0.5, 0.3] : [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              />

              {/* Top indicator for strongest */}
              {isStrongest && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ backgroundColor: bp.color.start }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              {/* Icon with hover effect */}
              <motion.div
                className="text-2xl mb-2 filter drop-shadow-lg"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {bp.icon}
              </motion.div>

              {/* Stat value */}
              <motion.div
                className="text-3xl font-black mb-1"
                style={{ color: isHovered ? bp.color.start : bp.color.start || bp.color }}
                animate={{
                  scale: isHovered ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {bp.stat}
              </motion.div>

              {/* Stage badge */}
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">
                Stage {bp.stage + 1}
              </div>

              {/* Progress arc */}
              <div className="relative w-full h-2 flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full border-2 border-gray-800/50" />
                <svg className="absolute w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <motion.path
                    d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
                    fill="none"
                    stroke={bp.color.start}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(100, (bp.stat / 200) * 100)}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${Math.min(100, (bp.stat / 200) * 100)}, 100` }}
                    transition={{ duration: 1.5, delay: 0.5 + index * 0.2, ease: 'easeOut' }}
                  />
                </svg>
              </div>

              {/* Stage name */}
              <div
                className="text-[10px] font-semibold"
                style={{
                  color: isHovered ? bp.color.start : bp.color.start || bp.color,
                  fontWeight: isHovered ? '700' : '600',
                }}
              >
                {bp.stageName}
              </div>

              {/* Hover instruction */}
              {isHovered && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-[10px] font-bold text-white bg-gray-900 px-2 py-1 rounded-full border border-gray-600">
                    Click to train!
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AvatarDisplay;
