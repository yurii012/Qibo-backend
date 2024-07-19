const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  const { id, emails } = profile;
  let user = await User.findOne({ googleId: id });

  if (user) {
    return done(null, user);
  }

  user = new User({
    googleId: id,
    email: emails[0].value
  });

  await user.save();
  done(null, user);
}));