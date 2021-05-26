/* eslint-disable node/no-path-concat */
import { Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

const router = new Router();
readdirSync(path.join(__dirname, 'config', 'routes')).map(async (file) => {
  if (!file.endsWith('.map')) {
    (await import(`./config/routes/${file}`)).default(router);
  }
});

export default router;
