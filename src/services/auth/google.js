// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const User = require('@models/user');
// const config = require('@config');
// const { default: mongoose } = require('mongoose');
// const mongoSessionStore = require('../../loaders/sessionStore').run();

// passport.use(new GoogleStrategy({
//   clientID: config.googleClientId,
//   clientSecret: config.googleClientSecret,
//   callbackURL: config.googleCallbackUrl,
//   scope: ['profile', 'email'],
//   passReqToCallback: true,
//   // state: true,
//   },
//   async function(req, accessToken, refreshToken, profile, done) {
//     try {
//       const email = profile['_json']['email'];
//       if(!email) return done(new Error('Failed to receive email from Google. Please try again :('));

//       const user = await User.findOne({ 'email': email });
      
//       if (user) {
//         return done(null, user);
//       }
//       const newUser = await User.create({
//         name: profile.displayName,
//         profileId: profile.id,
//         email: email,
//         accessToken,
//       });
//       return done(null, newUser);
//     } catch (verifyErr) {
//       done(verifyErr);
//     }
//   }

// ));


// module.exports = passport;
