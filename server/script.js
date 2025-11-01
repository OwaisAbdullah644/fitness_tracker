// script.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const { stringify } = require("csv-stringify");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://127.0.0.1:27017/fitness", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const reg_model = require("./models/register");
const workout_model = require("./models/workout");
const progress_model = require("./models/progress");
const nutrition_model = require("./models/nutrition");

app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.filename : "";

    await reg_model.insertOne({
      name,
      email,
      password: hashPassword,
      image: profilePic,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already registered" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await reg_model.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({ message: "Logged in", registeredUser: user });
      } else {
        res.json({ message: "Incorrect Password" });
      }
    } else {
      res.json({ message: "User don't exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

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
    res.status(201).json({ message: "Workout added" });
  } catch (error) {
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
    res.status(201).json({ message: "Progress added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const entries = await progress_model.find({ userId }).sort({ date: 1 }).lean();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await progress_model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await progress_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await reg_model.findById(userId).select("name email image");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const update = { name, email };
    if (req.file) update.image = req.file.filename;
    const updated = await reg_model.findByIdAndUpdate(userId, update, { new: true }).select("name email image");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/nutrition", async (req, res) => {
  try {
    const { userId, mealType, foodItems, date, notes } = req.body;
    if (!userId || !mealType || !Array.isArray(foodItems) || foodItems.length === 0 || !date)
      return res.status(400).json({ message: "Invalid data" });

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
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/nutrition", async (req, res) => {
  try {
    const { userId, mealType, date, page = 1, limit = 20 } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const filter = { userId };
    if (mealType) filter.mealType = mealType;
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const logs = await nutrition_model
      .find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const enriched = logs.map((log) => ({
      ...log,
      totalCalories: log.foodItems.reduce((s, i) => s + i.calories, 0),
      totalProteins: log.foodItems.reduce((s, i) => s + i.proteins, 0),
      totalCarbs: log.foodItems.reduce((s, i) => s + i.carbs, 0),
      totalFats: log.foodItems.reduce((s, i) => s + i.fats, 0),
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItems, date, notes } = req.body;
    const updated = await nutrition_model.findByIdAndUpdate(
      id,
      { mealType, foodItems, date: new Date(date), notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await nutrition_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/analytics/nutrition", async (req, res) => {
  try {
    const { userId, period = "week" } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const now = new Date();
    let start;
    if (period === "week") start = new Date(now.setDate(now.getDate() - 7));
    else if (period === "month") start = new Date(now.setMonth(now.getMonth() - 1));
    else start = new Date(now.setFullYear(now.getFullYear() - 1));

    const analytics = await nutrition_model.aggregate([
      { $match: { userId, date: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCalories: { $sum: { $sum: "$foodItems.calories" } },
          totalProteins: { $sum: { $sum: "$foodItems.proteins" } },
          totalCarbs: { $sum: { $sum: "$foodItems.carbs" } },
          totalFats: { $sum: { $sum: "$foodItems.fats" } },
          mealCount: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/reports/nutrition", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const logs = await nutrition_model.find({ userId }).sort({ date: -1 }).lean();

    const rows = logs.map((log) => ({
      Date: new Date(log.date).toISOString().split("T")[0],
      Meal: log.mealType,
      Foods: log.foodItems.map((i) => i.name).join("; "),
      Calories: log.foodItems.reduce((s, i) => s + i.calories, 0),
    }));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=nutrition_report.csv");

    const stringifier = stringify(rows, { header: true });
    stringifier.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

cron.schedule("0 8 * * *", () => {
  console.log("Daily meal reminder job running...");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});