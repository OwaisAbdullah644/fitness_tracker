const reg_model = require("./models/register");
const workout_model = require("./models/workout");
const progress_model = require("./models/progress");
const connectDb = require("./config/connectDb");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(cors());
connectDb();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.filename : "";

    await reg_model.insertOne({
      name,
      email,
      password: hashPassword,
      image: profilePic
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already registered" });
    } else {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
});


app.post("/login", async(req, res) => {
  try {
    const {email, password} = req.body;
    const registeredUser = await reg_model.findOne({email : email});
    if(registeredUser){
      const isMatch = await bcrypt.compare(password, registeredUser.password);
      if(isMatch){
        res.status(200).send({message: "Logged in", registeredUser});
      }else{
        res.status(200).send({message: "Incorrect Password"});
      }
    }else{
      res.status(200).send({message: "User don't exist"});
    }
  } catch (error) {
    console.log(error)
  }
})



app.post("/workouts", async (req, res) => {
  try {
    const { userId, exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;
    const newWorkout = new workout_model({
      userId,
      exerciseName,
      sets,
      reps,
      weights,
      notes,
      category,
      tags,
      date: new Date(date),
    });
    await newWorkout.save();
    res.status(201).json({ message: "Workout added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/progress", async (req, res) => {
  try {
    const { userId, date, weight, measurements, performance } = req.body;
    const newProgress = new progress_model({
      userId,
      date: new Date(date),
      weight,
      measurements,
      performance,
    });
    await newProgress.save();
    res.status(201).json({ message: "Progress added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const entries = await progress_model
      .find({ userId })
      .sort({ date: 1 })
      .lean();

    res.send(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.put("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await progress_model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await progress_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/preferences", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await reg_model.findById(userId).select('preferences');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.preferences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/preferences", async (req, res) => {
  try {
    const { userId, notifications, units, theme } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const updated = await reg_model.findByIdAndUpdate(
      userId,
      { 'preferences.notifications': notifications, 'preferences.units': units, 'preferences.theme': theme },
      { new: true }
    ).select('preferences');
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated.preferences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await reg_model.findById(userId).select('name email image');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const updateData = { name, email };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const updated = await reg_model.findByIdAndUpdate(userId, updateData, { new: true }).select('name email image');
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



const nutrition_model = require("./models/nutrition"); 
const cron = require('node-cron'); 

const validateNutrition = (req, res, next) => {
  const { userId, mealType, foodItems, date } = req.body;
  if (!userId || !mealType || !Array.isArray(foodItems) || foodItems.length === 0 || !date) {
    return res.status(400).json({ message: "Missing required fields: userId, mealType, foodItems, date" });
  }
  foodItems.forEach(item => {
    if (!item.name || !item.quantity || typeof item.calories !== 'number' || item.calories < 0) {
      return res.status(400).json({ message: "Invalid food item data" });
    }
  });
  next();
};

app.post("/api/nutrition", validateNutrition, async (req, res) => {
  try {
    const { userId, mealType, foodItems, date, notes } = req.body;
    const newLog = new nutrition_model({
      userId,
      mealType,
      foodItems,
      date: new Date(date),
      notes,
    });
    await newLog.save();
    res.status(201).json({ message: "Nutrition log created", log: newLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/nutrition", async (req, res) => {
  try {
    const { userId, mealType, date, page = 1, limit = 20 } = req.query; 
    if (!userId) return res.status(400).json({ message: "userId required" });

    const filter = { userId };
    if (mealType) filter.mealType = mealType;
    if (date) filter.date = { $gte: new Date(date), $lte: new Date(new Date(date).setHours(23, 59, 59)) }; 

    const logs = await nutrition_model
      .find(filter)
      .sort({ date: -1 }) 
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

  
    const logsWithTotals = logs.map(log => ({
      ...log,
      totalCalories: log.foodItems.reduce((sum, item) => sum + item.calories, 0),
      totalProteins: log.foodItems.reduce((sum, item) => sum + item.proteins, 0),
      totalCarbs: log.foodItems.reduce((sum, item) => sum + item.carbs, 0),
      totalFats: log.foodItems.reduce((sum, item) => sum + item.fats, 0),
    }));

    res.json(logsWithTotals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/nutrition/:id", validateNutrition, async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItems, date, notes } = req.body;
    const updatedLog = await nutrition_model.findByIdAndUpdate(
      id,
      { mealType, foodItems, date: new Date(date), notes },
      { new: true }
    );
    if (!updatedLog) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Nutrition log updated", log: updatedLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await nutrition_model.findByIdAndDelete(id);
    if (!deletedLog) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Nutrition log deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/analytics/nutrition", async (req, res) => {
  try {
    const { userId, period = 'week' } = req.query; 
    if (!userId) return res.status(400).json({ message: "userId required" });

    const now = new Date();
    let startDate;
    if (period === 'week') startDate = new Date(now.setDate(now.getDate() - 7));
    else if (period === 'month') startDate = new Date(now.setMonth(now.getMonth() - 1));
    else startDate = new Date(now.setFullYear(now.getFullYear() - 1)); 

    const analytics = await nutrition_model.aggregate([
      { $match: { userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCalories: { $sum: { $sum: "$foodItems.calories" } },
          totalProteins: { $sum: { $sum: "$foodItems.proteins" } },
          totalCarbs: { $sum: { $sum: "$foodItems.carbs" } },
          totalFats: { $sum: { $sum: "$foodItems.fats" } },
          mealCount: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } } 
    ]);

    res.json(analytics); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/reports/nutrition", async (req, res) => {
  try {
    const { userId, format = 'csv' } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const logs = await nutrition_model.find({ userId }).sort({ date: -1 }).lean();

    if (format === 'csv') {
      const csvWriter = require('csv-writer').createObjectWriter('nutrition_report.csv'); // npm i csv-writer
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=nutrition_report.csv');
      res.send('Date,Meal Type,Food Items,Total Calories\n' + logs.map(log => 
        `${log.date},${log.mealType},${log.foodItems.map(i => i.name).join('; ')},${log.foodItems.reduce((s, i) => s + i.calories, 0)}`
      ).join('\n'));
    } else {
      res.status(400).json({ message: "Format must be 'csv' or 'pdf'" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

cron.schedule('0 8 * * *', async () => {
  console.log('Sending daily meal reminders...');
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
