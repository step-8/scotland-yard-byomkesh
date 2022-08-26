const express = require('express');
const compression = require('compression');

const { gameStats } = require('../handlers/game.js');
const { validStops, movePlayer, skipTurn, enableTwoX } = require('../handlers/gameAPI.js');
const { serveLobbyStats } = require('../handlers/serveLobbyStats.js');
const { serveUsername } = require('../handlers/serveUsername.js');
const { serveGameMap } = require('../handlers/servePages.js');
const { startGameHandler, initalStats, enterGame } = require('../handlers/startGameHandler.js');

const { authApi } = require('../middleware/authAPIs.js');

const createApiRouter = (lobbies, games, persistLobbies, persistGames) => {
  const apiRouter = express.Router();

  apiRouter.use(authApi);
  apiRouter.use(express.json());

  apiRouter.get('/lobby-stats', serveLobbyStats);
  apiRouter.post('/start', startGameHandler(games, persistLobbies, persistGames));
  apiRouter.put('/enter-game', enterGame(lobbies, games));
  apiRouter.get('/initial-stats', initalStats(persistGames));

  apiRouter.get('/game-stats', gameStats);
  apiRouter.get('/valid-stops', validStops);
  apiRouter.post('/move', movePlayer(persistGames));
  apiRouter.get('/user-name', serveUsername);
  apiRouter.post('/skip-turn', skipTurn(persistGames));
  apiRouter.post('/enable-two-x', enableTwoX(persistGames));
  apiRouter.get('/game-map', compression({ level: 9 }), serveGameMap);

  return apiRouter;
};

module.exports = { createApiRouter };
