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
      const user = await User.findOne({ 'google.email': profile['_json']['email'] });
      console.log('google user with email: ', user);
      
      if (req.user) {
        if (!req.user.google || (!req.user.google.email && !req.user.google.accessToken && !req.user.google.profileId)) {
          // skip provider sync if user document exists
          if(user) {
            console.log("google not connected, but google email is already taken");
            return done(null, req.user);
          }

          console.log("provider sync happening for google...");
          // provider sync request
          await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { google: { email: profile['_json']['email'], profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
          return done(null, req.user);
        }
        else {
          if (req.user.google.email === profile['_json']['email']) {
            // TODO: fetch user where id = req.user._id and overwrite freshly received details on existing req.user.google
            console.log("google already linked, logging in with already linkead google email");
            return done(null, req.user);
          } else {
            if (user && req.user.otherAccounts.find((accountObj) => user._id === accountObj.userId)) {
              // existing user logged in with Google acc of another existing user => existing logged in user
              // owns both accounts, two reasons:
              // 1. They have access to both Google accounts,
              // 2. req.user.otherAccounts array includes user's _id
              // return user obj who's trying to switch to their "other logged in account"
              
              // Same use-case as /api/auth/google/switch/:userId
              // Simply return user who's trying to log in, records already exists, no action needed
              return done(null, user); 
            }
            // fresh request to add "other logged in account"
            else {  
              // Update otherAccounts in req.user, newUser and user documents of req.user.otherAccounts
              // step 1
              const newUser = await User.create({
                name: profile.displayName,
                connectedSocialAccount: 1,
                otherAccounts: [ ...req.user.otherAccounts, { userId: req.user._id, name: req.user.name, email: req.user.google.email } ],
                google: {
                  accessToken,
                  profileId: profile.id,
                  email: profile['_json']['email']
                }
              });

              // step 2
              req.user.otherAccounts.forEach(async (otherAccount) => {
                await User.findOneAndUpdate({ '_id': otherAccount.userId }, { $push: { otherAccounts: { userId: newUser._id, email: newUser.google.email, name: newUser.name } } });
              });
              
              // step 3
              const existingUser = await User.findOne({ '_id': req.user._id });
              existingUser.otherAccounts.push({ userId: newUser._id, email: newUser.google.email, name: newUser.name });
              await existingUser.save();

              // update session in mongo
              mongoSessionStore.get(req.session.id, (err, currentSession) => {
                currentSession.passport.user = new mongoose.Types.ObjectId(newUser._id);
                mongoSessionStore.set(req.session.id, currentSession, (updateErr, finalRes) => {
                  // return the new user
                  return done(null, newUser);
                });
              });
            }
          }
        }
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
