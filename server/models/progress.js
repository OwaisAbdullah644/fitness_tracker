// models/progress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",    
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    weight: { type: Number, min: 0 },               
    measurements: {
      chest: { type: Number, min: 0 },   
      waist: { type: Number, min: 0 },   
    },
    performance: {
      runTime: { type: Number, min: 0 }, 
      liftWeight: { type: Number, min: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);