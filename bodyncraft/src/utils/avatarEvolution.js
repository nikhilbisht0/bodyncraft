// Avatar generation system - creates SVG avatar based on character stats

// Yellow/gold color palette (like the dashboard theme) - unified for all body parts
const YELLOW_PALETTE = {
  0: { start: '#ffd699', end: '#ffcc80' }, // Skinny/Basic - light yellow
  1: { start: '#ffcc00', end: '#ffb800' }, // Fit - golden yellow
  2: { start: '#f59e0b', end: '#d97706' }, // Athletic - amber
  3: { start: '#b45309', end: '#92400e' }, // Muscular - dark amber/orange
};

// SVG path definitions for body parts at different stages
// Each body part has stages 0-3 representing progression from skinny to muscular

const BODY_PART_PATHS = {
  // Left/Right Arms (biceps, triceps, forearms)
  arms: {
    0: { // Skinny
      left: 'M 85 160 Q 70 180 60 220 Q 55 240 65 260 Q 75 280 90 270 Q 100 260 95 240 Q 90 220 95 200 Q 100 180 95 160 Z',
      right: 'M 215 160 Q 230 180 240 220 Q 245 240 235 260 Q 225 280 210 270 Q 200 260 205 240 Q 210 220 205 200 Q 200 180 205 160 Z',
    },
    1: { // Fit
      left: 'M 90 155 Q 72 175 58 225 Q 52 250 65 265 Q 78 280 95 268 Q 108 256 102 238 Q 96 220 100 195 Q 105 170 98 155 Z',
      right: 'M 210 155 Q 228 175 242 225 Q 248 250 235 265 Q 222 280 205 268 Q 192 256 198 238 Q 204 220 200 195 Q 195 170 202 155 Z',
    },
    2: { // Athletic
      left: 'M 95 150 Q 73 170 55 230 Q 48 260 68 270 Q 80 285 100 270 Q 115 255 108 235 Q 100 215 105 185 Q 110 165 102 150 Z',
      right: 'M 205 150 Q 227 170 245 230 Q 252 260 232 270 Q 220 285 200 270 Q 185 255 192 235 Q 200 215 195 185 Q 190 165 198 150 Z',
    },
    3: { // Muscular
      left: 'M 100 145 Q 75 165 50 240 Q 42 270 70 280 Q 85 300 105 285 Q 125 270 115 245 Q 105 220 110 180 Q 115 160 105 145 Z',
      right: 'M 200 145 Q 225 165 250 240 Q 258 270 230 280 Q 215 300 195 285 Q 175 270 185 245 Q 195 220 190 180 Q 185 160 195 145 Z',
    },
  },

  // Chest (pectoral muscles)
  chest: {
    0: { // Skinny - flat chest
      shape: 'M 110 145 Q 130 140 150 138 Q 170 140 190 145 Q 180 185 150 195 Q 120 185 110 145 Z',
    },
    1: { // Fit - slight definition
      shape: 'M 108 143 Q 128 136 150 133 Q 172 136 192 143 Q 182 190 150 200 Q 118 190 108 143 Z',
    },
    2: { // Athletic - defined pecs
      shape: 'M 105 140 Q 125 130 150 126 Q 175 130 195 140 Q 185 195 150 205 Q 115 195 105 140 Z',
    },
    3: { // Muscular - large, defined chest
      shape: 'M 100 135 Q 120 122 150 116 Q 180 122 200 135 Q 190 200 150 212 Q 110 200 100 135 Z',
    },
  },

  // Back (traps, lats, rhomboids - upper back muscles)
  back: {
    0: { // Skinny - narrow, weak back
      shape: 'M 95 125 Q 120 115 150 110 Q 180 115 205 125 Q 195 175 150 185 Q 105 175 95 125 Z',
    },
    1: { // Fit - broader back
      shape: 'M 90 120 Q 118 108 150 103 Q 182 108 210 120 Q 200 178 150 188 Q 100 178 90 120 Z',
    },
    2: { // Athletic - V-taper, defined
      shape: 'M 85 115 Q 115 100 150 94 Q 185 100 215 115 Q 205 182 150 192 Q 95 182 85 115 Z',
    },
    3: { // Muscular - massive, wide back
      shape: 'M 78 105 Q 112 88 150 80 Q 188 88 222 105 Q 210 190 150 202 Q 90 190 78 105 Z',
    },
  },

  // Core (abs, obliques - lower torso only)
  core: {
    0: { // Skinny - no definition
      shape: 'M 125 185 Q 150 175 175 185 Q 180 225 150 235 Q 120 225 125 185 Z',
    },
    1: { // Fit - slight abs outline
      shape: 'M 122 182 Q 150 170 178 182 Q 183 228 150 238 Q 117 228 122 182 Z',
    },
    2: { // Athletic - 4-pack visible
      shape: 'M 118 178 Q 150 165 182 178 Q 188 232 150 242 Q 112 232 118 178 Z',
      absLine1: 'M 128 208 Q 135 210 150 210 Q 165 210 172 208 L 172 222 Q 165 224 150 224 Q 135 224 128 222 Z',
      absLine2: 'M 126 222 Q 133 224 150 224 Q 167 224 174 222 L 174 236 Q 167 238 150 238 Q 133 238 126 236 Z',
    },
    3: { // Muscular - 6-pack
      shape: 'M 112 172 Q 150 158 188 172 Q 195 235 150 247 Q 105 235 112 172 Z',
      absLine1: 'M 122 210 Q 130 212 150 212 Q 170 212 178 210 L 178 222 Q 170 224 150 224 Q 130 224 122 222 Z',
      absLine2: 'M 120 222 Q 128 224 150 224 Q 172 224 180 222 L 180 234 Q 172 236 150 236 Q 128 236 120 234 Z',
      absLine3: 'M 118 234 Q 126 236 150 236 Q 174 236 182 234 L 182 246 Q 174 248 150 248 Q 126 248 118 246 Z',
    },
  },

  // Legs
  legs: {
    0: { // Skinny
      left: 'M 120 270 Q 110 290 105 340 Q 100 380 115 400 Q 130 420 150 410 Q 170 400 165 370 Q 160 340 165 310 Q 170 280 160 270 Z',
      right: 'M 180 270 Q 190 290 195 340 Q 200 380 185 400 Q 170 420 150 410 Q 130 400 135 370 Q 140 340 135 310 Q 130 280 140 270 Z',
    },
    1: { // Fit
      left: 'M 125 265 Q 112 285 105 345 Q 98 385 118 400 Q 138 415 155 405 Q 172 395 166 365 Q 160 335 168 305 Q 175 275 162 265 Z',
      right: 'M 175 265 Q 188 285 195 345 Q 202 385 182 400 Q 162 415 145 405 Q 128 395 134 365 Q 140 335 132 305 Q 125 275 138 265 Z',
    },
    2: { // Athletic
      left: 'M 130 260 Q 115 280 105 350 Q 95 390 120 405 Q 145 415 160 400 Q 175 385 168 360 Q 160 330 172 300 Q 180 270 165 260 Z',
      right: 'M 170 260 Q 185 280 195 350 Q 205 390 180 405 Q 155 415 140 400 Q 125 385 132 360 Q 140 330 128 300 Q 120 270 135 260 Z',
    },
    3: { // Muscular
      left: 'M 138 255 Q 118 275 100 360 Q 88 400 125 410 Q 148 420 168 400 Q 185 380 175 350 Q 165 320 180 290 Q 188 260 168 255 Z',
      right: 'M 162 255 Q 182 275 200 360 Q 212 400 175 410 Q 152 420 132 400 Q 115 380 125 350 Q 135 320 120 290 Q 112 260 132 255 Z',
    },
  },
};

