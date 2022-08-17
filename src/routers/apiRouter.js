const express = require('express');

const { gameStats } = require('../handlers/game.js');
const { validStops, movePlayer } = require('../handlers/gameAPI.js');
const { serveLobbyStats } = require('../handlers/serveLobbyStats.js');
const { serveUsername } = require('../handlers/serveUsername.js');
const { startGameHandler } = require('../handlers/startGameHandler.js');

const { authApi } = require('../middleware/authAPIs.js');

const createApiRouter = (persistGames) => {
  const apiRouter = express.Router();

  apiRouter.use(authApi);
  apiRouter.use(express.json());

  apiRouter.get('/lobby-stats', serveLobbyStats);
  apiRouter.post('/start', startGameHandler(persistGames));
  apiRouter.get('/game-stats', gameStats);
  apiRouter.get('/valid-stops', validStops);
  apiRouter.post('/move', movePlayer(persistGames));
  apiRouter.get('/user-name', serveUsername);

  return apiRouter;
};

module.exports = { createApiRouter };