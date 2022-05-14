const express = require('express');
const router = express.Router({ strict: true });

const authRoutes = require('./auth');
const userRoutes = require('./user');
const { ensureAuthenticated } = require('@middleware/ensureAuthenticated');
const { cookieName } = require('../../config');
const mongoSessionStore = require('../../loaders/sessionStore').run();

// Authentication routes
router.use('/auth', authRoutes);

// User related protected routes
router.use('/user', ensureAuthenticated, userRoutes);

/**
 * Login and Logout routes are outside the auth routes module
 * Purely a personal preference, can be put inside auth routes module
 */
router.get('/login', (req, res) => res.render('login'));

router
  .route('/logout')
  .get(function(req, res, next) {
    req.session.destroy(function(err) {
      if(err) return res.redirect('/');
      res.clearCookie('sid');
      res.redirect('/login');
    });
  });

// router
//   .route('/logout')
//   .get(function(req, res, next) {
//     const currentSessionId = req.session.id;

//     // logout the user
//     req.logout();

//     // manually destroy the session, lingers for some time otherwise
//     mongoSessionStore.destroy(currentSessionId, (err, sessionObj) => {
//       if (err) {
//         console.log(`err destroying session with ID = ${currentSessionId}. err = ${err}`);
//         res.redirect('/');
//       }
//       else {
//         console.log(`session ${currentSessionId} is destroyed successfully!`);
//       }
//     });

//     // remove the cookie
//     res.clearCookie(cookieName, {
//       secure: null,
//       httpOnly: false,
//       domain: null,
//       path: '/',
//       sameSite: null
//     });

//     // redirect to /login
//     res.redirect('/login');
//   });

module.exports = router;