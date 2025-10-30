const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://owais:xuDZJ8xCQL065iSd@cluster0.et44uhk.mongodb.net/fitness_tracker");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
};

module.exports = connectDb;
