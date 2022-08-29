const express = require('express');
const { protectedAuth } = require('../handlers/authUsers');
const { authenticateUser } = require('../middleware/authValidations.js');
const { protectedGame, protectedLobby } = require('../middleware/protectedGame.js');
const { serveLandingPage, serveLobby } = require('../handlers/servePages.js');
const { serveGamePage, serveLoginPage } = require('../handlers/servePages.js');
const { serveNotFoundPage } = require('../handlers/servePages.js');
const { redirectToGame, redirectToLobby } =
  require('../middleware/blockInvalidAccess.js');

const createPagesRouter = (views, games, lobbies) => {
  const pagesRouter = express.Router();
  pagesRouter.use([redirectToGame, redirectToLobby(lobbies)]);

  pagesRouter.get('/', authenticateUser, serveLandingPage(views));
  pagesRouter.get('/lobby', protectedLobby(lobbies), serveLobby(views));
  pagesRouter.get('/game', protectedGame(games), serveGamePage(views));
  pagesRouter.get('/login', protectedAuth, serveLoginPage(views));
  pagesRouter.use(serveNotFoundPage(views));

  return pagesRouter;
};

module.exports = { createPagesRouter };
