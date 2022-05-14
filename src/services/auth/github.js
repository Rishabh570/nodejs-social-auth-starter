// var passport = require('passport');
// var GitHubStrategy = require('passport-github2').Strategy;

// var User = require('@models/user');
// var config = require('@config');

// passport.use(new GitHubStrategy({
//   clientID: config.githubClientId,
//   clientSecret: config.githubClientSecret,
//   callbackURL: config.githubCallbackURL,
//   scope: 'user:email',
//   passReqToCallback: true,
//   },
//   async function(req, accessToken, refreshToken, profile, done) {
//     try {
//       const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
//       if(!email) return done(new Error('Failed to receive email from Github. Please try again :('));

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
