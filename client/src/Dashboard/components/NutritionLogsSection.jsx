// src/Dashboard/components/NutritionLogsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NutritionLogsSection = () => {
  const logs = [
    { date: '30 Sep', meal: 'Breakfast', calories: 520, macros: 'P:22g C:65g F:18g' },
    { date: '30 Sep', meal: 'Lunch',     calories: 780, macros: 'P:35g C:90g F:28g' },
    { date: '30 Sep', meal: 'Dinner',    calories: 650, macros: 'P:30g C:75g F:22g' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-5 rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-[#FDC700]">Nutrition Today</h2>
      <ul className="space-y-3">
        {logs.map((l, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.03, backgroundColor: '#333' }}
            className="bg-black/50 p-3 rounded-xl"
          >
            <p className="font-medium">{l.date} - {l.meal}</p>
            <p className="text-sm text-gray-300">{l.calories} cal | {l.macros}</p>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
};

export default NutritionLogsSection;