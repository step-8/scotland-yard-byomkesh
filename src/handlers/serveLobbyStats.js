const serveLobbyStats = (req, res) => {
  const { game } = req.session;
  const players = game.getPlayers();
  res.json(players);
  return;
};

module.exports = { serveLobbyStats };
