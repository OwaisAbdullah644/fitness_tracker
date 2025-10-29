// src/Dashboard/components/ProgressSummarySection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgressSummarySection = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="card p-6 rounded-2xl mb-6"
  >
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Progress Summary</h2>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>3.2kg</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Weight Lost</p>
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>12</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Workouts</p>
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>1,850</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Avg Calories</p>
      </div>
    </div>
  </motion.section>
);

export default ProgressSummarySection;