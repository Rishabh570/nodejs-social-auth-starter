var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('@models/user');
var config = require('@config');
const { default: mongoose } = require('mongoose');
const mongoSessionStore = require('../../loaders/sessionStore').run();

passport.use(new FacebookStrategy({
  clientID: config.facebookAppId,
  clientSecret: config.facebookAppSecret,
  callbackURL: config.facebookCallbackUrl,
  profileFields: ['email', 'id', 'displayName', 'photos'],
  passReqToCallback: true,
  },
  async function(req, accessToken, refreshToken, profile, done) {
    console.log('profile: ', profile);
    try {
      const email = profile.email ? profile.email : null;
      if(!email) return done(new Error('Failed to receive email from FB. Please try again :('));

      const user = await User.findOne({ 'facebook.email': email });
      console.log('user trying to log in: ', user);

      if (req.user) {
        if (!req.user.facebook || (!req.user.facebook.email && !req.user.facebook.accessToken && !req.user.facebook.profileId)) {
          // skip provider sync if user document exists
          if(user) return done(null, req.user);

          // provider sync request
          console.log('syncing facebook acc to logged in user...');
          await User.findOneAndUpdate({ '_id': req.user._id }, { $set: { facebook: { email: email, profileId: profile.id, accessToken }, connectedSocialAccounts: (req.user.connectedSocialAccounts + 1) }});
          return done(null, req.user);
        }
        else {
          if (req.user.facebook.email === email) {
            // fetch user where id = req.user._id and overwrite freshly received details on existing req.user.facebook
            return done(null, req.user);
          } else {
            if (user && req.user.otherAccounts.includes(user._id)) {
              // existing user logged in with Facebook acc of another existing user => existing logged in user
              // owns both accounts, two reasons:
              // 1. They have access to both Facebook accounts,
              // 2. req.user.otherAccounts array includes user's _id
              // return user obj who's trying to switch to their "other logged in account"
              
              // Same use-case as /api/auth/facebook/switch/:userId
              // Simply return user who's trying to log in, records already exists, no action needed
              return done(null, user); 
            } else {
              console.log('ADDING ALTERNATE FACEBOOK USER...');
              // fresh request to add "other logged in account"
              
              // store the new user in DB with mapping in "otherAccounts"
              const newUser = await User.create({
                name: profile.displayName,
                connectedSocialAccount: 1,
                otherAccounts: [req.user._id],
                facebook: {
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
                console.log('FB currentSession: ', currentSession);
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
          facebook: {
            accessToken,
            profileId: profile.id,
            email,
          }
        });
        console.log('fresh facebook login, newUser: ', newUser);
        return done(null, newUser);
      }
    } catch (verifyErr) {
      done(verifyErr);
    }
    
    
    
    
    
    
    
    
    
    
    // // update the user if s/he exists or add a new user
    // User.findOne(searchQuery, function(err, user) {
    //   if(err) {
    //     console.log('[facebook] err: ', err);
    //     return done(err);
    //   } else if (user !== null) {
    //     // TODO: increment connectedSocialAccount if fb not already present
    //     user.facebook = {
    //       accessToken: accessToken,
    //       profileId: profile.id,
    //       email: profile['_json']['email']
    //     }
    //     user.save(function (updateErr) {
    //       if (updateErr) { return done(updateErr); }
    //       else return done(null, user);
    //     });
    //     return done(null, user);
    //   } else {
    //     console.log("user not present, creating one...");
    //     user = new User({
    //       name: profile.displayName,
    //       connectedSocialAccount: 1,
    //       facebook: {
    //         accessToken,
    //         profileId: profile.id,
    //       //   email: profile.emails && profile.emails.length ? profile.emails[0].value : null,
    //       }
    //     });
    //     user.save(function(err) {
    //       if(err) {
    //         console.log('err occurred while saving facebook user: ', err);
    //         console.log(err);  // handle errors!
    //       } else {
    //         console.log("saving user ...");
    //         done(null, user);
    //       }
    //     });
    //   }
    // });
  }

));


module.exports = passport;
