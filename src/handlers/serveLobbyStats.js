const serveLobbyStats = (req, res) => {
  const { game } = req.session;
  const { players, isGameStarted } = game.getStatus();
  const currentPlayer = players.find(player => player.username === req.session.username);
  const isHost = currentPlayer.isHost;
  res.json({ players, isGameStarted, isHost });
  return;
};

module.exports = { serveLobbyStats };
