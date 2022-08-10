const express = require('express');
const morgan = require('morgan');

const { serveUsername } = require('./handlers/serveUsername.js');

const authLib = require('./handlers/authUsers.js');
const { signupHandler, protectedAuth } = authLib;
const { loginHandler, logoutHandler } = authLib;

const { validateAnchor } = require('./middlewares/validateAnchor.js');
const { hostGame, joinGame } = require('./handlers/hostGame.js');
const { authJoinRequest } = require('./middlewares/authJoinRequest.js');
const { protectedLobby } = require('./middlewares/protectedLobby.js');
const { injectGame } = require('./middlewares/injectGame.js');

const pagesLib = require('./handlers/servePages.js');
const { serveLandingPage, serveSignupPage, serveLobby, serveLoginPage, serveNotFoundPage } = pagesLib;

const { serveLobbyStats } = require('./handlers/serveLobbyStats.js');

const authValidators = require('./middlewares/authValidations.js');
const { credentialCheck, validateInput } = authValidators;

const { startGameHandler } = require('./handlers/startGameHandler.js');

// app starts here --

const initApp = (config, users, games, session, writeFile) => {
  const app = express();
  const { mode, views, userDb } = config;

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }
  app.use(session);
  app.use(express.urlencoded({ extended: true }));
  app.get('/', serveLandingPage(views));
  app.get('/user-name', serveUsername);

  app.get('/signup', protectedAuth, serveSignupPage(views));
  app.post('/signup', protectedAuth, credentialCheck, signupHandler(users, userDb, writeFile));

  app.get('/host', validateAnchor, hostGame(games));
  app.get('/join', authJoinRequest(games), validateAnchor, joinGame(games));
  app.get('/lobby/:gameId', protectedLobby, serveLobby(views))

  app.get('/login', protectedAuth, serveLoginPage(views));
  app.post('/login', protectedAuth, validateInput, loginHandler(users));

  app.get('/host', validateAnchor, hostGame(games));
  app.get('/lobby/:gameId', protectedLobby, serveLobby(views));

  app.get('/api/lobby-stats', injectGame(games), serveLobbyStats);

  app.get('/logout', logoutHandler);

  app.post('/api/start', startGameHandler(games));
  app.use(express.static('./public'));

  app.use(serveNotFoundPage(views));
  return app;
};

module.exports = { initApp };
