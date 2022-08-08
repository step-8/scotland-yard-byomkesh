const express = require('express');
const morgan = require('morgan');
const { credentialCheck, signupHandler, validateInput, loginHandler } = require('./handlers/authUsers.js');
const { serveLandingPage } = require('./handlers/servePages.js');

const initApp = (config, users) => {
  const app = express();
  const { mode, views } = config;

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }

  app.use(express.urlencoded({ extended: true }));
  app.get('/', serveLandingPage(views));

  app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: views });
  });
  app.post('/signup', credentialCheck, signupHandler(users));

  app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: views });
  });
  app.post('/login', validateInput, loginHandler(users));

  app.use(express.static('./public'));
  return app;
};

module.exports = { initApp };
