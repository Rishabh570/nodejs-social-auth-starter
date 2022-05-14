var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create User Schema
var UserSchema = new Schema({
  name: String,
  connectedSocialAccounts: {
    type: Number,
    default: 1
  },
  google: {
    accessToken: String,
    email: String,
    profileId: String,
  },
  github: {
    accessToken: String,
    email: String,
    profileId: String,
  },
  amazon: {
    accessToken: String,
    email: String,
    profileId: String,
  }
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
