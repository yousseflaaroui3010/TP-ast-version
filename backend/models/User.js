// backend/models/User.js - Check that your file looks like this
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Make sure the model is correctly exported
module.exports = mongoose.model("User", userSchema);