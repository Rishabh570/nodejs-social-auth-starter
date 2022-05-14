const cors = require('cors');
const path = require('path');
const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const User = require('@models/user');

const routes = require('@routes');
const config = require('@config');
const { cookieName } = require('../config');

module.exports = {
  run: ({ app, db, mongoSessionStore }) => {
    passport.serializeUser(function(user, done) {
      process.nextTick(function () {
        done(null, user._id);
      });
    });
    passport.deserializeUser(function(id, done) {
      process.nextTick(function () {
        User.findById(id, function(err, user){
            if(!err) done(null, user);
            else done(err, null);
          });
      });
    });
    
    // Set static files folder
    app.use(express.static(path.join(__dirname, '../../public')));
    
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.json({ limit: '50mb' }));

    app.set("strict routing", true);
    
    app.use(cors());

    app.use(expressSession({
      name: cookieName,
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      cookie: {
        httpOnly: false,
        maxAge: 300000, // 5 min
      },
      store: mongoSessionStore
    }));

    // Enable passport authentication, session and plug strategies
    app.use(passport.initialize());
    app.use(passport.session());

    // Load API routes
    app.use(config.api.prefix, routes);
    
    app.use(express.static(path.resolve(__dirname, '../../', 'client', 'build')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../../', 'client', 'build', 'index.html'));
    });

    // Error handlers
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      process.exit(1);
    });

    process.on('uncaughtException', (err) => {
      console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      process.exit(1);
    });
  }
}