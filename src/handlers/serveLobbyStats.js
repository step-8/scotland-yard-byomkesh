const { mrX } = require("../utils/roles");

const serveLobbyStats = (req, res) => {
  const { game, username } = req.session;
  if (!game) {
    res.status(401).end();
  }
  const { players, isGameStarted } = game.getStatus();
  const currentPlayer = players.find(player =>
    player.username === req.session.username);
  const playerMrX = players.find(player => player.role === mrX);
  const isHost = currentPlayer.isHost;

  if (playerMrX && currentPlayer.role !== mrX) {
    playerMrX.currentPosition = 'XX';
  }

  res.json({ players, isGameStarted, isHost, username });
  return;
};

module.exports = { serveLobbyStats };
