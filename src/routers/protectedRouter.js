const express = require('express');

const { hostGame, joinGame } = require('../handlers/game.js');
const { authJoinRequest } = require('../middleware/authJoinRequest.js');
const { authenticateUser } = require('../middleware/authValidations.js');
const { injectGameId } = require('../middleware/injectGame.js');

const protectedRouter = (games, lobbies, persistLobbies) => {
  const router = express.Router();
  const routes = ['/host', '/join'];
  router.use(routes, authenticateUser, injectGameId(games));

  router.get('/host', hostGame(games, lobbies, persistLobbies));
  router.get('/join', authJoinRequest(lobbies), joinGame(games, lobbies, persistLobbies));

  return router;
};

module.exports = { protectedRouter };
