const express = require('express');

const { hostGame, joinGame } = require('../handlers/game.js');
const { authJoinRequest } = require('../middlewares/authJoinRequest.js');
const { authenticateUser } = require('../middlewares/authValidations.js');

const protectedRouter = (views, games) => {
  const router = express.Router();
  const routes = ['/host', '/join'];

  router.use(routes, authenticateUser);
  router.get('/host', hostGame(games));
  router.get('/join', authJoinRequest(games), joinGame(games));

  return router;
};

module.exports = { protectedRouter };
