// src/Dashboard/components/ProgressSummarySection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const ProgressSummarySection = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress?userId=${userId}`);
      setProgressEntries(res.data);
    } catch (err) {
      setError('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditForm({
      date: new Date(entry.date).toISOString().split('T')[0],
      weight: entry.weight || '',
      chest: entry.measurements?.chest || '',
      waist: entry.measurements?.waist || '',
      runTime: entry.performance?.runTime || '',
      liftWeight: entry.performance?.liftWeight || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress/${editingId}`, {
        date: editForm.date,
        weight: editForm.weight,
        measurements: { chest: editForm.chest, waist: editForm.waist },
        performance: { runTime: editForm.runTime, liftWeight: editForm.liftWeight },
      });
      setProgressEntries(progressEntries.map((entry) => (entry._id === editingId ? res.data : entry)));
      setEditingId(null);
      toast.success('Progress updated successfully');
    } catch (error) {
      toast.error('Unable to update progress');
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress/${id}`);
      setProgressEntries(progressEntries.filter((entry) => entry._id !== id));
      toast.success('Progress deleted successfully');
    } catch (error) {
      toast.error('Unable to delete progress');
      console.log(error);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  if (loading) return <p className="text-var(--text-muted)">Loading progress...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const chartData = progressEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    weight: entry.weight || 0,
    chest: entry.measurements?.chest || 0,
    waist: entry.measurements?.waist || 0,
  }));

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
                {editingId === entry._id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 rounded border"
                        style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="weight"
                        value={editForm.weight}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 rounded border"
                        style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="chest"
                        value={editForm.chest}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 rounded border"
                        style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="waist"
                        value={editForm.waist}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 rounded border"
                        style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="runTime"
                        value={editForm.runTime}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 rounded border"
                        style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="liftWeight"
                        value={editForm.liftWeight}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 rounded border"
                        style={{ backgroundColor: "var(--input-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={handleUpdate} className="text-var(--accent) hover:underline mr-2">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.measurements?.chest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.measurements?.waist}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.performance?.runTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{entry.performance?.liftWeight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(entry)} className="text-var(--accent) hover:underline mr-2">Edit</button>
                      <button onClick={() => handleDelete(entry._id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--accent)' }}>Progress Charts</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="chest" stroke="#82ca9d" />
            <Line type="monotone" dataKey="waist" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProgressSummarySection;