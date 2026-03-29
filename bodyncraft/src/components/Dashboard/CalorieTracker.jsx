import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, User, Weight, Ruler, Hash, Activity, Edit2, Check, X, Calculator } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';

// Calculate BMR using Mifflin-St Jeor Equation (most accurate)
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

// Activity level multipliers
const activityMultipliers = {
  1: { label: 'Sedentary', multiplier: 1.2, desc: 'Little/no exercise, desk job' },
  2: { label: 'Lightly Active', multiplier: 1.375, desc: '1-3 days/week light exercise' },
  3: { label: 'Moderately Active', multiplier: 1.55, desc: '3-5 days/week moderate exercise' },
  4: { label: 'Very Active', multiplier: 1.725, desc: '6-7 days/week hard exercise' },
  5: { label: 'Extra Active', multiplier: 1.9, desc: '2x/day training, physical job' },
};

const CalorieTracker = () => {
  const { state, dispatch } = useCharacter();
  const { profile } = state;
  const calories = state.calories || 0;
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });

  // Calculate daily goal based on BMR and activity
  const dailyGoal = useMemo(() => {
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const multiplier = activityMultipliers[profile.activityLevel]?.multiplier || 1.2;
    return Math.round(bmr * multiplier);
  }, [profile]);

  // Calculate BMR for display
  const bmr = useMemo(() => {
    return Math.round(calculateBMR(profile.weight, profile.height, profile.age, profile.gender));
  }, [profile]);

  // Calculate detailed breakdown
  const calcDetails = useMemo(() => {
    const multiplier = activityMultipliers[profile.activityLevel]?.multiplier || 1.2;
    const tdee = Math.round(bmr * multiplier);
    // Weight loss/gain targets (optional)
    const deficit500 = tdee - 500;
    const surplus500 = tdee + 500;
    return {
      bmr,
      multiplier,
      tdee,
      deficit500,
      surplus500,
      activityLabel: activityMultipliers[profile.activityLevel]?.label || 'Sedentary',
    };
  }, [profile, bmr]);

  const handleAddCalories = (amount) => {
    dispatch({
      type: 'ADD_CALORIES',
      payload: { amount },
    });
  };

  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: editProfile,
    });
    setShowProfileForm(false);
  };

  const progress = Math.min((calories / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - calories, 0);
  const isOverGoal = calories > dailyGoal;

  return (
    <motion.div
      className="relative glass-card glass-card-hover p-6 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10">
        {/* Header with Profile Edit & Calculator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-[#ff9600]/30"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Flame className="text-white" size={28} />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white">Daily Calories</h3>
              <p className="text-sm text-gray-400">
                {isOverGoal ? '⚠️ Over daily goal!' : `${remaining} kcal to go`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowProfileForm(!showProfileForm)}
              title="Edit Profile"
            >
              {showProfileForm ? (
                <X size={20} className="text-red-400" />
              ) : (
                <Edit2 size={20} className="text-gray-400" />
              )}
            </motion.button>
            <motion.button
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCalculator(!showCalculator)}
              title="View Calculator"
            >
              <Calculator size={20} className="text-blue-400" />
            </motion.button>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
            <div className="text-sm text-gray-400 mb-1">Consumed</div>
            <div className={`text-3xl font-black ${isOverGoal ? 'text-red-500' : 'text-[#ff9600]'}`}>
              {calories}
              <span className="text-base text-gray-500 ml-1">kcal</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="text-sm text-gray-400 mb-1">Target</div>
            <div className="text-3xl font-black text-blue-400">
              {dailyGoal}
              <span className="text-base text-gray-500 ml-1">kcal</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Calculator size={12} />
              BMR: {bmr} • {activityMultipliers[profile.activityLevel]?.label}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-6">
          <div className="w-full bg-gray-900/80 rounded-full h-4 overflow-hidden border border-gray-700/50">
            <motion.div
              className={`h-full rounded-full relative ${isOverGoal ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-orange-500 via-[#ff9600] to-orange-600'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          {calories >= dailyGoal && !isOverGoal && (
            <motion.div
              className="absolute -right-2 -top-1 w-6 h-6 bg-[#ff9600] rounded-full shadow-lg shadow-[#ff9600]/50 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-white text-xs font-bold">✓</span>
            </motion.div>
          )}
        </div>

        {/* Profile Edit Form */}
        <AnimatePresence>
          {showProfileForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 space-y-4 border-t border-gray-800/50 pt-4 overflow-hidden"
            >
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <User size={16} />
                Profile Settings
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
                    <Weight size={14} /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={editProfile.weight}
                    onChange={(e) => setEditProfile({ ...editProfile, weight: parseFloat(e.target.value) || 70 })}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
                    <Ruler size={14} /> Height (cm)
                  </label>
                  <input
                    type="number"
                    value={editProfile.height}
                    onChange={(e) => setEditProfile({ ...editProfile, height: parseFloat(e.target.value) || 170 })}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
                    <Hash size={14} /> Age
                  </label>
                  <input
                    type="number"
                    value={editProfile.age}
                    onChange={(e) => setEditProfile({ ...editProfile, age: parseInt(e.target.value) || 25 })}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
                    <User size={14} /> Gender
                  </label>
                  <select
                    value={editProfile.gender}
                    onChange={(e) => setEditProfile({ ...editProfile, gender: e.target.value })}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500/50 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 flex items-center gap-2 mb-2">
                    <Activity size={14} /> Activity Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(activityMultipliers).map(([key, { label, desc }]) => (
                      <button
                        key={key}
                        onClick={() => setEditProfile({ ...editProfile, activityLevel: parseInt(key) })}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          editProfile.activityLevel === parseInt(key)
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-gray-800 hover:border-gray-700 text-gray-400'
                        }`}
                      >
                        <div className="font-bold text-sm">{label}</div>
                        <div className="text-xs opacity-70">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
              >
                <Check size={18} />
                Save & Recalculate
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Buttons */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-2">Quick Add</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '+250', amount: 250, color: 'bg-green-600 hover:bg-green-700' },
              { label: '+500', amount: 500, color: 'bg-blue-600 hover:bg-blue-700' },
              { label: '+1000', amount: 1000, color: 'bg-orange-600 hover:bg-orange-700' },
              { label: 'Custom', amount: 0, color: 'bg-purple-600 hover:bg-purple-700' },
            ].map((btn, idx) => (
              <motion.button
                key={idx}
                className={`${btn.color} text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => btn.amount > 0 && handleAddCalories(btn.amount)}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Calculator Modal */}
        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCalculator(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calculator className="text-blue-400" size={24} />
                    Calorie Calculator
                  </h3>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* BMR Calculation */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-800/30">
                    <div className="text-sm text-blue-400 font-bold mb-2">BMR (Basal Metabolic Rate)</div>
                    <div className="text-xs text-gray-400 mb-2">
                      Mifflin-St Jeor Equation:
                      {profile.gender === 'male'
                        ? ' 10 × weight + 6.25 × height - 5 × age + 5'
                        : ' 10 × weight + 6.25 × height - 5 × age - 161'
                      }
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">
                        {profile.weight} kg • {profile.height} cm • {profile.age} yrs • {profile.gender === 'male' ? '♂' : '♀'}
                      </span>
                      <span className="text-2xl font-bold text-blue-400">{bmr} kcal</span>
                    </div>
                  </div>

                  {/* Activity Multiplier */}
                  <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-4 border border-green-800/30">
                    <div className="text-sm text-green-400 font-bold mb-2">Activity Level</div>
                    <div className="text-xs text-gray-400 mb-2">
                      Multiplier: ×{calcDetails.multiplier} ({calcDetails.activityLabel})
                    </div>
                    <div className="text-lg font-semibold text-green-400">
                      {activityMultipliers[profile.activityLevel]?.desc}
                    </div>
                  </div>

                  {/* TDEE Result */}
                  <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4 border border-orange-800/30">
                    <div className="text-sm text-orange-400 font-bold mb-2">TDEE (Maintenance)</div>
                    <div className="text-xs text-gray-400 mb-2">
                      BMR × Activity Multiplier
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{bmr} × {calcDetails.multiplier}</span>
                      <span className="text-2xl font-bold text-orange-400">{calcDetails.tdee} kcal/day</span>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 rounded-xl p-3 border border-red-800/20">
                      <div className="text-xs text-red-400 font-bold mb-1">Weight Loss</div>
                      <div className="text-lg font-bold text-red-400">{calcDetails.deficit500} kcal</div>
                      <div className="text-xs text-gray-500">(-500/day)</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-3 border border-green-800/20">
                      <div className="text-xs text-green-400 font-bold mb-1">Weight Gain</div>
                      <div className="text-lg font-bold text-green-400">{calcDetails.surplus500} kcal</div>
                      <div className="text-xs text-gray-500">(+500/day)</div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="font-semibold mb-1">💡 How it works:</div>
                    <ul className="space-y-1">
                      <li>• BMR = calories your body needs at complete rest</li>
                      <li>• TDEE = your daily maintenance calories</li>
                      <li>• Adjust ±500 kcal per day for weight loss/gain (~0.5kg/week)</li>
                    </ul>
                  </div>
                </div>

                <motion.button
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCalculator(false)}
                >
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalorieTracker;
