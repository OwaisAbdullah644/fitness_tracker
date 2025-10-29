// src/Dashboard/components/WeightProgressSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightProgressSection = () => {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [82, 80.5, 79, 77.8],
        borderColor: '#FDC700',
        backgroundColor: 'rgba(253, 199, 0, 0.2)',
        tension: 0.4,
        fill: true,
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
      <h2 className="text-xl font-bold mb-4 text-[#FDC700]">Weight Progress</h2>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: false } },
        }}
      />
    </motion.section>
  );
};

export default WeightProgressSection;