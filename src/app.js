const express = require('express');
const morgan = require('morgan');

const { serveUsername } = require('./handlers/serveUsername.js');

const authLib = require('./handlers/authUsers.js');
const { credentialCheck, signupHandler, protectedAuth } = authLib;
const { validateInput, loginHandler, logoutHandler } = authLib;

const { validateAnchor } = require('./middlewares/validateAnchor.js');

const pagesLib = require('./handlers/servePages.js');
const { serveLandingPage, serveSignupPage, serveLobby } = pagesLib;
const { serveLoginPage } = pagesLib;

const initApp = (config, users, session) => {
  const app = express();
  const { mode, views } = config;

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }
  app.use(session);
  app.use(express.urlencoded({ extended: true }));
  app.get('/', serveLandingPage(views));
  app.get('/user-name', serveUsername);

  app.get('/signup', protectedAuth, serveSignupPage(views));
  app.post('/signup', protectedAuth, credentialCheck, signupHandler(users));

  app.get('/host', validateAnchor, serveLobby(views));

  app.get('/login', protectedAuth, serveLoginPage(views));
  app.post('/login', protectedAuth, validateInput, loginHandler(users));
  app.get('/logout', logoutHandler);
  app.use(express.static('./public'));
  return app;
};

module.exports = { initApp };
