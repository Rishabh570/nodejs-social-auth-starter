const express = require('express');
// const passportGithub = require('@services/auth/github');
const passportGithubCrossSync = require('@services/auth/github-cross-sync');
// const passportGoogle = require('@services/auth/google');
const passportGoogleCrossSync = require('@services/auth/google-cross-sync');
// const passportAmazon = require('@services/auth/amazon');
const passportAmazonCrossSync = require('@services/auth/amazon-cross-sync');
const { disconnectGoogle, disconnectAmazon, disconnectGithub } = require('../../services/user');
const { ensureAuthenticated } = require('@middleware/ensureAuthenticated');
const { default: mongoose } = require('mongoose');
const mongoSessionStore = require('../../loaders/sessionStore').run();

const router = express.Router();

/**
 * Google Auth Routes
 */

router.get('/google/switch/:userId', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const currentSessionId = req.sessionID;
  const newUserId = new mongoose.Types.ObjectId(userId);

  if (req.user.otherAccounts && !req.user.otherAccounts.find((otherAcc => otherAcc.userId === userId))) {
    // not authorized to switch
    return res.redirect('/');
  }

  mongoSessionStore.get(currentSessionId, (err, sessionObj) => {
    if (err) {
      res.redirect('/');
    }
    else {
      sessionObj.passport.user = newUserId;
      mongoSessionStore.set(currentSessionId, sessionObj, (updateErr, finalRes) => {
        if(updateErr) {
          console.log('error occurred while updating session');
        }
        res.redirect('/');
      });
    }
  });
});

router.get('/google/disconnect', async (req, res) => {
  if(req.user.connectedSocialAccounts > 1) {
    await disconnectGoogle(req.user);
  }
  res.redirect('/');
});

router
  .route('/google/callback')
  .get(passportGoogleCrossSync.authenticate('google', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/'
  }));

router
  .route('/google')
  .get(passportGoogleCrossSync.authenticate('google'));


/**
 * Amazon auth routes
 */

router.get('/amazon/disconnect', async (req, res) => {
  if(req.user.connectedSocialAccounts > 1) {
    await disconnectAmazon(req.user);
  }
  res.redirect('/');
});

router
 .route('/amazon/callback')
 .get(
   passportAmazonCrossSync.authenticate('amazon', { failureRedirect: '/login' }),
   function(req, res) {
     // Successful authentication, redirect home.
     res.redirect('/');
   });

router.route('/amazon').get(passportAmazonCrossSync.authenticate('amazon', { scope: ['profile', 'postal_code'] }));

/**
 * Github auth routes
 */

router.get('/github/disconnect', async (req, res) => {
  if(req.user.connectedSocialAccounts > 1) {
    await disconnectGithub(req.user);
  }
  res.redirect('/');
});

router
.route('/github/callback')
.get(
  passportGithubCrossSync.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.route('/github').get(passportGithubCrossSync.authenticate('github', { scope: [ 'user:email' ] }));


/**
 * Facebook auth routes
 * not receiving email from facebook :(
 */

// router.get('/facebook/disconnect', async (req, res) => {
//   if(req.user.connectedSocialAccounts > 1) {
//     const user = await disconnectFacebook(req.user);
//     console.log('user: ', user);
//   }
//   res.redirect('/');
// });

// router
//   .route('/facebook/callback')
//   .get(
//     passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
//     function(req, res) {
//       // Successful authentication, redirect home.
//       res.redirect('/');
//     });

// router.route('/facebook').get(passportFacebook.authenticate('facebook', { scope: [ 'email', 'id', 'displayName', 'photos' ] }));




module.exports = router;