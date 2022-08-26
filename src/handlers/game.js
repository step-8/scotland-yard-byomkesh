const { Player } = require('../models/player.js');
const { mrX } = require('../utils/roles.js');

const isCurrentPlayerLeft = (leftPlayers, currentPlayer) => {
  const { username } = currentPlayer;
  return leftPlayers.some((player) => player.username === username);
};

const hostGame = (games, persistGames) => (req, res) => {
  const { username } = req.session;
  const player = new Player(username);
  const game = games.createGame();

  game.addPlayer(player);
  const gameId = game.gameId;

  req.session.gameId = gameId;
  req.session.game = game;

  persistGames(gameId, () => {
    res.redirect('/lobby');
  });
};

const joinGame = (games, persistGames) => (req, res) => {
  const { username } = req.session;

  const { gameId } = req.query;
  req.session.gameId = gameId;

  const game = games.findGame(gameId);
  const player = new Player(username);

  game.addPlayer(player);

  persistGames(gameId, () => {
    res.redirect('/lobby');
  });
};

const isMrX = (players, playerName) => {
  const me = players.find(({ username }) => username === playerName);
  return me.color === 'black';
};

const removeMrXPosition = (players) => {
  return players.map((player) => {
    if (player.color === 'black') {
      player.currentPosition = null;
    }
    return player;
  });
};

const getRobberLog = (players) => {
  const robber = players.find(({ role }) => role === mrX);
  return robber ? robber.log : [];
};

const gameStats = (req, res) => {
  const { game, username } = req.session;
  if (!game) {
    return res.status(404).json({ error: 'Game Does not exist.' });
  }
  let players = game.getPlayers();
  const currentPlayer = game.currentPlayer;
  const {
    strandedPlayers, gameOver, winningStatus, round, twoXTakenAt, leftPlayers
  } = game.getState();

  if (!isMrX(players, username) && !game.isRevelationRound()) {
    players = removeMrXPosition(players);
    currentPlayer.currentPosition = null;
  }

  const robberLog = getRobberLog(players);

  const stats = {
    playerName: username, players, currentPlayer, robberLog, strandedPlayers, leftPlayers, gameOver, winningStatus, round, twoXTakenAt
  };

  if (isCurrentPlayerLeft(leftPlayers, currentPlayer)) {
    game.changeCurrentPlayer();
  }

  res.json(stats);
};

const endGame = (games, gamesStore) => (req, res) => {
  const { gameId } = req.session;

  req.session.gameId = null;
  req.session.game = null;

  games.deleteGame(gameId);
  gamesStore.delete(gameId)
    .then(() => res.redirect('/'))
    .catch((err) => res.redirect('/'))
};

module.exports = { hostGame, joinGame, getRobberLog, gameStats, endGame };
