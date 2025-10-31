const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/connectDb");
const reg_model = require("./models/register");
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

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
