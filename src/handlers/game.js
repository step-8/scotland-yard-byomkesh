const { Player } = require('../models/player.js');

const isPlayerInGame = (games, username) => {
  const allGames = Object.values(games.games);
  return allGames.some(game => {
    const { players } = game.getStatus();
    return players.some(player => {
      if (player.username === username) {
        return true;
      }
    });
  });
};

const sendConnectionError = (req, res) => {
  const message = 'You are already in a Game';
  res.cookie('connError', message, { maxAge: 1000 });
  res.redirect(302, '/');
  return;
};

const hostGame = (games) => (req, res) => {
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
  res.redirect(`/lobby/${gameId}`);
  return;
};

const joinGame = (games) => (req, res) => {
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

  res.redirect(`/lobby/${gameId}`);
};

const isMrX = (players, playerName) => {
  const me = players.find(({ username }) => username === playerName);
  return me.color === 'black';
};

const removeMrX = (players) => {
  return players.filter(({ color }) => color !== 'black');
};

const gameStats = (req, res) => {
  const { game, username } = req.session;
  let players = game.getPlayers();
  let currentPlayer = game.currentPlayer;

  if (!isMrX(players, username)) {
    players = removeMrX(players);
    currentPlayer.currentPosition = null;
  }

  const stats = { playerName: username, players, currentPlayer };

  res.json(stats);
};

module.exports = { hostGame, joinGame, gameStats };
