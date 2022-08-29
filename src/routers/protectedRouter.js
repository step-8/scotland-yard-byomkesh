const express = require('express');

const { hostGame, joinGame } = require('../handlers/enrollment.js');
const { authJoinRequest } = require('../middleware/authJoinRequest.js');
const { authenticateUser } = require('../middleware/authValidations.js');
const { redirectToGame } = require('../middleware/blockInvalidAccess.js');
// const { injectGameId } = require('../middleware/injectGame.js');

const protectedRouter = (games, lobbies, persistLobbies) => {
  const router = express.Router();
  const routes = ['/host', '/join'];
  router.use(routes, authenticateUser, redirectToGame);

  router.get('/host', hostGame(games, lobbies, persistLobbies));
  router.get('/join', authJoinRequest(lobbies), joinGame(games, lobbies, persistLobbies));

  return router;
};

module.exports = { protectedRouter };
