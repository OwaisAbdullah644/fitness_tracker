const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
  },
  exerciseName: {
    type: String,
    required: true,
    trim: true,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  weights: {
    type: Number,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    default: "Other",
    enum: ["Strength", "Cardio", "Yoga", "HIIT", "Mobility", "Other"],
  },
  tags: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;