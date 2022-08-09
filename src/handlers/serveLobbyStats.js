const serveLobbyStats = (req, res) => {
  const { game } = req.session;
  const { players, isGameStarted } = game.getStatus();
  res.json({ players, isGameStarted });
  return;
};

module.exports = { serveLobbyStats };
