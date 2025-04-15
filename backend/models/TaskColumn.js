// backend/models/TaskColumn.js
const mongoose = require("mongoose");

const taskColumnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  position: { type: Number, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaskColumn", taskColumnSchema);