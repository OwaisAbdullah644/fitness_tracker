const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://owais:owais456@cluster0.jhrgmwt.mongodb.net/fitness_tracker");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
};

module.exports = connectDb;
