// src/Dashboard/pages/ProgressPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProgressInputSection from '../components/ProgressInputSection';
import ProgressSummarySection from '../components/ProgressSummarySection';

const ProgressPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProgressAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
          Track Your Progress
        </h1>

        <ProgressInputSection onProgressAdded={handleProgressAdded} />

        <div className="mt-8">
          <ProgressSummarySection key={refreshTrigger} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressPage;