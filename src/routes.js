/* eslint-disable node/no-path-concat */
const { Router } = require('express');
const { readdirSync } = require('fs');
const path = require('path');

const router = new Router();
readdirSync(path.join(__dirname, 'config', 'routes')).map(async (file) => {
  if (!file.endsWith('.map')) {
    (await import(`./config/routes/${file}`)).default(router);
  }
});

module.exports = router;
