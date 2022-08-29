const removeMrXPosition = (players) => {
  return players.map((player) => {
    if (player.color === 'black') {
      player.currentPosition = null;
    }
    return player;
  });
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

  if (!game.isMrX(username) && !game.isRevelationRound() && !gameOver) {
    players = removeMrXPosition(players);
    currentPlayer.currentPosition = null;
  }

  const robberLog = game.mrXLog();

  const stats = {
    playerName: username, players, currentPlayer, robberLog, strandedPlayers, leftPlayers, gameOver, winningStatus, round, twoXTakenAt
  };
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

module.exports = { gameStats, endGame };
