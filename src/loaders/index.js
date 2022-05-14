const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const sessionStore = require('./sessionStore');

module.exports = {
  run: async ({ expressApp }) => {
    const db = await mongooseLoader.run();
    console.log('✌️ DB loaded and connected!');

    const mongoSessionStore = sessionStore.run();
  
    await expressLoader.run({ app: expressApp, db, mongoSessionStore });
    console.log('✌️ Express loaded');

    passportLoader.run();
  }
}