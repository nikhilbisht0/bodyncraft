import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({
  value,
  max,
  label,
  color = 'bg-gradient-to-r from-[#58cc02] to-[#46a302]',
  showLabel = true,
  size = 'medium',
  animated = true,
  showGlow = true,
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const sizes = {
    small: 'h-1.5',
    medium: 'h-3',
    large: 'h-4',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-gray-400 font-medium">{label}</span>
          <span className="text-sm font-bold text-white">
            {value} / {max}
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-900 rounded-full overflow-hidden ${sizes[size]} shadow-inner`}>
        <motion.div
          className={`h-full ${color} rounded-full relative progress-glow`}
          style={showGlow ? { boxShadow: '0 0 10px rgba(88, 204, 2, 0.5)' } : {}}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Animated shimmer stripe */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] animate-shimmer" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
