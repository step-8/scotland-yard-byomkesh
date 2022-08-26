// const { Player } = require('../models/player.js');
const { mrX } = require('../utils/roles.js');

const isCurrentPlayerLeft = (leftPlayers, currentPlayer) => {
  const { username } = currentPlayer;
  return leftPlayers.some((player) => player.username === username);
};
const sendConnectionError = (req, res) => {
  const message = 'You are already in a Game';
  res.cookie('connError', message, { maxAge: 1000 });
  res.redirect(302, '/');
};

const isInGame = (username, games, lobbies) => {
  return games.isPlayerInGame(username) || lobbies.isPlayerInLobby(username);
};

const hostGame = (games, lobbies, persistLobbies) => (req, res) => {
  const { username } = req.session;
  if (isInGame(username, games, lobbies)) {
    sendConnectionError(req, res);
    return;
  }
  const limit = { min: 3, max: 6 };
  const lobby = lobbies.createLobby(username, limit);
  const lobbyId = lobby.lobbyId;

  req.session.lobbyId = lobbyId;
  req.session.lobby = lobby;

  persistLobbies(lobbyId, () => {
    res.redirect('/lobby');
  });
};

const joinGame = (games, lobbies, persistLobbies) => (req, res) => {
  const { username } = req.session;
  if (isInGame(username, games, lobbies)) {
    sendConnectionError(req, res);
    return;
  }

  const { gameId } = req.query;
  const lobbyId = +gameId;
  const lobby = lobbies.findLobby(lobbyId);
  lobby.addJoinee(username);

  req.session.lobbyId = lobbyId;
  req.session.lobby = lobby;

  persistLobbies(lobbyId, () => {
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
    .catch(() => res.redirect('/'));
};

module.exports = { hostGame, joinGame, getRobberLog, gameStats, endGame };
