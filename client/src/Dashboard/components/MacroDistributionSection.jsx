// src/Dashboard/components/MacroDistributionSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const MacroDistributionSection = () => {
  const data = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-5 rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-[#FDC700]">Macros Today</h2>
      <Pie
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { color: '#ccc' } } },
        }}
      />
    </motion.section>
  );
};

export default MacroDistributionSection;