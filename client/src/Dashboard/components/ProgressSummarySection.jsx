// src/Dashboard/components/ProgressSummarySection.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const ProgressSummarySection = ({ progressEntries = [], onProgressAdded }) => {
  const [form, setForm] = useState({
    date: '',
    weight: '',
    chest: '',
    waist: '',
    runTime: '',
    liftWeight: '',
  });

  // POST METHOD: Add new progress
  const handleAddProgress = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in first');
      return;
    }

    try {
      const payload = {
        userId,
        date: form.date,
        weight: form.weight ? parseFloat(form.weight) : null,
        measurements: {
          chest: form.chest ? parseFloat(form.chest) : null,
          waist: form.waist ? parseFloat(form.waist) : null,
        },
        performance: {
          runTime: form.runTime ? parseFloat(form.runTime) : null,
          liftWeight: form.liftWeight ? parseFloat(form.liftWeight) : null,
        },
      };

      await axios.post('https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress', payload);
      toast.success('Progress saved!');
      setForm({ date: '', weight: '', chest: '', waist: '', runTime: '', liftWeight: '' });
      if (onProgressAdded) onProgressAdded(); // Refresh parent
    } catch (err) {
      toast.error('Failed to save progress');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CHART DATA
  const chartData = progressEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    weight: entry.weight || 0,
    chest: entry.measurements?.chest || 0,
    waist: entry.measurements?.waist || 0,
    runTime: entry.performance?.runTime || 0,
    liftWeight: entry.performance?.liftWeight || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>
        Progress Summary
      </h3>

      {/* POST FORM */}
      <form onSubmit={handleAddProgress} className="mb-6 p-4 rounded bg-var(--bg-secondary) space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded border"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            step="0.1"
            className="px-3 py-2 rounded border"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          />
          <input
            type="number"
            name="chest"
            placeholder="Chest (cm)"
            value={form.chest}
            onChange={handleChange}
            step="0.1"
            className="px-3 py-2 rounded border"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          />
          <input
            type="number"
            name="waist"
            placeholder="Waist (cm)"
            value={form.waist}
            onChange={handleChange}
            step="0.1"
            className="px-3 py-2 rounded border"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          />
          <input
            type="number"
            name="runTime"
            placeholder="Run Time (min)"
            value={form.runTime}
            onChange={handleChange}
            step="0.1"
            className="px-3 py-2 rounded border"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          />
          <input
            type="number"
            name="liftWeight"
            placeholder="Lift Weight (kg)"
            value={form.liftWeight}
            onChange={handleChange}
            step="0.1"
            className="px-3 py-2 rounded border"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded font-medium text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Add Progress
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-var(--border)">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Weight (kg)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Chest (cm)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Waist (cm)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Run Time (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Lift Weight (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--border)">
            {progressEntries.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-var(--text-muted)">
                  No progress recorded yet.
                </td>
              </tr>
            ) : (
              progressEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-var(--bg-card-hover)">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.weight ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.measurements?.chest ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.measurements?.waist ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.performance?.runTime ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.performance?.liftWeight ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CHARTS */}
      {progressEntries.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--accent)' }}>
            Progress Over Time
          </h4>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
              <Line type="monotone" dataKey="chest" stroke="#82ca9d" name="Chest (cm)" />
              <Line type="monotone" dataKey="waist" stroke="#ffc658" name="Waist (cm)" />
              <Line type="monotone" dataKey="runTime" stroke="#ff7300" name="Run Time (min)" />
              <Line type="monotone" dataKey="liftWeight" stroke="#a4de6c" name="Lift Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressSummarySection;