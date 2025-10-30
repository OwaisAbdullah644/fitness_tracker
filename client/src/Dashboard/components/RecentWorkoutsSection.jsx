// src/Dashboard/components/RecentWorkoutsSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const RecentWorkoutsSection = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/workouts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(res.data);
      } catch (err) {
        setError('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  if (loading) return <p className="text-var(--text-muted)">Loading workouts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Recent Workouts</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Exercise</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Sets</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Reps</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Weights</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {workouts.map((workout) => (
              <tr key={workout._id} className="hover:bg-var(--bg-card-hover)">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.exerciseName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.sets}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.reps}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.weights}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{workout.tags?.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{new Date(workout.date).toLocaleDateString()}</td>
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

export default RecentWorkoutsSection;