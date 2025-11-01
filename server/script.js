const reg_model = require("./models/register");
const workout_model = require("./models/workout");
const progress_model = require("./models/progress");
const nutrition_model = require("./models/nutrition");
const connectDb = require("./config/connectDb");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.send());
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

    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: "Email already registered" });
    } else {
      console.log(error);
      res.status(500).send({ message: "Server error", error });
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
    res.status(201).send({ message: "Workout added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
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
    res.status(201).send({ message: "Progress added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
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
    res.status(500).send({ message: "Server error" });
  }
});



app.put("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await progress_model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Not found" });
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await progress_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});



app.get("/preferences", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const user = await reg_model.findById(userId).select('preferences');
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user.preferences);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.put("/preferences", async (req, res) => {
  try {
    const { userId, notifications, units, theme } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const updated = await reg_model.findByIdAndUpdate(
      userId,
      { 'preferences.notifications': notifications, 'preferences.units': units, 'preferences.theme': theme },
      { new: true }
    ).select('preferences');
    if (!updated) return res.status(404).send({ message: "User not found" });
    res.send(updated.preferences);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});



app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const user = await reg_model.findById(userId).select('name email image');
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.put("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const updateData = { name, email };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const updated = await reg_model.findByIdAndUpdate(userId, updateData, { new: true }).select('name email image');
    if (!updated) return res.status(404).send({ message: "User not found" });
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});




app.get("/nutrition", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const logs = await nutrition_model
      .find({ userId })
      .sort({ date: -1 })
      .lean();

    res.send(logs);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/nutrition", async (req, res) => {
  try {
    const { userId, mealType, foodItems, date } = req.body;
    if (!userId || !mealType || !foodItems || !date)
      return res.status(400).send({ message: "Missing required fields" });

    const newLog = new nutrition_model({
      userId,
      mealType,
      foodItems,
      date: new Date(date),
    });

    await newLog.save();
    res.status(201).send(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItems, date } = req.body;

    const updated = await nutrition_model.findByIdAndUpdate(
      id,
      { mealType, foodItems, date: new Date(date) },
      { new: true }
    );

    if (!updated) return res.status(404).send({ message: "Log not found" });
    res.send(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await nutrition_model.findByIdAndDelete(id);

    if (!deleted) return res.status(404).send({ message: "Log not found" });
    res.send({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
