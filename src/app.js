const express = require('express');
const morgan = require('morgan');

const { serveUsername } = require('./handlers/serveUsername.js');

const authLib = require('./handlers/authUsers.js');
const { loginHandler, logoutHandler, protectedAuth } = authLib;

const pagesLib = require('./handlers/servePages.js');
const { serveLandingPage, serveLobby, serveLoginPage, serveNotFoundPage, serveGamePage } = pagesLib;

const { protectedGame } = require('./middlewares/protectedGame.js');
const { injectGame } = require('./middlewares/injectGame.js');
const { authApi } = require('./middlewares/authAPIs.js');

const authValidators = require('./middlewares/authValidations.js');
const { validateInput, authenticateUser } = authValidators;

const { createAuthRouter } = require('./routers/authRouter.js');
const { createApiRouter } = require('./routers/apiRouter.js');
const { protectedRouter } = require('./routers/protectedRouter.js');

// app starts here --

const initApp = (config, users, games, session, writeFile) => {
  const app = express();
  const { mode, views, userDb } = config;

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }
  app.use(session);
  app.use(injectGame(games));
  app.use(express.urlencoded({ extended: true }));

  app.get('/', authenticateUser, serveLandingPage(views));

  app.use(protectedRouter(views, games));

  app.get('/logout', logoutHandler);
  app.get('/user-name', authApi, serveUsername);

  app.use(createAuthRouter(users, userDb, views, writeFile));

  app.get('/lobby', protectedGame, serveLobby(views));
  app.get('/game', protectedGame, serveGamePage(views));

  app.use('/api', createApiRouter());
  app.get('/login', protectedAuth, serveLoginPage(views));
  app.post('/login', protectedAuth, validateInput, loginHandler(users));

  app.use(express.static('./public'));
  app.use(serveNotFoundPage(views));
  return app;
};

module.exports = { initApp };
