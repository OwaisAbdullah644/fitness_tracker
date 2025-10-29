// src/Dashboard/components/ProgressSummarySection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgressSummarySection = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] p-6 rounded-2xl mb-6 shadow-xl"
  >
    <h2 className="text-2xl font-bold mb-4 text-[#FDC700]">Progress Summary</h2>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-3xl font-bold text-white">3.2kg</p>
        <p className="text-sm text-gray-400">Weight Lost</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">12</p>
        <p className="text-sm text-gray-400">Workouts</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">1,850</p>
        <p className="text-sm text-gray-400">Avg Calories</p>
      </div>
    </div>
  </motion.section>
);

export default ProgressSummarySection;