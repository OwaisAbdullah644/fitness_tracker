const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cron = require("node-cron");

const connectDb = require("./config/connectDb");
connectDb();

const User = require("./models/register");
const Workout = require("./models/workout");
const Progress = require("./models/progress");
const Nutrition = require("./models/nutrition");
const Notification = require("./models/notification");

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: "https://fitness-tracker-olive-six.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).send({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const profilePic = req.file ? req.file.filename : "";

    const user = await User.create({
      name,
      email,
      password: hash,
      image: profilePic,
      preferences: { notifications: true, units: "kg", theme: "light" },
    });

    res.status(201).send({ message: "User registered", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).send({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send({ message: "Incorrect password" });

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
    res.send({ message: "Logged in", user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/profile", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const user = await User.findById(userId);
  if (!user) return res.status(401).send({ message: "Invalid user" });

  const { _id, name, email, image } = user;
  res.send({ _id, name, email, image });
});

app.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(401).send({ message: "userId required" });

    const update = { name, email };
    if (req.file) update.image = req.file.filename;

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("name email image");

    res.send(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/preferences", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const user = await User.findById(userId);
  if (!user) return res.status(401).send({ message: "Invalid user" });

  res.send(user.preferences);
});

app.post("/preferences", async (req, res) => {
  const { userId, notifications, units, theme } = req.body;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const updated = await User.findByIdAndUpdate(
    userId,
    {
      "preferences.notifications": notifications,
      "preferences.units": units,
      "preferences.theme": theme,
    },
    { new: true }
  ).select("preferences");

  res.send(updated.preferences);
});

app.post("/workouts", async (req, res) => {
  try {
    const {
      userId,
      exerciseName,
      sets,
      reps,
      weights,
      notes,
      category,
      tags,
      date,
    } = req.body;

    const workout = await Workout.create({
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

    const user = await User.findById(userId);
    if (user && user.preferences.notifications) {
      const newNotification = new Notification({
        userId,
        type: 'activity',
        message: `Workout completed: ${exerciseName}`,
      });
      await newNotification.save();
    }

    res.status(201).send(workout);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/workouts", async (req, res) => {
  const { userId, page = 1, limit = 20 } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const workouts = await Workout.find({ userId })
    .sort({ date: -1 })
    .limit(+limit)
    .skip((+page - 1) * +limit)
    .lean();
  res.send(workouts);
});

app.post("/workouts/:id", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId },
    req.body,
    { new: true }
  );
  if (!workout) return res.status(404).send({ message: "Not found" });
  res.send(workout);
});

app.delete("/workouts/:id", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const workout = await Workout.findOneAndDelete({
    _id: req.params.id,
    userId,
  });
  if (!workout) return res.status(404).send({ message: "Not found" });
  res.send({ message: "Deleted" });
});

app.post("/progress", async (req, res) => {
  const { userId, date, weight, measurements, performance } = req.body;
  const prog = await Progress.create({
    userId,
    date: new Date(date),
    weight,
    measurements,
    performance,
  });

  const user = await User.findById(userId);
  if (user && user.preferences.notifications) {
    const newNotification = new Notification({
      userId,
      type: 'activity',
      message: `New progress logged: Weight ${weight}kg`,
    });
    await newNotification.save();
  }

  res.status(201).send(prog);
});

app.get("/progress", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const entries = await Progress.find({ userId })
    .sort({ date: 1 })
    .lean();
  res.send(entries);
});

app.post("/progress/:id", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const prog = await Progress.findOneAndUpdate(
    { _id: req.params.id, userId },
    req.body,
    { new: true }
  );
  if (!prog) return res.status(404).send({ message: "Not found" });
  res.send(prog);
});

app.delete("/progress/:id", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const prog = await Progress.findOneAndDelete({
    _id: req.params.id,
    userId,
  });
  if (!prog) return res.status(404).send({ message: "Not found" });
  res.send({ message: "Deleted" });
});

