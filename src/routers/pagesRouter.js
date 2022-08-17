const express = require('express');
const { protectedAuth } = require('../handlers/authUsers');
const { authenticateUser } = require('../middleware/authValidations');
const { protectedGame } = require('../middleware/protectedGame');
const { serveLandingPage, serveLobby } = require('../handlers/servePages');
const { serveGamePage, serveLoginPage } = require('../handlers/servePages');
const { serveNotFoundPage } = require('../handlers/servePages');


const createPagesRouter = (views) => {
  const pagesRouter = express.Router();

  pagesRouter.get('/', authenticateUser, serveLandingPage(views));
  pagesRouter.get('/lobby', protectedGame, serveLobby(views));
  pagesRouter.get('/game', protectedGame, serveGamePage(views));
  pagesRouter.get('/login', protectedAuth, serveLoginPage(views));
  pagesRouter.use(serveNotFoundPage(views));

  return pagesRouter;
}

module.exports = { createPagesRouter };
