// backend/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  dueDate: { type: Date },
  position: { type: Number, default: 0 },
  column: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "TaskColumn", 
    required: true 
  },
  labels: [{ type: String }],
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the 'updatedAt' field on save
taskSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);