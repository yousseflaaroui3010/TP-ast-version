// seed-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
const TaskColumn = require('./models/TaskColumn');

const mongoURI = process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      fullName: 'Test User'
    });
    
    console.log("Test user created:", testUser._id);
    
    // Create test columns
    const columns = await TaskColumn.insertMany([
      { title: 'To Do', position: 0, user: testUser._id },
      { title: 'In Progress', position: 1, user: testUser._id },
      { title: 'Done', position: 2, user: testUser._id }
    ]);
    
    console.log("Test columns created");
    
    // Create test tasks
    const tasks = await Task.insertMany([
      {
        title: 'Learn MongoDB',
        description: 'Study MongoDB indexes and aggregation',
        priority: 'high',
        position: 0,
        column: columns[0]._id,
        user: testUser._id
      },
      {
        title: 'Implement drag and drop',
        description: 'Add smooth drag and drop to the board',
        priority: 'medium',
        position: 1,
        column: columns[0]._id,
        user: testUser._id
      },
      {
        title: 'Add user settings',
        description: 'Create user profile settings page',
        priority: 'low',
        position: 0,
        column: columns[1]._id,
        user: testUser._id
      }
    ]);
    
    console.log("Test tasks created");
    console.log("Database seeded successfully!");
    
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

seedDatabase();