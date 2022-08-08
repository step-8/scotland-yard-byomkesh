const express = require('express');
const morgan = require('morgan');
const { credentialCheck, signupHandler } = require('./handlers/authUsers.js');
const { serveLandingPage } = require('./handlers/servePages.js');

const initApp = (config, users) => {
  const app = express();
  const { mode } = config;

  if (mode === 'production') {
    app.use(morgan('tiny'));
  }

  app.use(express.urlencoded({ extended: true }));
  app.get('/', serveLandingPage);
  app.post('/signup', credentialCheck, signupHandler(users));

  app.use(express.static('./public'));
  return app;
};

module.exports = { initApp };
