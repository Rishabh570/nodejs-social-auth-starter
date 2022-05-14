var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var User = require('@models/user');
var config = require('@config');
const { default: mongoose } = require('mongoose');
const mongoSessionStore = require('../../loaders/sessionStore').run();

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

      const user = await User.findOne({ 'github.email': email });

      if (req.user) {
        if (!req.user.github || (!req.user.github.email && !req.user.github.accessToken && !req.user.github.profileId)) {
          // skip provider sync if user document exists
          if(user) return done(null, req.user);

          // provider sync request
          await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { github: { email: email, profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
          return done(null, req.user);
        }
        else {
          if (req.user.github.email === email) {
            // TODO: fetch user where id = req.user._id and overwrite freshly received details on existing req.user.github
            return done(null, req.user);
          } else {
            if (user && req.user.otherAccounts.includes(user._id)) {
              // existing user logged in with Github acc of another existing user => existing logged in user
              // owns both accounts, two reasons:
              // 1. They have access to both Github accounts,
              // 2. req.user.otherAccounts array includes user's _id
              // return user obj who's trying to switch to their "other logged in account"
              
              // Same use-case as /api/auth/github/switch/:userId
              // Simply return user who's trying to log in, records already exists, no action needed
              return done(null, user); 
            } else {
              // fresh request to add "other logged in account"
              
              // store the new user in DB with mapping in "otherAccounts"
              const newUser = await User.create({
                name: profile.displayName,
                connectedSocialAccount: 1,
                otherAccounts: [req.user._id],
                github: {
                  accessToken,
                  profileId: profile.id,
                  email,
                }
              });
              
              const existingUser = await User.findOne({ '_id': req.user._id });
              existingUser.otherAccounts.push(newUser._id);
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
          github: {
            accessToken,
            profileId: profile.id,
            email,
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
