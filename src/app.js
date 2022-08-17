const express = require('express');
const morgan = require('morgan');

const { injectGame } = require('./middleware/injectGame.js');
const { createAuthRouter } = require('./routers/authRouter.js');
const { createApiRouter } = require('./routers/apiRouter.js');
const { protectedRouter } = require('./routers/protectedRouter.js');
const { createPagesRouter } = require('./routers/pagesRouter.js');


const createGamePersister = (games, gamesFile, writeFile) => () => {
  writeFile(gamesFile, JSON.stringify(games.getState()), 'utf8');
};

const initApp = (config, users, games, session, writeFile) => {
  const app = express();
  const { mode, views, userDb, gamesDb } = config;
  const persistGames = createGamePersister(games, gamesDb, writeFile);

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }
  app.use(session);
  app.use(injectGame(games));
  app.use(express.urlencoded({ extended: true }));

  app.use(protectedRouter(games, persistGames));
  app.use(createAuthRouter(users, userDb, views, writeFile));

  app.use('/api', createApiRouter(persistGames));
  app.get('/end', (req, res) => {
    games.deleteGame(req.session.gameId);

    req.session.gameId = null;
    req.session.game = null;

    persistGames();
    res.redirect('/');
  });
  app.use(express.static('./public'));
  app.use(createPagesRouter(views));

  return app;
};

module.exports = { initApp };
