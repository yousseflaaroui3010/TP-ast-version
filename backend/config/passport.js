// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Only setup Google strategy if we have environment variables
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google profile data:', JSON.stringify(profile, null, 2));
          
          // Extract profile picture URL - Google provides different sizes
          // Use a larger image by modifying the URL
          const profilePictureUrl = profile.photos && profile.photos.length > 0 
            ? profile.photos[0].value.replace('=s96-c', '=s400-c') 
            : null;
          
          console.log('Profile picture URL:', profilePictureUrl);
            
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // If user exists, update the profile picture if it's from Google
            if (profilePictureUrl) {
              user.profilePicture = profilePictureUrl;
              await user.save();
              console.log('Updated existing user with Google profile picture');
            }
            return done(null, user);
          }
          
          // Create password hash for consistency (won't be used for login)
          const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
          
          // Create new user
          user = new User({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword, // Required field but not used for OAuth
            profilePicture: profilePictureUrl // Save the Google profile picture URL directly
          });
          
          console.log('Created new user with Google profile data:', {
            fullName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profilePictureUrl
          });
          
          await user.save();
          return done(null, user);
        } catch (err) {
          console.error('Error in Google strategy:', err);
          return done(err, null);
        }
      }
    )
  );
  console.log('Google authentication strategy configured');
} else {
  console.log('Google OAuth credentials not found. Google authentication is disabled.');
}

module.exports = passport;