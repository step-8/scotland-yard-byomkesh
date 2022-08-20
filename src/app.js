const express = require('express');
const morgan = require('morgan');

const { injectGame } = require('./middleware/injectGame.js');
const { createAuthRouter } = require('./routers/authRouter.js');
const { createApiRouter } = require('./routers/apiRouter.js');
const { protectedRouter } = require('./routers/protectedRouter.js');
const { createPagesRouter } = require('./routers/pagesRouter.js');

const createGamePersister = (games, gamesStore) => (gameId, callback) => {
  const game = games.findGame(gameId);
  const gameState = game.getState();

  gamesStore.set(gameId, JSON.stringify(gameState))
    .then(() => gamesStore.set('newGameId', games.getNextGameId()))
    .then(() => callback());
};

const createUserPersister = (usersStore) => (username, password, callback) => {
  usersStore.set(username, JSON.stringify({ username, password }))
    .then(() => callback());
};

const initApp = (config, users, games, session, stores) => {
  const app = express();
  const { mode, views } = config;
  const { gamesStore, usersStore } = stores;
  const persistGames = createGamePersister(games, gamesStore);
  const persistUser = createUserPersister(usersStore);

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }
  app.use(session);
  app.use(injectGame(games));
  app.use(express.urlencoded({ extended: true }));

  app.use(protectedRouter(games, persistGames));
  app.use(createAuthRouter(users, views, persistUser));

  app.use('/api', createApiRouter(persistGames));
  app.get('/end', (req, res) => {
    const { gameId } = req.session;
    games.deleteGame(gameId);

    req.session.gameId = null;
    req.session.game = null;

    gamesStore.delete(gameId);
    res.redirect('/');
  });
  app.use(express.static('./public'));
  app.use(createPagesRouter(views));

  return app;
};

module.exports = { initApp };
