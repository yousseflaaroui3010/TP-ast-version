// backend/server.js
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
require("dotenv").config();
// At the top of your server.js file, add these imports
const User = require('./models/User');
const Task = require('./models/Task');
const TaskColumn = require('./models/TaskColumn');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true // Allow cookies to be sent with requests
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve photos

// Express session - required for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'votre_secret_jwt',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport after session middleware
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MongoDB URI is undefined. Check your environment variables.");
  process.exit(1);
}
// Set up database structure and indexes
const setupDatabase = async () => {
  try {
    // Create indexes if they don't exist
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Task.collection.createIndex({ user: 1 });
    await Task.collection.createIndex({ column: 1, position: 1 });
    await TaskColumn.collection.createIndex({ user: 1 });
    await TaskColumn.collection.createIndex({ position: 1 });
    
  } catch (err) {
    console.error("Error setting up database:", err);
  }
};

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connecté");
    setupDatabase();
  })
  .catch(err => console.error('Erreur MongoDB:', err));
  

// Ajouter les routes
const taskRoutes = require("./routes/tasks");
const authRoutes = require('./routes/auth');
const columnRoutes = require('./routes/columns');

const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

app.use('/api/auth', authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/columns", columnRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));