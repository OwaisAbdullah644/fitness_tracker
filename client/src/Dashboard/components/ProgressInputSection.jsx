// src/Dashboard/components/ProgressInputSection.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProgressInputSection = ({ onProgressAdded }) => {
  const [form, setForm] = useState({
    date: "",
    weight: "",
    chest: "",
    waist: "",
    runTime: "",
    liftWeight: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please log in to save progress");
      return;
    }

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

    try {
      await axios.post(
        "https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app/progress",
        payload
      );
      toast.success("Progress saved!");
      setForm({
        date: "",
        weight: "",
        chest: "",
        waist: "",
        runTime: "",
        liftWeight: "",
      });
      onProgressAdded(); // Refresh parent
    } catch (err) {
      toast.error("Failed to save progress");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-md space-y-5"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <h2 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
        Log New Progress
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="date"
          name="date"
          required
          value={form.date}
          onChange={handleChange}
          className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          step="0.1"
          value={form.weight}
          onChange={handleChange}
          className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
        <input
          type="number"
          name="chest"
          placeholder="Chest (cm)"
          step="0.1"
          value={form.chest}
          onChange={handleChange}
          className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
        <input
          type="number"
          name="waist"
          placeholder="Waist (cm)"
          step="0.1"
          value={form.waist}
          onChange={handleChange}
          className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
        <input
          type="number"
          name="runTime"
          placeholder="Run Time (min)"
          step="0.1"
          value={form.runTime}
          onChange={handleChange}
          className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
        <input
          type="number"
          name="liftWeight"
          placeholder="Lift Weight (kg)"
          step="0.1"
          value={form.liftWeight}
          onChange={handleChange}
          className="px-4 py-2 rounded border focus:ring-2 focus:ring-var(--accent)"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-2.5 rounded font-medium text-white transition hover:opacity-90"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Save Progress
      </button>
    </form>
  );
};

export default ProgressInputSection;