// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const passport = require('passport');

// Inscription standard
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription" });
  }
});

// Connexion standard
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "votre_secret_jwt", {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route d'initiation de l'authentification Google
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route de callback Google OAuth
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login?error=google_auth_failed' }),
  (req, res) => {
    try {
      // Create JWT token for the authenticated user
      const token = jwt.sign(
        { id: req.user._id }, 
        process.env.JWT_SECRET || "votre_secret_jwt",
        { expiresIn: "1h" }
      );
      
      // Redirect to frontend with token
      res.redirect(`http://localhost:3000/auth-success?token=${token}`);
    } catch (err) {
      console.error('Error during Google callback:', err);
      res.redirect('http://localhost:3000/login?error=authentication_failed');
    }
  }
);

// Récupérer les infos de l'utilisateur connecté
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;