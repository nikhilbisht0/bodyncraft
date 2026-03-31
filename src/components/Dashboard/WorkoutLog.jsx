import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, CheckCircle, Trophy, Clock } from 'lucide-react';
import { loadWorkoutHistory } from '../../utils/database';

const WorkoutLog = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await loadWorkoutHistory();
      // Show last 5 workouts
      setWorkouts(history.slice(-5).reverse());
      setLoading(false);
    };
    loadHistory();
  }, []);

  const getIconForBodyPart = (bodyPart) => {
    switch (bodyPart) {
      case 'arms': return '💪';
      case 'legs': return '🦵';
      case 'core': return '🧱';
      default: return '🏋️';
    }
  };

  const getBodyPartColor = (bodyPart) => {
    switch (bodyPart) {
      case 'arms': return 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400';
      case 'legs': return 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400';
      case 'core': return 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400';
      default: return 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400';
    }
  };

  if (loading) {
    return (
      <motion.div
        className="relative glass-card glass-card-hover p-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center py-12 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </motion.div>
    );
  }

  if (workouts.length === 0) {
    return (
      <motion.div
        className="relative glass-card glass-card-hover p-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-xl shadow-indigo-500/30">
              <Dumbbell className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1 tracking-tight">WORKOUT HISTORY</h3>
              <p className="text-sm text-gray-400 font-semibold">Your Recent Training Sessions</p>
            </div>
          </div>

          <motion.div
            className="text-center py-12 text-gray-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Dumbbell size={64} className="mx-auto mb-4 opacity-30" />
            </motion.div>
            <p className="text-xl font-bold text-white mb-2">No Workouts Yet</p>
            <p className="text-sm max-w-xs mx-auto">Complete your first workout to start tracking your progress and build your legacy!</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative glass-card glass-card-hover p-6 md:p-7 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Animated background accent */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        {/* Header with icon and count */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-xl shadow-indigo-500/30 relative overflow-hidden"
            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            <Dumbbell className="text-white relative z-10" size={26} strokeWidth={2.5} />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-white mb-1 tracking-tight">RECENT WORKOUTS</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Your Training History</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-pink-400">
              {workouts.length}
            </div>
            <div className="text-xs text-gray-500 uppercase">Sessions</div>
          </div>
        </div>

        {/* Workout list */}
        <div className="space-y-3">
          <AnimatePresence>
            {workouts.map((workout, index) => (
              <motion.div
                key={workout.date + workout.exerciseId}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                className={`relative p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br ${getBodyPartColor(workout.bodyPart)}`}
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                {/* Body part colored accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${workout.bodyPart === 'arms' ? 'from-orange-500 to-orange-600' : workout.bodyPart === 'legs' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'}`} />

                <div className="flex items-center justify-between pl-3">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                        <span className="text-4xl">{getIconForBodyPart(workout.bodyPart)}</span>
                      </div>
                      {workout.perfectForm && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 shadow-lg"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: 'spring' }}
                        >
                          <CheckCircle size={16} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-black text-lg mb-1 tracking-tight">
                        {workout.exerciseName}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="capitalize text-white">{workout.bodyPart}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-black text-white mb-1">{workout.reps}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reps</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-400 mb-1">
                        +{workout.xpEarned}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">XP</div>
                    </div>
                    {workout.perfectForm && (
                      <motion.div
                        className="bg-gradient-to-br from-green-400 to-emerald-500 text-black p-2 rounded-xl shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Trophy size={18} />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Bottom stats bar */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Completed
                    </span>
                    {workout.perfectForm && (
                      <span className="flex items-center gap-1 text-green-400">
                        Perfect Form ✓
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 font-mono">
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-6 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutLog;
