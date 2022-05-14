var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema to store the information about other logged in accounts
const accountSchema = new Schema({
  name: String,
  userId: String,
  email: String
});

// create User Schema
var UserSchema = new Schema({
  name: String,
  email: String,
  connectedSocialAccounts: {
    type: Number,
    default: 1
  },
  otherAccounts: [accountSchema],
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
