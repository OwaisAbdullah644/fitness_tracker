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
      className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-5 rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-[#FDC700]">Recent Workouts</h2>
      <ul className="space-y-3">
        {workouts.map((w, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.03, backgroundColor: '#333' }}
            className="bg-black/50 p-3 rounded-xl"
          >
            <p className="font-medium">{w.date} - {w.type}</p>
            <p className="text-sm text-gray-300">{w.exercises}</p>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
};

export default RecentWorkoutsSection;