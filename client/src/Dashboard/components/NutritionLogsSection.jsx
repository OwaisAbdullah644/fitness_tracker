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
      className="card p-5 rounded-2xl"
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Nutrition Today</h2>
      <ul className="space-y-3">
        {logs.map((l, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.03, backgroundColor: 'var(--bg-card-hover)' }}
            className="p-3 rounded-xl"
            style={{ backgroundColor: 'var(--bg-card-hover)' }}
          >
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{l.date} - {l.meal}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{l.calories} cal | {l.macros}</p>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
};

export default NutritionLogsSection;