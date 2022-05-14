const express = require('express');
const passportGoogleMultiAccount = require('@services/auth/google-multi-account');
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


router
  .route('/google/callback')
  .get(passportGoogleMultiAccount.authenticate('google', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/'
  }));

router
  .route('/google')
  .get(passportGoogleMultiAccount.authenticate('google'));


module.exports = router;
