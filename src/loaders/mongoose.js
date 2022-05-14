const mongoose = require('mongoose');
const config = require('@config');

module.exports = {
  run: async () => {
    return mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    }).then(m => {
      return m.connection.getClient();
    });
  }
};