app.post("/nutrition", async (req, res) => {
  const { userId, mealType, foodItems, date, notes } = req.body;
  if (!mealType || !Array.isArray(foodItems) || foodItems.length === 0 || !date)
    return res.status(400).send({ message: "Missing required fields" });

  for (const i of foodItems) {
    if (
      !i.name ||
      !i.quantity ||
      typeof i.calories !== "number" ||
      i.calories < 0
    )
      return res.status(400).send({ message: "Invalid food item" });
  }

  const log = await Nutrition.create({
    userId,
    mealType,
    foodItems,
    date: new Date(date),
    notes,
  });

  const user = await User.findById(userId);
  if (user && user.preferences.notifications) {
    const newNotification = new Notification({
      userId,
      type: 'activity',
      message: `New nutrition log for ${mealType}`,
    });
    await newNotification.save();
  }

  res.status(201).send(log);
});

app.get("/nutrition", async (req, res) => {
  const { userId, page = 1, limit = 20, mealType, date } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const filter = { userId };
  if (mealType) filter.mealType = mealType;
  if (date) {
    const start = new Date(date);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const logs = await Nutrition.find(filter)
    .sort({ date: -1 })
    .limit(+limit)
    .skip((+page - 1) * +limit)
    .lean();

  const enriched = logs.map((l) => ({
    ...l,
    totalCalories: l.foodItems.reduce((s, i) => s + i.calories, 0),
    totalProteins: l.foodItems.reduce((s, i) => s + i.proteins, 0),
    totalCarbs: l.foodItems.reduce((s, i) => s + i.carbs, 0),
    totalFats: l.foodItems.reduce((s, i) => s + i.fats, 0),
  }));

  res.send(enriched);
});

app.post("/nutrition/:id", async (req, res) => {
  const { userId, mealType, foodItems, date, notes } = req.body;
  if (!userId) return res.status(401).send({ message: "userId required" });
  if (!mealType || !Array.isArray(foodItems) || foodItems.length === 0 || !date)
    return res.status(400).send({ message: "Missing required fields" });

  for (const i of foodItems) {
    if (
      !i.name ||
      !i.quantity ||
      typeof i.calories !== "number" ||
      i.calories < 0
    )
      return res.status(400).send({ message: "Invalid food item" });
  }

  const log = await Nutrition.findOneAndUpdate(
    { _id: req.params.id, userId },
    { mealType, foodItems, date: new Date(date), notes },
    { new: true }
  );
  if (!log) return res.status(404).send({ message: "Not found" });
  res.send(log);
});

app.delete("/nutrition/:id", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const log = await Nutrition.findOneAndDelete({
    _id: req.params.id,
    userId,
  });
  if (!log) return res.status(404).send({ message: "Not found" });
  res.send({ message: "Deleted" });
});

app.get("/analytics/nutrition", async (req, res) => {
  const { userId, period = "week" } = req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const now = new Date();
  let start;

  if (period === "week") start = new Date(now.setDate(now.getDate() - 7));
  else if (period === "month")
    start = new Date(now.setMonth(now.getMonth() - 1));
  else start = new Date(now.setFullYear(now.getFullYear() - 1));

  const data = await Nutrition.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalCalories: { $sum: { $sum: "$foodItems.calories" } },
        totalProteins: { $sum: { $sum: "$foodItems.proteins" } },
        totalCarbs: { $sum: { $sum: "$foodItems.carbs" } },
        totalFats: { $sum: { $sum: "$foodItems.fats" } },
        meals: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.send(data);
});

cron.schedule("0 8 * * *", async () => {
  console.log("Running daily meal reminder job...");
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const users = await User.find({ "preferences.notifications": true });
    for (const user of users) {
      const existing = await Notification.findOne({
        userId: user._id,
        type: "reminder",
        date: { $gte: todayStart },
      });
      if (!existing) {
        const newNotification = new Notification({
          userId: user._id,
          type: "reminder",
          message: "Daily reminder: Log your meals and workouts today!",
        });
        await newNotification.save();
      }
    }
  } catch (err) {
    console.error("Reminder job error:", err);
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const notifications = await Notification
      .find({ userId })
      .sort({ date: -1 })
      .lean();

    res.send(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!updated) return res.status(404).send({ message: "Notification not found" });
    res.send(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const deleted = await Notification.findOneAndDelete({ _id: id, userId });

    if (!deleted) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));