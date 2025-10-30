// src/Dashboard/components/ProgressSummarySection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ProgressSummarySection = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgressEntries(res.data);
      } catch (err) {
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <p className="text-var(--text-muted)">Loading progress...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Progress Summary</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Weight (kg)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Chest (cm)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Waist (cm)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Run Time (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Lift Weight (kg)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {progressEntries.map((entry) => (
              <tr key={entry._id} className="hover:bg-var(--bg-card-hover)">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.weight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.measurements?.chest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.measurements?.waist}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.performance?.runTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.performance?.liftWeight}</td>
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

export default ProgressSummarySection;