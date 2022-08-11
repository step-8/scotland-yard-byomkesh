const express = require('express');
const { gameStats } = require('../handlers/game.js');

const { serveLobbyStats } = require('../handlers/serveLobbyStats.js');
const { startGameHandler } = require('../handlers/startGameHandler.js');

const { authApi } = require('../middlewares/authAPIs.js');

const createApiRouter = () => {
  const apiRouter = express.Router();

  apiRouter.use(authApi);
  apiRouter.get('/lobby-stats', serveLobbyStats);
  apiRouter.post('/start', startGameHandler);
  apiRouter.get('/game-stats', gameStats);

  return apiRouter;
};

module.exports = { createApiRouter };