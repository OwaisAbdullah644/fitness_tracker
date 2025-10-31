// src/Dashboard/components/NutritionLogsSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const NutritionLogsSection = () => {
  // ——— Dummy data (no backend) ———
  const dummyLogs = [
    {
      _id: "1",
      mealType: "Breakfast",
      foodItems: [
        { name: "Oatmeal", quantity: "1 cup", calories: 150, proteins: 6, carbs: 27, fats: 3 }
      ],
      date: "2025-10-30"
    },
    {
      _id: "2",
      mealType: "Lunch",
      foodItems: [
        { name: "Chicken Breast", quantity: "150g", calories: 240, proteins: 45, carbs: 0, fats: 5 },
        { name: "Rice", quantity: "1 cup", calories: 200, proteins: 4, carbs: 45, fats: 1 }
      ],
      date: "2025-10-30"
    }
  ];

  // ——— useState for form (but not used in table) ———
  const [mealType, setMealType] = useState("Breakfast");
  const [foodItem, setFoodItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--accent)" }}>
        Nutrition Logs
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: "var(--border)" }}>
          <thead style={{ backgroundColor: "var(--bg-secondary)" }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Meal Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Food Items</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Quantities</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Calories</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Proteins</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Carbs</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Fats</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-var(--text-secondary) uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {dummyLogs.map((log) => {
              const totalCalories = log.foodItems.reduce((sum, item) => sum + item.calories, 0);
              const totalProteins = log.foodItems.reduce((sum, item) => sum + item.proteins, 0);
              const totalCarbs = log.foodItems.reduce((sum, item) => sum + item.carbs, 0);
              const totalFats = log.foodItems.reduce((sum, item) => sum + item.fats, 0);

              return (
                <tr key={log._id} className="hover:bg-var(--bg-card-hover)">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{log.mealType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">
                    {log.foodItems.map(i => i.name).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">
                    {log.foodItems.map(i => i.quantity).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{totalCalories}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{totalProteins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{totalCarbs}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">{totalFats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-var(--text-primary)">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default NutritionLogsSection;