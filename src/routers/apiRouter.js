const express = require('express');

const { gameStats } = require('../handlers/game.js');
const { validStops, movePlayer } = require('../handlers/gameAPI.js');
const { serveLobbyStats } = require('../handlers/serveLobbyStats.js');
const { startGameHandler } = require('../handlers/startGameHandler.js');

const { authApi } = require('../middlewares/authAPIs.js');

const createApiRouter = () => {
  const apiRouter = express.Router();

  apiRouter.use(authApi);
  apiRouter.use(express.json());

  apiRouter.get('/lobby-stats', serveLobbyStats);
  apiRouter.post('/start', startGameHandler);
  apiRouter.get('/game-stats', gameStats);
  apiRouter.get('/valid-stops', validStops);
  apiRouter.post('/move', movePlayer);

  return apiRouter;
};

module.exports = { createApiRouter };