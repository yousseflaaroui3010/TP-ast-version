// test-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const TaskColumn = require('./models/TaskColumn');

const mongoURI = process.env.MONGO_URI;

const testDbConnection = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
    
    // Check for indexes
    console.log("\n--- USER INDEXES ---");
    const userIndexes = await User.collection.indexes();
    console.log(userIndexes);
    
    console.log("\n--- TASK INDEXES ---");
    const taskIndexes = await Task.collection.indexes();
    console.log(taskIndexes);
    
    console.log("\n--- COLUMN INDEXES ---");
    const columnIndexes = await TaskColumn.collection.indexes();
    console.log(columnIndexes);
    
    // Count documents in each collection
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const columnCount = await TaskColumn.countDocuments();
    
    console.log("\n--- COLLECTION STATS ---");
    console.log(`Users: ${userCount} documents`);
    console.log(`Tasks: ${taskCount} documents`);
    console.log(`Columns: ${columnCount} documents`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error("Database test failed:", err);
  }
};

testDbConnection();