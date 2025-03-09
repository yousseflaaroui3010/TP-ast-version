const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String }, // Nouveau champ pour le nom complet
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
