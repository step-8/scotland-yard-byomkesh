const express = require('express');

const { hostGame, joinGame } = require('../handlers/game.js');
const { authJoinRequest } = require('../middleware/authJoinRequest.js');
const { authenticateUser } = require('../middleware/authValidations.js');

const protectedRouter = (games, persistGames) => {
  const router = express.Router();
  const routes = ['/host', '/join'];
  router.use(routes, authenticateUser);

  router.get('/host', hostGame(games, persistGames));
  router.get('/join', authJoinRequest(games), joinGame(games, persistGames));

  return router;
};

module.exports = { protectedRouter };
