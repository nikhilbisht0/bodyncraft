import { useReducedMotion } from 'framer-motion';

/**
 * Custom hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion (accessibility setting)
 */
export const useReducedMotion = () => {
  const shouldReduceMotion = useReducedMotion();
  return shouldReduceMotion;
};

/**
 * Get motion config based on user preference
 * @param {Object} defaultConfig - The default motion configuration
 * @param {Object} reducedConfig - The configuration to use when motion is reduced
 * @returns {Object} - Appropriate motion configuration
 */
export const getMotionConfig = (defaultConfig, reducedConfig = {}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {
      ...defaultConfig,
      transition: { duration: 0.01 },
      animate: false,
      ...reducedConfig,
    };
  }

  return defaultConfig;
};
