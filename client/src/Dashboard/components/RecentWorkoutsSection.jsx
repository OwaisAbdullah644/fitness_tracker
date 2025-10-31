// src/Dashboard/components/RecentWorkoutsSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RecentWorkoutsSection = () => {
  // ——— ALL useState (8 fields) ———
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weights, setWeights] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
      try {
        const res = await axios.post('https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/workouts', {
          userId,
          exerciseName,
          sets,
          reps,
          weights,
          notes,
          category,
          tags,
          date
        })
        setExerciseName("");
        setReps("");
        setSets("");
        setWeights("");
        setNotes("");
        setCategory("");
        setTags("");
        setDate("")
        toast.success("Inserted successfully");
        console.log(res.data.message)
      } catch (error) {
        toast.error("Unable to insert" + error)
        console.log(error)
      }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <h3
        className="text-xl font-semibold mb-6"
        style={{ color: "var(--accent)" }}
      >
        Add Workout
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Exercise Name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            min="1"
            required
            className="px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            required
            className="px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
            step="0.5"
            className="px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        >
          {["Strength", "Cardio", "Yoga", "HIIT", "Mobility", "Other"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />

        <button
          type="submit"
          className="w-full py-3 mt-4 font-medium text-white rounded-lg"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Save Workout
        </button>
      </form>
    </motion.div>
  );
};

export default RecentWorkoutsSection;