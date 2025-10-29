// src/Dashboard/components/RecentWorkoutsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const RecentWorkoutsSection = () => {
  const workouts = [
    { date: '30 Sep', type: 'Strength', exercises: 'Bench Press, Squats, Deadlifts' },
    { date: '29 Sep', type: 'Cardio',   exercises: 'Running 5km, Cycling' },
    { date: '28 Sep', type: 'Yoga',     exercises: 'Sun Salutation, Warrior Pose' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="card p-5 rounded-2xl"
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Recent Workouts</h2>
      <ul className="space-y-3">
        {workouts.map((w, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.03, backgroundColor: 'var(--bg-card-hover)' }}
            className="p-3 rounded-xl"
            style={{ backgroundColor: 'var(--bg-card-hover)' }}
          >
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{w.date} - {w.type}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{w.exercises}</p>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
};

export default RecentWorkoutsSection;