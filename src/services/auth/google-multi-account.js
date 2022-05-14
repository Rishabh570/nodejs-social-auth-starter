const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('@models/user');
const config = require('@config');
const { default: mongoose } = require('mongoose');
const mongoSessionStore = require('../../loaders/sessionStore').run();

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: config.googleCallbackUrl,
  scope: ['profile', 'email'],
  passReqToCallback: true,
  // state: true,
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      const email = profile['_json']['email'];
      if(!email) return done(new Error('Failed to receive email from Google. Please try again :('));

      const user = await User.findOne({ 'email': email });
      
      if (req.user) {
        if (req.user.email !== email) {
          if (user && req.user.otherAccounts.find((accountObj) => user._id === accountObj.userId)) {
            return done(null, user); 
          }
          else {
            // fresh request to add "other logged in account"
            // step 1
            const newUser = await User.create({
              name: profile.displayName,
              email,
              profileId: profile.id,
              accessToken,
              otherAccounts: [ ...req.user.otherAccounts, { userId: req.user._id, name: req.user.name, email: req.user.email } ],
            });

            
            // step 2: update otherAccounts for already logged in users
            req.user.otherAccounts.forEach(async (otherAccount) => {
              await User.findOneAndUpdate({ '_id': otherAccount.userId }, { $push: { otherAccounts: { userId: newUser._id, email: newUser.email, name: newUser.name } } });
            });
            
            // step 3: : update otherAccounts for logged in user
            const existingUser = await User.findOne({ '_id': req.user._id });
            existingUser.otherAccounts.push({ userId: newUser._id, email: newUser.email, name: newUser.name });
            await existingUser.save();

            // update session in mongo
            mongoSessionStore.get(req.sessionID, (err, currentSession) => {
              currentSession.passport.user = new mongoose.Types.ObjectId(newUser._id);
              mongoSessionStore.set(req.sessionID, currentSession, (updateErr, finalRes) => {
                // return the new user
                return done(null, newUser);
              });
            });
          }
        } else {
          return done(null, req.user);
        }
      } else {
        if (user) {
          return done(null, user);
        }
        const newUser = await User.create({
          name: profile.displayName,
          email,
          accessToken,
          profileId: profile.id,
          otherAccounts: [],
        });
        return done(null, newUser);
      }
    } catch (verifyErr) {
      done(verifyErr);
    }
  }

));


module.exports = passport;
