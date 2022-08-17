const { Player } = require('../models/player.js');
const { mrX } = require('../utils/roles.js');

const isPlayerInGame = (games, username) => {
  const allGames = games.getAllGames();

  return allGames.some(game => {
    const { players } = game.getStatus();
    return players.some(player => player.username === username);
  });
};

const sendConnectionError = (req, res) => {
  const message = 'You are already in a Game';
  res.cookie('connError', message, { maxAge: 1000 });
  res.redirect(302, '/');
};

const hostGame = (games, persistGames) => (req, res) => {
  const { username } = req.session;
  if (isPlayerInGame(games, username)) {
    sendConnectionError(req, res);
    return;
  }
  const player = new Player(username);
  const game = games.createGame();

  game.addPlayer(player);
  const gameId = game.gameId;

  req.session.gameId = gameId;
  req.session.game = game;

  persistGames();
  res.redirect('/lobby');
};

const joinGame = (games, persistGames) => (req, res) => {
  const { username } = req.session;
  if (isPlayerInGame(games, username)) {
    sendConnectionError(req, res);
    return;
  }

  const { gameId } = req.query;
  req.session.gameId = gameId;

  const game = games.findGame(gameId);
  const player = new Player(username);

  game.addPlayer(player);

  persistGames();
  res.redirect('/lobby');
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
  let players = game.getPlayers();
  const currentPlayer = game.currentPlayer;

  if (!isMrX(players, username)) {
    players = removeMrXPosition(players);
    currentPlayer.currentPosition = null;
  }

  const robberLog = getRobberLog(players);

  const stats = { playerName: username, players, currentPlayer, robberLog };

  res.json(stats);
};

module.exports = { hostGame, joinGame, getRobberLog, gameStats };
