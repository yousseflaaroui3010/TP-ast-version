const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
require("dotenv").config();

// Import passport after dotenv to ensure environment variables are loaded
const passport = require('./config/passport');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir les photos

// Express session
app.use(session({
  secret: process.env.JWT_SECRET || 'votre_secret_jwt',
  resave: false,
  saveUninitialized: false,
  // Adding cookie settings to make it more robust
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
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

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error('Erreur MongoDB:', err));

// Ajouter les routes
const taskRoutes = require("./routes/tasks");
const authRoutes = require('./routes/auth');
const columnRoutes = require('./routes/columns');

app.use('/api/auth', authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/columns", columnRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));