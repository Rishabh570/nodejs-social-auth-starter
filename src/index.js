require('module-alias/register');

const express = require('express');
const loaders = require('@loaders');
const config = require('@config');

async function run() {
  const app = express();

  await loaders.run({ expressApp: app });

  app.listen(config.port, () => {
    console.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    console.error(err);
    process.exit(1);
  });
}

run();
