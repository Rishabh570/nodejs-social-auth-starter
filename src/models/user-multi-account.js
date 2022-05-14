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
  otherAccounts: [accountSchema],
  google: {
    accessToken: String,
    email: String,
    profileId: String,
  }
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
