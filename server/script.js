// script.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const { stringify } = require("csv-stringify");

const app = express();

// ------------------- Middleware -------------------
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- Multer -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------- Models -------------------
const User = require("./models/register");
const Workout = require("./models/workout");
const Progress = require("./models/progress");
const Nutrition = require("./models/nutrition");

// ------------------- DB Connect -------------------
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fitness";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

// ------------------- Routes -------------------

// Register
app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const image = req.file ? req.file.filename : "";

    await User.create({ name, email, password: hash, image });
    res.status(201).json({ message: "User registered" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const payload = { _id: user._id, name: user.name, email: user.email, image: user.image };
    res.json({ message: "Logged in", user: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Workouts
app.post("/workouts", async (req, res) => {
  try {
    const { userId, exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;
    await Workout.create({
      userId,
      exerciseName,
      sets,
      reps,
      weights,
      notes,
      category,
      tags: tags ? tags.split(",") : [],
      date: new Date(date),
    });
    res.status(201).json({ message: "Workout added" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Progress
app.post("/progress", async (req, res) => {
  try {
    const { userId, date, weight, measurements, performance } = req.body;
    await Progress.create({ userId, date: new Date(date), weight, measurements, performance });
    res.status(201).json({ message: "Progress added" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const entries = await Progress.find({ userId }).sort({ date: 1 }).lean();
    res.json(entries);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Progress.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Progress.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Profile
app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await User.findById(userId).select("name email image");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const update = { name, email };
    if (req.file) update.image = req.file.filename;
    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select("name email image");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- NUTRITION -------------------
app.post("/nutrition", async (req, res) => {
  try {
    const { userId, mealType, foodItems, date, notes } = req.body;
    if (!userId || !mealType || !Array.isArray(foodItems) || foodItems.length === 0 || !date)
      return res.status(400).json({ message: "Invalid data" });

    const log = await Nutrition.create({
      userId,
      mealType,
      foodItems,
      date: new Date(date),
      notes,
    });
    res.status(201).json({ message: "Created", log });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/nutrition", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const logs = await Nutrition.find({ userId }).sort({ date: -1 }).lean();
    const enriched = logs.map(log => ({
      ...log,
      totalCalories: log.foodItems.reduce((s, i) => s + i.calories, 0),
      totalProteins: log.foodItems.reduce((s, i) => s + i.proteins, 0),
      totalCarbs: log.foodItems.reduce((s, i) => s + i.carbs, 0),
      totalFats: log.foodItems.reduce((s, i) => s + i.fats, 0),
    }));
    res.json(enriched);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItems, date, notes } = req.body;
    const updated = await Nutrition.findByIdAndUpdate(
      id,
      { mealType, foodItems, date: new Date(date), notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Nutrition.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Start -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});