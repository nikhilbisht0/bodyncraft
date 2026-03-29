# Plan: Fix Chest/Back Hover Detection

## Context
The avatar has separate body parts (arms, chest, back, core, legs) with hover effects. Currently, when hovering over chest or back area, the arms hover is triggered instead because the arm paths are rendered after chest/back and block pointer events in overlapping shoulder regions.

## Problem
- Arm paths are on top in SVG stacking order
- They capture hover events in the shoulder area where arms overlap chest/back
- This causes the wrong body part (arms) to be highlighted when hovering chest/back

## Solution
1. **Remove hover handlers from arm paths** - The arm `<motion.path>` elements currently have onMouseEnter/onMouseLeave/onClick that set hover to 'arms'. Remove these.

2. **Add invisible hit areas for arms** - Create two `<rect>` elements positioned specifically on the arm areas (excluding the shoulder overlap). These will capture hover and click for arms only in their designated zones.
   - Left arm rect: x="75" y="160" width="35" height="110"
   - Right arm rect: x="195" y="160" width="35" height="110"
   - Set fill="transparent", cursor='pointer', and attach hover/click handlers

3. **Chest and back trigger 'upper'** - Both chest and back paths should trigger the Upper Body card. Update:
   - onMouseEnter: `setHoveredPart('upper')`
   - onClick: `handleBodyPartClick('upper')`

4. **Update hover pulse positions** - Adjust the pulse overlay position for 'upper' to center of upper body (torso):
   - left: 50%
   - top: 38%

## Files to Modify
- `src/components/Avatar/AvatarDisplay.jsx` - All changes are in this file

## Verification
1. Run the dev server
2. Hover over each body part on the avatar:
   - Arms: hover pulse appears on arm, Arms card highlights
   - Upper Body (chest/back): hover pulse appears on torso, Upper Body card highlights
   - Core: hover pulse on core, Core card highlights
   - Legs: hover pulse on legs, Legs card highlights
3. Click each area to start battle (correct mapping)
4. Ensure no flickering or missed hover detection at boundaries
