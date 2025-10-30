// src/Dashboard/components/NutritionLogsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const NutritionLogsSection = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/nutrition', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutritionLogs(res.data);
      } catch (err) {
        setError('Failed to load nutrition logs');
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, []);

  if (loading) return <p className="text-var(--text-muted)">Loading nutrition logs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Nutrition Logs</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Meal Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Food Items</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Quantities</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Calories</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Proteins</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Carbs</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Fats</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {nutritionLogs.map((log) => (
              <tr key={log._id} className="hover:bg-var(--bg-card-hover)">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.mealType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.foodItems?.map(item => item.name).join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.foodItems?.map(item => item.quantity).join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.foodItems?.reduce((acc, item) => acc + item.calories, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.foodItems?.reduce((acc, item) => acc + item.proteins, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.foodItems?.reduce((acc, item) => acc + item.carbs, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.foodItems?.reduce((acc, item) => acc + item.fats, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{new Date(log.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-var(--accent) hover:underline mr-2">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default NutritionLogsSection;