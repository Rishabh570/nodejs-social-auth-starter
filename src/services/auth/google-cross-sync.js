/**
 * Google OAuth 2 strategy with provider sync support
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('@models/user');
const config = require('@config');

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: config.googleCallbackUrl,
  scope: ['profile', 'email'],
  passReqToCallback: true,
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      const email = profile['_json']['email'];
      if(!email) return done(new Error('Failed to receive email from Google. Please try again :('));

      const user = await User.findOne({
        $or: [
          { 'google.email': email },
          { 'amazon.email': email },
          { 'github.email': email },
        ]
      });
      
      if (req.user) {
        if (!req.user.google || (!req.user.google.email && !req.user.google.accessToken && !req.user.google.profileId)) {
          /**
           * proceed with provider sync, iff:
           * 1. req.user exists and no google account is currently linked
           * 2. there's no existing account with google login's email
           * 3. google login's email is present in req.user's object for any provider (indicates true ownership)
           */
          if(!user || (user && user._id.toString() === req.user._id.toString())) {
            await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { google: { email: email, profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
            return done(null, req.user);
          }
          // cannot sync google account, other account with google login's email already exists
        }
        return done(null, req.user);
      } else {
        if (user) {
          return done(null, user);
        }
        const newUser = await User.create({
          name: profile.displayName,
          connectedSocialAccount: 1,
          google: {
            accessToken,
            profileId: profile.id,
            email: email
          }
        });
        return done(null, newUser);
      }
    } catch (verifyErr) {
      done(verifyErr);
    }
  }
));


module.exports = passport;
