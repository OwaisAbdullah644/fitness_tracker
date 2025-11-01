// server/models/nutrition.js
const mongoose = require('mongoose');

// Sub-schema for individual food items
const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g., "Oatmeal"
  quantity: { type: String, required: true }, // e.g., "1 cup" or "150g"
  calories: { type: Number, required: true, min: 0 }, // Total calories
  proteins: { type: Number, required: true, min: 0 }, // Grams
  carbs: { type: Number, required: true, min: 0 }, // Grams
  fats: { type: Number, required: true, min: 0 }, // Grams
});


const NutritionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'register', 
    required: true 
  },
  mealType: { 
    type: String, 
    required: true, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Other'] 
  },
  foodItems: [FoodItemSchema], 
  date: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  notes: { type: String }, 
}, { 
  timestamps: true 
});

NutritionSchema.index({ userId: 1, date: -1 });
NutritionSchema.index({ userId: 1, mealType: 1 });

module.exports = mongoose.model('Nutrition', NutritionSchema);