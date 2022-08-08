const express = require('express');
const morgan = require('morgan');
const { credentialCheck, signupHandler } = require('./handlers/authUsers.js');
const { serveLandingPage, serveLobby } = require('./handlers/servePages.js');

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

  app.get('/host', serveLobby(views));

  app.use(express.static('./public'));
  return app;
};

module.exports = { initApp };
