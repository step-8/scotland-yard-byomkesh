const injectLobby = (lobbies) => (req, res, next) => {
  const { lobbyId } = req.session;
  if (!lobbyId) {
    return next();
  }

  const lobby = lobbies.findLobby(lobbyId);
  req.session.lobby = lobby;
  next();
};

const injectLobbyId = lobbies => (req, _, next) => {
  const { username } = req.session;
  const playerLobbyId = lobbies.findJoineeLobbyId(username);

  if (playerLobbyId) {
    req.session.lobbyId = playerLobbyId;
  }
  next();
};

module.exports = { injectLobby, injectLobbyId };
