// performance-test.js
require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

const mongoURI = process.env.MONGO_URI;

const testPerformance = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
    
    // Test query with explain - test on all tasks
    console.log("\n--- TASK QUERY PERFORMANCE ---");
    const explanation = await Task.find({}).limit(10).explain('executionStats');
    console.log(JSON.stringify(explanation.executionStats, null, 2));
    
    // Test with index
    if (Task.collection.indexExists('user_1')) {
      console.log("\n--- TASK QUERY WITH USER INDEX ---");
      // Find a sample user ID from tasks
      const sampleTask = await Task.findOne();
      if (sampleTask) {
        const userIdQuery = await Task.find({ user: sampleTask.user }).explain('executionStats');
        console.log(JSON.stringify(userIdQuery.executionStats, null, 2));
      } else {
        console.log("No tasks found to test user index");
      }
    }
    
    mongoose.disconnect();
  } catch (err) {
    console.error("Performance test failed:", err);
  }
};

testPerformance();