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
      const user = await User.findOne({
        $or: [
          { 'google.email': profile['_json']['email'] },
          { 'amazon.email': profile['_json']['email'] },
          { 'github.email': profile['_json']['email'] },
        ]
      });
      console.log('user with email: ', user);
      
      if (req.user) {
        if (!req.user.google || (!req.user.google.email && !req.user.google.accessToken && !req.user.google.profileId)) {
          /**
           * proceed with provider sync, iff:
           * 1. req.user exists and no google account is currently linked
           * 2. there's no existing account with google login's email
           * 3. google login's email is present in req.user's object for any provider (indicates true ownership)
           */
          if(!user || (user && user._id.toString() === req.user._id.toString())) {
            console.log("google sync processing...");
            await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { google: { email: profile['_json']['email'], profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
            return done(null, req.user);
          }
          console.log("cannot sync google account, other account with google login's email already exists");
        }
        return done(null, req.user);
      } else {
        if (user) {
          return done(null, user);
        }
        const newUser = await User.create({
          name: profile.displayName,
          connectedSocialAccount: 1,
          otherAccounts: [],
          google: {
            accessToken,
            profileId: profile.id,
            email: profile['_json']['email']
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
