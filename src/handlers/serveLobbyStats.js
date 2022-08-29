const serveLobbyStats = (req, res) => {
  const { lobby, username } = req.session;

  if (!lobby) {
    return res.status(401).end();
  }

  const { joinees, isLobbyClosed, lobbyId } = lobby.forAPI();
  const isHost = lobby.isHost(username);
  res.json({ joinees, isLobbyClosed, isHost, username, lobbyId });
};

module.exports = { serveLobbyStats };
