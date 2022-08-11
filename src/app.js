const express = require('express');
const morgan = require('morgan');

const { serveUsername } = require('./handlers/serveUsername.js');

const { validateAnchor } = require('./middlewares/validateAnchor.js');
const { hostGame, joinGame } = require('./handlers/game.js');
const { authJoinRequest } = require('./middlewares/authJoinRequest.js');
const { protectedGame } = require('./middlewares/protectedGame.js');
const { injectGame } = require('./middlewares/injectGame.js');

const pagesLib = require('./handlers/servePages.js');
const { serveLandingPage, serveLobby, serveNotFoundPage } = pagesLib;

const { authApi } = require('./middlewares/authAPIs.js');
const { createAuthRouter } = require('./routers/authRouter.js');
const { createApiRouter } = require('./routers/apiRouter.js');

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
  app.get('/', serveLandingPage(views));
  app.get('/user-name', authApi, serveUsername);

  app.use(createAuthRouter(users, userDb, views, writeFile));

  app.get('/host', validateAnchor, hostGame(games));
  app.get('/join', authJoinRequest(games), validateAnchor, joinGame(games));
  app.get('/lobby/:gameId', protectedGame, serveLobby(views));

  app.use('/api', createApiRouter());

  app.use(express.static('./public'));
  app.use(serveNotFoundPage(views));
  return app;
};

module.exports = { initApp };