// Alternative shapes for more variety
const CORE_SHAPES = {
  0: { shape: 'M 120 170 Q 150 160 180 170 Q 185 210 180 250 Q 170 290 150 295 Q 130 290 120 250 Q 115 210 120 170 Z' },
  1: { shape: 'M 118 168 Q 150 155 182 168 Q 188 212 180 252 Q 168 292 150 298 Q 132 292 120 252 Q 112 212 118 168 Z' },
  2: { shape: 'M 115 165 Q 150 150 185 165 Q 190 220 180 255 Q 160 295 150 300 Q 140 295 120 255 Q 110 220 115 165 Z' },
  3: { shape: 'M 112 160 Q 150 145 188 160 Q 195 225 180 260 Q 158 300 150 308 Q 142 300 120 260 Q 105 225 112 160 Z' },
};

// Function to get color based on stage - unified yellowish color for all body parts
const getBodyPartColors = (stage) => {
  const idx = Math.min(stage, 3);
  return {
    start: YELLOW_PALETTE[idx].start,
    end: YELLOW_PALETTE[idx].end,
  };
};

// Generate unique gradient ID
const generateGradientId = (bodyPart) => {
  return `grad-${bodyPart}-${Math.random().toString(36).substr(2, 9)}`;
};

// Main avatar generation function
export const generateAvatar = (stats) => {
  const { strength, endurance, core: coreStat } = stats;

  // Calculate stages for each body part (0-3) based on stat values
  // Each stage requires roughly 50 stat points
  const calculateStage = (statValue) => {
    if (statValue >= 200) return 3;
    if (statValue >= 100) return 2;
    if (statValue >= 50) return 1;
    return 0;
  };

  const armsStage = calculateStage(strength);
  const legsStage = calculateStage(endurance);
  const coreStage = calculateStage(coreStat);
  const backStage = Math.min(armsStage, coreStage); // back develops with arms and core
  const chestStage = armsStage; // chest develops with arm strength
  const upperStage = Math.max(chestStage, backStage); // upper body is the best of chest and back

  // Build body part stages object
  const bodyPartStages = {
    arms: armsStage,
    legs: legsStage,
    core: coreStage,
    back: backStage,
    chest: chestStage,
    upper: upperStage,
  };

  // Generate stage names for display
  const getStageName = (stage, bodyPart) => {
    if (stage === 0) return bodyPart === 'core' ? 'Beginner' : 'Skinny';
    if (stage === 1) return 'Fit';
    if (stage === 2) return 'Athletic';
    return 'Muscular';
  };

  const stageNames = {
    arms: getStageName(armsStage, 'arms'),
    legs: getStageName(legsStage, 'legs'),
    core: getStageName(coreStage, 'core'),
    back: getStageName(backStage, 'back'),
    chest: getStageName(chestStage, 'chest'),
    upper: getStageName(upperStage, 'upper'),
  };

  // Generate colors for each body part
  const colors = {};
  const glowColors = {};
  const gradientIds = {};
  const parts = {};

  ['arms', 'legs', 'core', 'back', 'chest', 'upper'].forEach((bp) => {
    const stage = bodyPartStages[bp];
    const cols = getBodyPartColors(stage);
    const gradientId = generateGradientId(bp);

    colors[bp] = {
      start: cols.start,
      end: cols.end,
    };

    glowColors[bp] = cols.start;
    gradientIds[bp] = gradientId;

    // Build parts object with proper path data (skip 'upper' as it's a composite)
    if (bp !== 'upper') {
      parts[bp] = BODY_PART_PATHS[bp][stage] || BODY_PART_PATHS[bp][0];
    }
  });

  // For backwards compatibility, also create leftLeg, rightLeg, leftArm, rightArm
  // The component expects these separate properties
  parts.leftLeg = parts.legs?.left || BODY_PART_PATHS.legs[0].left;
  parts.rightLeg = parts.legs?.right || BODY_PART_PATHS.legs[0].right;
  parts.leftArm = parts.arms?.left || BODY_PART_PATHS.arms[0].left;
  parts.rightArm = parts.arms?.right || BODY_PART_PATHS.arms[0].right;

  return {
    bodyPartStages,
    stageNames,
    colors,
    glowColors,
    gradientIds,
    parts,
  };
};

// Utility function to interpolate between colors (for smooth transitions)
export const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
};
