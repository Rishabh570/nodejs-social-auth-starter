/**
 * Github OAuth 2 strategy with provider sync support
 */
 const passport = require('passport');
 const GitHubStrategy = require('passport-github2').Strategy;
 
 const User = require('@models/user');
 const { default: mongoose } = require('mongoose');
 const config = require('@config');
 
 passport.use(new GitHubStrategy({
  clientID: config.githubClientId,
  clientSecret: config.githubClientSecret,
  callbackURL: config.githubCallbackURL,
  scope: 'user:email',
  passReqToCallback: true,
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
      if(!email) return done(new Error('Failed to receive email from Github. Please try again :('));

      const user = await User.findOne({
        $or: [
          { 'google.email': email },
          { 'amazon.email': email },
          { 'github.email': email },
        ]
      });
      console.log('user with email: ', user);
      
      if (req.user) {
        if (!req.user.github || (!req.user.github.email && !req.user.github.accessToken && !req.user.github.profileId)) {
          /**
          * proceed with provider sync, iff:
          * 1. req.user exists and no github account is currently linked
          * 2. there's no existing account with github login's email
          * 3. github login's email is present in req.user's object for any provider (indicates true ownership)
          */
         console.log('req.user._id: ', req.user._id);
         console.log('user: ', user._id);
          if(!user || (user && user._id.toString() == req.user._id.toString())) {
            console.log("github sync processing...");
            await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { github: { email: email, profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
            return done(null, req.user);
          }
          console.log("cannot sync github account, other account with github login's email already exists");
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
          github: {
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
 