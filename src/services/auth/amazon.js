// var passport = require('passport');
// var AmazonStrategy = require('passport-amazon').Strategy;

// var User = require('@models/user');
// var config = require('@config');

// passport.use(new AmazonStrategy({
//   clientID: config.amazonClientId,
//   clientSecret: config.amazonClientSecret,
//   callbackURL: config.amazonCallbackUrl,
//   passReqToCallback: true,
//   },
//   async function(req, accessToken, refreshToken, profile, done) {
//     try {
//       const email = profile && profile.emails ? profile.emails[0].value : null;
//       if(!email) return done(new Error('Failed to receive email from amazon. Please try again :('));

//       const user = await User.findOne({ 'email': email });
//       if (user) {
//         return done(null, user);
//       }
//       const newUser = await User.create({
//         name: profile.displayName,
//         profileId: profile.id,
//         email,
//         accessToken,
//       });
//       return done(null, newUser);
//     } catch (verifyErr) {
//       done(verifyErr);
//     }
//   }
// ));

// module.exports = passport;
