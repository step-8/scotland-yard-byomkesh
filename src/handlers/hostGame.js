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
  const message = 'Connection error : You are already in a Game';
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
  const { gameId } = req.query;
  req.session.gameId = gameId;

  const game = games.findGame(gameId);
  const player = new Player(username);

  game.addPlayer(player);

  res.redirect(`/lobby/${gameId}`);
};

module.exports = { hostGame, joinGame };
