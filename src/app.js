const express = require('express');
const morgan = require('morgan');

const { injectLobby, injectLobbyId } = require('./middleware/injectLobby.js');
const { injectGame, injectGameId } = require('./middleware/injectGame.js');
const { createAuthRouter } = require('./routers/authRouter.js');
const { createApiRouter } = require('./routers/apiRouter.js');
const { protectedRouter } = require('./routers/protectedRouter.js');
const { createPagesRouter } = require('./routers/pagesRouter.js');
const { endGame } = require('./handlers/game.js');
const { leaveLobby } = require('./handlers/leaveLobby.js');
const { leaveGame } = require('./handlers/leaveGame.js');
const { protectedLobby } = require('./middleware/protectedLobby.js');
const { loadGame, serveLoadGamePage } = require('./handlers/loadGameHandler.js');

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

const createLobbiesPersister = (lobbies, lobbyStore) => (lobbyId, callback) => {
  const lobby = lobbies.findLobby(lobbyId);
  const lobbyState = lobby.getState();

  lobbyStore.set(lobbyId, JSON.stringify(lobbyState))
    .then(() => {
      lobbyStore.set('nextLobbyId', lobbies.nextLobbyId);
    })
    .then(() => {
      callback();
    });
};

const initApp = (config, users, games, session, stores, lobbies) => {
  const app = express();
  const { mode, views } = config;
  const { gamesStore, usersStore, lobbiesStore } = stores;
  const persistGames = createGamePersister(games, gamesStore);
  const persistUser = createUserPersister(usersStore);
  const persistLobbies = createLobbiesPersister(lobbies, lobbiesStore);

  if (mode === 'dev') {
    app.use(morgan('tiny'));
  }

  app.use(session);
  app.use([injectLobbyId(lobbies), injectLobby(lobbies), injectGameId(games), injectGame(games)]);
  app.use(express.urlencoded({ extended: true }));

  app.use(protectedRouter(games, lobbies, persistLobbies));
  app.use(createAuthRouter(users, views, persistUser, lobbies));
  app.use('/api', createApiRouter(games, persistLobbies, persistGames));
  app.get('/end', endGame(games, gamesStore));
  app.post('/leave-lobby', protectedLobby, leaveLobby(persistLobbies));
  app.post('/leave-game', leaveGame(persistGames));

  app.get('/load-game', serveLoadGamePage(views));
  app.post('/load-game', loadGame(games, persistGames));

  app.use(express.static('./public'));
  app.use(createPagesRouter(views, games, lobbies));

  return app;
};

module.exports = { initApp };
