const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "" 
    }
}, { timestamps: true })

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
