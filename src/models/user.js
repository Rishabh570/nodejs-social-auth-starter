var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create User Schema
var UserSchema = new Schema({
  name: String,
  email: String,
  profileId: String,
  accessToken: String,
});

const User = mongoose.model('users', UserSchema);
module.exports = User;
