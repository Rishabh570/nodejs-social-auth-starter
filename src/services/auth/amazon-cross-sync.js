/**
 * Amazon OAuth 2 strategy with provider sync support
 */
 const passport = require('passport');
 const AmazonStrategy = require('passport-amazon').Strategy;
 
 const User = require('@models/user');
 const config = require('@config');
 
 passport.use(new AmazonStrategy({
  clientID: config.amazonClientId,
  clientSecret: config.amazonClientSecret,
  callbackURL: config.amazonCallbackUrl,
  passReqToCallback: true,
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      const email = profile && profile.emails ? profile.emails[0].value : null;
      if(!email) return done(new Error('Failed to receive email from amazon. Please try again :('));

      const user = await User.findOne({
        $or: [
          { 'google.email': email },
          { 'amazon.email': email },
          { 'github.email': email },
        ]
      });
      
      if (req.user) {
        if (!req.user.amazon || (!req.user.amazon.email && !req.user.amazon.accessToken && !req.user.amazon.profileId)) {
          /**
          * proceed with provider sync, iff:
          * 1. req.user exists and no amazon account is currently linked
          * 2. there's no existing account with amazon login's email
          * 3. amazon login's email is present in req.user's object for any provider (indicates true ownership)
          */
          if(!user || (user && user._id.toString() === req.user._id.toString())) {
            await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { amazon: { email: email, profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
            return done(null, req.user);
          }
          // cannot sync amazon account, other account with amazon login's email already exists
        }
        return done(null, req.user);
      } else {
        if (user) {
          return done(null, user);
        }
        const newUser = await User.create({
          name: profile.displayName,
          connectedSocialAccount: 1,
          amazon: {
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
 