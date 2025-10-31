// src/Dashboard/components/ProgressInputSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ProgressInputSection = ({ onProgressAdded }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [runTime, setRunTime] = useState("");
  const [liftWeight, setLiftWeight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    try {
      const res = await axios.post("https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress", {
        userId,
        date,
        weight,
        measurements: { chest, waist },
        performance: { runTime, liftWeight },
      });
      setDate(new Date().toISOString().split("T")[0]);
      setWeight("");
      setChest("");
      setWaist("");
      setRunTime("");
      setLiftWeight("");
      toast.success("Progress added successfully");
      if (onProgressAdded) onProgressAdded();
    } catch (error) {
      toast.error("Unable to add progress: " + error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <h3 className="text-xl font-semibold mb-6" style={{ color: "var(--accent)" }}>
          Add Progress Entry
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            className="w-full px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Chest (cm)"
            value={chest}
            onChange={(e) => setChest(e.target.value)}
            step="0.1"
            className="w-full px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Waist (cm)"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            step="0.1"
            className="w-full px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Run Time (min)"
            value={runTime}
            onChange={(e) => setRunTime(e.target.value)}
            step="0.1"
            className="w-full px-4 py-2 rounded border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
          <input
            type="number"
            placeholder="Lift Weight (kg)"
            value={liftWeight}
            onChange={(e) => setLiftWeight(e.target.value)}
            step="0.1"
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
            Save Progress
          </button>
        </form>
      </motion.div>
    </>
  );
};

export default ProgressInputSection;