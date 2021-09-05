const router = require('./routes');
const express = require('express');
const cors = require('cors');
const { resolve } = require('path');
require('dotenv').config();

require('./config/db_connection');

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.router();
  }
  middlewares() {
    this.app.use(express.json());
    this.app.use('/files', express.static(resolve(__dirname, '../uploads')));

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
      res.header(
        'Access-Control-Allow-Headers',
        'X-PINGOTHER, Content-Type, Authorization'
      );
      this.app.use(cors());
      next();
    });
  }
  router() {
    this.app.use(router);
  }
}

module.exports = new App().app;
