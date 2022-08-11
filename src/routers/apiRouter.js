const express = require('express');

const { serveLobbyStats } = require('../handlers/serveLobbyStats.js');
const { startGameHandler } = require('../handlers/startGameHandler.js');

const { authApi } = require('../middlewares/authAPIs.js');

const createApiRouter = () => {
  const apiRouter = express.Router();

  apiRouter.use(authApi);
  apiRouter.get('/lobby-stats', serveLobbyStats);
  apiRouter.post('/start', startGameHandler);

  return apiRouter;
};

module.exports = { createApiRouter };