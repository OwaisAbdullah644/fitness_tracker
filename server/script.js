const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { StringDecoder } = require("string_decoder");
const { stringify } = require("csv-stringify");

const connectDb = require("./config/connectDb");
connectDb();

const User = require("./models/register");
const Workout = require("./models/workout");
const Progress = require("./models/progress");
const Nutrition = require("./models/nutrition");
const Notification = require("./models/notification");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });


const authMiddleware = async (req, res, next) => {
  const { userId } = req.body || req.query;
  if (!userId) return res.status(401).send({ message: "userId required" });

  const user = await User.findById(userId);
  if (!user) return res.status(401).send({ message: "Invalid user" });

  req.user = user;
  next();
};


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

app.get("/profile", authMiddleware, async (req, res) => {
  const { _id, name, email, image } = req.user;
  res.send({ _id, name, email, image });
});

app.post("/profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const update = { name, email };
    if (req.file) update.image = req.file.filename;

    const updated = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
    }).select("name email image");

    res.send(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});


app.get("/preferences", authMiddleware, async (req, res) => {
  res.send(req.user.preferences);
});

app.post("/preferences", authMiddleware, async (req, res) => {
  const { notifications, units, theme } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    {
      "preferences.notifications": notifications,
      "preferences.units": units,
      "preferences.theme": theme,
    },
    { new: true }
  ).select("preferences");

  res.send(updated.preferences);
});


app.post("/workouts", authMiddleware, async (req, res) => {
  try {
    const {
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
      userId: req.user._id,
      exerciseName,
      sets,
      reps,
      weights,
      notes,
      category,
      tags: tags ? tags.split(",") : [],
      date: new Date(date),
    });

    if (req.user.preferences.notifications) {
      const newNotification = new Notification({
        userId: req.user._id,
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

app.get("/workouts", authMiddleware, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const workouts = await Workout.find({ userId: req.user._id })
    .sort({ date: -1 })
    .limit(+limit)
    .skip((+page - 1) * +limit)
    .lean();
  res.send(workouts);
});

app.post("/workouts/:id", authMiddleware, async (req, res) => {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!workout) return res.status(404).send({ message: "Not found" });
  res.send(workout);
});

app.delete("/workouts/:id", authMiddleware, async (req, res) => {
  const workout = await Workout.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!workout) return res.status(404).send({ message: "Not found" });
  res.send({ message: "Deleted" });
});


app.post("/progress", authMiddleware, async (req, res) => {
  const { date, weight, measurements, performance } = req.body;
  const prog = await Progress.create({
    userId: req.user._id,
    date: new Date(date),
    weight,
    measurements,
    performance,
  });

  if (req.user.preferences.notifications) {
    const newNotification = new Notification({
      userId: req.user._id,
      type: 'activity',
      message: `New progress logged: Weight ${weight}kg`,
    });
    await newNotification.save();
  }

  res.status(201).send(prog);
});

app.get("/progress", authMiddleware, async (req, res) => {
  const entries = await Progress.find({ userId: req.user._id })
    .sort({ date: 1 })
    .lean();
  res.send(entries);
});

app.post("/progress/:id", authMiddleware, async (req, res) => {
  const prog = await Progress.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!prog) return res.status(404).send({ message: "Not found" });
  res.send(prog);
});

app.delete("/progress/:id", authMiddleware, async (req, res) => {
  const prog = await Progress.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!prog) return res.status(404).send({ message: "Not found" });
  res.send({ message: "Deleted" });
});


const validateNutrition = (req, res, next) => {
  const { mealType, foodItems, date } = req.body;
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
  next();
};

app.post(
  "/nutrition",
  authMiddleware,
  validateNutrition,
  async (req, res) => {
    const { mealType, foodItems, date, notes } = req.body;
    const log = await Nutrition.create({
      userId: req.user._id,
      mealType,
      foodItems,
      date: new Date(date),
      notes,
    });

    if (req.user.preferences.notifications) {
      const newNotification = new Notification({
        userId: req.user._id,
        type: 'activity',
        message: `New nutrition log for ${mealType}`,
      });
      await newNotification.save();
    }

    res.status(201).send(log);
  }
);

app.get("/nutrition", authMiddleware, async (req, res) => {
  const { page = 1, limit = 20, mealType, date } = req.query;

  const filter = { userId: req.user._id };
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

app.post(
  "/nutrition/:id",
  authMiddleware,
  validateNutrition,
  async (req, res) => {
    const log = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).send({ message: "Not found" });
    res.send(log);
  }
);

app.delete("/nutrition/:id", authMiddleware, async (req, res) => {
  const log = await Nutrition.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!log) return res.status(404).send({ message: "Not found" });
  res.send({ message: "Deleted" });
});

// ---------- Analytics ----------
app.get("/analytics/nutrition", authMiddleware, async (req, res) => {
  const { period = "week" } = req.query;
  const now = new Date();
  let start;

  if (period === "week") start = new Date(now.setDate(now.getDate() - 7));
  else if (period === "month")
    start = new Date(now.setMonth(now.getMonth() - 1));
  else start = new Date(now.setFullYear(now.getFullYear() - 1));

  const data = await Nutrition.aggregate([
    { $match: { userId: req.user._id, date: { $gte: start } } },
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

// ---------- CSV Report ----------
app.get("/reports/nutrition", authMiddleware, async (req, res) => {
  const { format = "csv" } = req.query;
  if (format !== "csv")
    return res.status(400).send({ message: "Only CSV supported" });

  const logs = await Nutrition.find({ userId: req.user._id })
    .sort({ date: -1 })
    .lean();

  const rows = logs.map((l) => ({
    Date: new Date(l.date).toISOString().split("T")[0],
    Meal: l.mealType,
    Foods: l.foodItems.map((i) => i.name).join("; "),
    Calories: l.foodItems.reduce((s, i) => s + i.calories, 0),
  }));

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=nutrition_report.csv"
  );

  const stringifier = stringify(rows, { header: true });
  stringifier.pipe(res);
});

// ------------------------------------------------------------------
// Daily reminder (8 AM)
// ------------------------------------------------------------------
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



app.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification
      .find({ userId: req.user._id })
      .sort({ date: -1 })
      .lean();

    res.send(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

// Removed public POST /notifications as notifications are now triggered internally

app.post("/notifications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
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

app.delete("/notifications/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deleted) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));