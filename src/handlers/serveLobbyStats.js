const serveLobbyStats = (req, res) => {
  const { game, username } = req.session;
  if (!game) {
    res.status(401).end();
  }
  const { players, isGameStarted } = game.getStatus();
  const currentPlayer = players.find(player => player.username === req.session.username);
  const mrX = players.find(player => player.role === 'Mr. X');
  const isHost = currentPlayer.isHost;

  if (mrX && currentPlayer.role !== 'Mr. X') {
    mrX.currentPosition = 'XX';
  }

  res.json({ players, isGameStarted, isHost, username });
  return;
};

module.exports = { serveLobbyStats };
