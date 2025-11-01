const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const connectDb = require("./config/connectDb");
const reg_model = require("./models/register");
const workout_model = require("./models/workout");
const progress_model = require("./models/progress");
const Notification = require("./models/notification");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
connectDb();

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ------------------------------
// USER AUTH + PROFILE ROUTES
// ------------------------------

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
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const registeredUser = await reg_model.findOne({ email });
    if (registeredUser) {
      const isMatch = await bcrypt.compare(password, registeredUser.password);
      if (isMatch) {
        res.status(200).send({ message: "Logged in", registeredUser });
      } else {
        res.status(200).send({ message: "Incorrect Password" });
      }
    } else {
      res.status(200).send({ message: "User doesn't exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

// ------------------------------
// WORKOUT ROUTES
// ------------------------------
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

    // ✅ Create a notification for new workout
    await Notification.create({
      userId,
      type: "activity",
      message: `Workout "${exerciseName}" added successfully.`,
    });

    res.status(201).json({ message: "Workout added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------
// PROGRESS ROUTES
// ------------------------------
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

    // ✅ Create a notification for progress update
    await Notification.create({
      userId,
      type: "reminder",
      message: `Progress updated for ${new Date(date).toLocaleDateString()}.`,
    });

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

    const entries = await progress_model.find({ userId }).sort({ date: 1 }).lean();
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

// ------------------------------
// PREFERENCES ROUTES
// ------------------------------
app.get("/preferences", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await reg_model.findById(userId).select("preferences");
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

    const updated = await reg_model
      .findByIdAndUpdate(
        userId,
        {
          "preferences.notifications": notifications,
          "preferences.units": units,
          "preferences.theme": theme,
        },
        { new: true }
      )
      .select("preferences");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated.preferences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------
// PROFILE ROUTES
// ------------------------------
app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await reg_model.findById(userId).select("name email image");
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
    if (req.file) updateData.image = req.file.filename;

    const updated = await reg_model.findByIdAndUpdate(userId, updateData, { new: true }).select("name email image");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------
// NOTIFICATION ROUTES
// ------------------------------
app.get("/notifications", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const notifications = await Notification.find({ userId }).sort({ date: -1 }).lean();
    res.json(notifications);
  } catch (err) {
    console.error("GET /notifications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/notifications", async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (!userId || !type || !message)
      return res.status(400).json({ message: "userId, type, and message required" });

    const notif = new Notification({ userId, type, message });
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    console.error("POST /notifications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notif) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Marked as read", notif });
  } catch (err) {
    console.error("POST /notifications/:id error:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("DELETE /notifications/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
